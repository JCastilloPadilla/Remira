"""API para pruebas locales: python -m src.api. No guarda contenido de correos."""

import re
from typing import Callable

from flask import Flask, jsonify, request
from werkzeug.exceptions import BadRequest, RequestEntityTooLarge

from src.analysis_engine import AnalysisEngine
from src.eml_parser import parse_eml, MAX_EML_BYTES
from src.corpus_decision import CorpusNotReadyError

LOCAL_WEB_ORIGINS = {
    'http://127.0.0.1:5173',
    'http://localhost:5173',
}


def create_app(classifier_factory: Callable | None = None, corpus_provider: Callable | None = None) -> Flask:
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 450_000
    engine = AnalysisEngine(classifier_factory=classifier_factory, corpus_provider=corpus_provider)

    @app.before_request
    def restrict_local_access():
        request.max_content_length = MAX_EML_BYTES + 100_000 if request.path == '/api/analyze-eml' else 450_000
        # También evita DNS rebinding: no basta con escuchar en loopback.
        if not re.fullmatch(r'(127\.0\.0\.1|localhost)(:\d+)?', request.host, re.IGNORECASE):
            return jsonify(error='Solo se permite acceso local.'), 403
        origin = request.headers.get('Origin')
        if origin is not None and origin not in LOCAL_WEB_ORIGINS and not re.fullmatch(r'chrome-extension://[a-p]{32}', origin):
            return jsonify(error='Origen no permitido. Usa la aplicación local.'), 403

    @app.after_request
    def no_cache(response):
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        origin = request.headers.get('Origin')
        if origin in LOCAL_WEB_ORIGINS:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    @app.errorhandler(RequestEntityTooLarge)
    def request_too_large(_error):
        return jsonify(error='El contenido excede el tamaño permitido.'), 413

    @app.get('/api/health')
    def health():
        return jsonify(engine.health())

    @app.post('/api/analyze')
    def analyze():
        if not request.is_json:
            return jsonify(error='Envía asunto y cuerpo como JSON.'), 415
        try:
            payload = request.get_json()
        except BadRequest:
            return jsonify(error='JSON inválido.'), 400
        try:
            return jsonify(engine.analyze(payload))
        except CorpusNotReadyError as error:
            return jsonify(error=str(error)), 503
        except ValueError as error:
            return jsonify(error=str(error)), 400

    @app.post('/api/analyze-eml')
    def analyze_eml():
        if 'file' not in request.files:
            return jsonify(error='Adjunta un archivo .eml en el campo file.'), 400
        upload = request.files['file']
        if not upload.filename or not upload.filename.lower().endswith('.eml'):
            return jsonify(error='Se requiere un archivo .eml.'), 400
        raw = upload.read(MAX_EML_BYTES + 1)
        if len(raw) > MAX_EML_BYTES:
            return jsonify(error='El archivo excede 8 MiB.'), 413
        try:
            email = parse_eml(raw)
            result = engine.analyze(email)
            return jsonify(**result, email=email)
        except CorpusNotReadyError as error:
            return jsonify(error=str(error)), 503
        except (ValueError, RecursionError):
            return jsonify(error='Archivo .eml inválido o supera los límites de extracción.'), 400

    return app


if __name__ == '__main__':
    create_app().run(host='127.0.0.1', port=8765, debug=False, use_reloader=False, threaded=True)
