"""API para pruebas locales: python -m src.api. No guarda contenido de correos."""

from dataclasses import asdict
import re
from threading import Lock
from typing import Callable

from flask import Flask, jsonify, request
from werkzeug.exceptions import BadRequest, RequestEntityTooLarge

from src.email_data import EmailData
from src.hf_classifier import MODEL_NAME, PhishingEmailClassifier


def create_app(classifier_factory: Callable | None = None) -> Flask:
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 450_000
    factory = classifier_factory or (lambda: PhishingEmailClassifier(local_files_only=True))
    classifier = None
    inference_lock = Lock()

    @app.before_request
    def restrict_local_access():
        # También evita DNS rebinding: no basta con escuchar en loopback.
        if not re.fullmatch(r'(127\.0\.0\.1|localhost)(:\d+)?', request.host, re.IGNORECASE):
            return jsonify(error='Solo se permite acceso local.'), 403
        origin = request.headers.get('Origin')
        if origin is not None and not re.fullmatch(r'chrome-extension://[a-p]{32}', origin):
            return jsonify(error='Origen no permitido. Usa la extensión local.'), 403

    @app.after_request
    def no_cache(response):
        response.headers['Cache-Control'] = 'no-store'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    @app.errorhandler(RequestEntityTooLarge)
    def request_too_large(_error):
        return jsonify(error='El contenido excede el tamaño permitido.'), 413

    @app.get('/api/health')
    def health():
        return jsonify(status='ok', model=MODEL_NAME, model_loaded=classifier is not None, local_only=True)

    @app.post('/api/analyze')
    def analyze():
        nonlocal classifier
        if not request.is_json:
            return jsonify(error='Envía asunto y cuerpo como JSON.'), 415
        try:
            payload = request.get_json()
        except BadRequest:
            return jsonify(error='JSON inválido.'), 400
        if not isinstance(payload, dict):
            return jsonify(error='Se requiere un objeto con asunto y cuerpo.'), 400
        subject, body = payload.get('subject', ''), payload.get('body', '')
        if not isinstance(subject, str) or not isinstance(body, str):
            return jsonify(error='Asunto y cuerpo deben ser texto.'), 400
        if not (subject.strip() or body.strip()):
            return jsonify(error='El correo está vacío.'), 400
        if len(subject) > 5000 or len(body) > 100_000:
            return jsonify(error='Máximo: 5,000 caracteres de asunto y 100,000 de cuerpo.'), 400
        email = EmailData(subject=subject, body=body)
        # Serializa carga e inferencia para no duplicar el modelo ni saturar memoria.
        with inference_lock:
            try:
                if classifier is None:
                    classifier = factory()
                result = classifier.classify(email)
            except Exception:
                # No incluir el correo ni detalles internos de excepciones en respuestas/logs.
                return jsonify(error='No se pudo ejecutar el modelo local. Revisa su caché y el entorno Python.'), 503
        return jsonify(**asdict(result), max_tokens=512, model=MODEL_NAME)

    return app


if __name__ == '__main__':
    create_app().run(host='127.0.0.1', port=8765, debug=False, use_reloader=False, threaded=True)
