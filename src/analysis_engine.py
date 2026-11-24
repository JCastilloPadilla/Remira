"""Evidence-first local analysis. URLs are inspected as strings, never fetched."""
from dataclasses import asdict
import ipaddress
import re
from threading import Lock
from urllib.parse import parse_qs, unquote, urlsplit

from langdetect import DetectorFactory, detect_langs, LangDetectException
from src.email_data import EmailData
from src.hf_classifier import SpanishSpamClassifier, PhishingEmailClassifier, SPANISH_MODEL_NAME, MODEL_NAME
from src.corpus_decision import CorpusNotReadyError, require_readable_content, decide_email, is_negated

DetectorFactory.seed = 0
URL_RE = re.compile(r'https?://[^\s<>"\']+', re.I)
MODELS = {'es': SPANISH_MODEL_NAME, 'en': MODEL_NAME}


def detect_language(text):
    words = set(re.findall(r'[a-záéíóúñ]+', text.lower()))
    # Short messages are unreliable for statistical language detection.
    if len(words) < 7:
        if words & {'tu', 'cuenta', 'verifica', 'factura', 'aviso', 'consulta', 'correo', 'hola'}:
            return 'es'
        if words & {'your', 'the', 'please', 'account', 'invoice', 'hello', 'password'}:
            return 'en'
        return 'unknown'
    try:
        predictions = detect_langs(text)
        return predictions[0].lang if predictions[0].prob >= .80 else 'unknown'
    except LangDetectException:
        return 'unknown'


def analyze_links(links):
    results = []
    for link in links:
        url = link['url'].strip()
        issues = []
        decoded = None
        try:
            parsed = urlsplit(url)
            host = (parsed.hostname or '').lower().rstrip('.')
            if parsed.scheme in ('mailto', 'tel'):
                issues.append('non_web_contact')
            elif parsed.scheme not in ('https', 'http') or not host:
                issues.append('unsupported_or_invalid_url')
            if parsed.username is not None:
                issues.append('embedded_credentials')
            if host.startswith('xn--') or '.xn--' in host:
                issues.append('internationalized_host')
            try:
                ipaddress.ip_address(host)
                issues.append('ip_address_host')
            except ValueError:
                pass
            displayed = URL_RE.search(link['text'])
            if not displayed and re.fullmatch(r'(?:www\.)?[\w.-]+\.[a-z]{2,}(?:/\S*)?', link['text'].strip(), re.I):
                displayed_url = 'https://' + link['text'].strip()
            else:
                displayed_url = displayed.group() if displayed else ''
            for key, values in parse_qs(parsed.query).items():
                if key.lower() in {'url', 'u', 'q', 'target', 'redirect', 'redirect_uri', 'redirect_url', 'dest', 'destination', 'continue', 'next'}:
                    candidate = values[0]
                    for _ in range(3):
                        candidate = unquote(candidate)
                    target = urlsplit(candidate)
                    if target.scheme in ('https', 'http') and target.hostname:
                        decoded = candidate
                        if target.hostname.lower().rstrip('.') != host:
                            issues.append('external_redirect_destination')
                        break
            destination_host = (urlsplit(decoded).hostname or '').lower().rstrip('.') if decoded else host
            if displayed_url and (urlsplit(displayed_url).hostname or '').lower().rstrip('.') != destination_host:
                issues.append('display_host_mismatch')
        except (ValueError, UnicodeError):
            host = ''
            issues.append('unsupported_or_invalid_url')
        item = {'url': url, 'host': host, 'issues': list(dict.fromkeys(issues))}
        if decoded:
            item['decoded_url'] = decoded
        results.append(item)
    return results


def validate_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError('Se requiere un objeto con asunto y cuerpo.')
    for key, limit in [('subject', 5000), ('body', 100000), ('sender', 5000)]:
        if not isinstance(payload.get(key, ''), str) or len(payload.get(key, '')) > limit:
            raise ValueError('Asunto, cuerpo o remitente inválidos o demasiado largos.')
    coverage = {'images_total': 0, 'images_pending': 0, 'ocr_low_confidence': False, 'links_complete': True}
    raw = payload.get('coverage', {})
    if not isinstance(raw, dict):
        raise ValueError('Cobertura inválida.')
    coverage.update({k: raw[k] for k in coverage if k in raw})
    if any(type(coverage[k]) is not int or not 0 <= coverage[k] <= 10000 for k in ('images_total', 'images_pending')) or coverage['images_pending'] > coverage['images_total']:
        raise ValueError('Conteo de imágenes inválido.')
    if any(type(coverage[k]) is not bool for k in ('ocr_low_confidence', 'links_complete')):
        raise ValueError('Indicadores de cobertura inválidos.')
    if not (payload.get('subject', '').strip() or payload.get('body', '').strip() or coverage['images_total']):
        raise ValueError('El correo está vacío.')
    links = payload.get('links', [])
    if not isinstance(links, list) or len(links) > 1000 or any(not isinstance(x, dict) or any(not isinstance(x.get(k), str) or len(x[k]) > 10000 for k in ('url', 'text')) for x in links):
        raise ValueError('Enlaces inválidos.')
    auth = payload.get('authentication', {'source': 'unavailable'})
    if not isinstance(auth, dict) or any(not isinstance(auth.get(k, ''), str) or len(auth.get(k, '')) > 1000 for k in ('source', 'spf', 'dkim', 'dmarc')):
        raise ValueError('Autenticación declarada inválida.')
    return coverage, links, {**{k: v for k, v in auth.items() if k in ('source', 'spf', 'dkim', 'dmarc')}, 'source': auth.get('source', 'unavailable'), 'verified': False}


class AnalysisEngine:
    def __init__(self, classifier_factory=None, model_provider=None, corpus_provider=None):
        self.classifier_factory = classifier_factory
        self.model_provider = model_provider
        self.classifiers = {}
        self.lock = Lock()
        self.use_corpus = corpus_provider is not None or (classifier_factory is None and model_provider is None)
        self.corpus_provider = corpus_provider
        self.corpus_classifier = None

    def health(self):
        from pathlib import Path
        corpus_available = (Path(__file__).resolve().parents[1] / 'models/corpus-v1.joblib').is_file()
        return {'status': 'ok', 'task': 'corpus_email_classification' if self.use_corpus else 'hybrid_email_analysis', 'local_only': True,
                'corpus': {'enabled': self.use_corpus, 'artifact_available': corpus_available, 'loaded': self.corpus_classifier is not None},
                'model': SPANISH_MODEL_NAME, 'model_loaded': bool(self.classifiers), 'models': {lang: {'model': name, 'loaded': lang in self.classifiers, 'readiness': 'loaded' if lang in self.classifiers else 'not_loaded'} for lang, name in MODELS.items()}}

    def analyze(self, payload):
        coverage, supplied_links, auth = validate_payload(payload)
        email = EmailData(subject=payload.get('subject', ''), body=payload.get('body', ''), sender=payload.get('sender'))
        text = email.combined_text()
        language = detect_language(text)
        corpus_prediction = None
        if self.use_corpus:
            require_readable_content(payload)
            try:
                with self.lock:
                    if self.corpus_classifier is None:
                        if self.corpus_provider is None:
                            from src.corpus_classifier import load_default_classifier
                            self.corpus_classifier = load_default_classifier()
                        else:
                            self.corpus_classifier = self.corpus_provider()
                    corpus_prediction = self.corpus_classifier.predict(email.subject, email.body, language=language)
            except Exception:
                raise CorpusNotReadyError('El clasificador propio no está listo. Prepara la base de datos y entrena el corpus con los comandos del proyecto.') from None
        links = list(supplied_links)
        supplied_urls = {x['url'] for x in links}
        links.extend({'text': url, 'url': url} for url in dict.fromkeys(URL_RE.findall(text)) if url not in supplied_urls)
        reports = analyze_links(links)
        reasons, limitations = [], ['El remitente visible no verifica identidad. No se visitaron enlaces ni se verificaron cabeceras.']
        def reason(code, severity, message):
            if not any(r['code'] == code for r in reasons):
                reasons.append({'code': code, 'severity': severity, 'message': message})
        for link in reports:
            for issue in link['issues']:
                reason(issue, 'info' if issue == 'non_web_contact' else 'danger' if issue in ('display_host_mismatch', 'embedded_credentials') else 'warning', {
                    'non_web_contact': 'Enlace de contacto (correo o teléfono); no es una página web.',
                    'display_host_mismatch': 'El dominio visible del enlace difiere de su destino.',
                    'embedded_credentials': 'El enlace contiene credenciales antes del dominio real.',
                    'external_redirect_destination': 'El enlace incluye otro destino en sus parámetros; se muestra sin visitarlo.',
                    'internationalized_host': 'El dominio usa codificación internacional: revisa posibles caracteres parecidos.',
                    'ip_address_host': 'El enlace usa una dirección IP en vez de un dominio.',
                    'unsupported_or_invalid_url': 'El destino no es un enlace web válido o compatible.'}[issue])
        requests = re.finditer(r'\b(?:env[ií]a|comparte|compartas|introduce|introduzca|ingresa|confirma|proporciona|proporcione|facilita|facilite|escribe|send|enter|provide|share|submit|type)\b[^.!?\n]{0,65}(?:contrase[nñ]a|password|c[oó]digo de verificaci[oó]n|verification code|n[uú]mero de tarjeta|card number)', text, re.I)
        sensitive = any(not is_negated(text, match.start()) for match in requests)
        if sensitive:
            reason('requests_sensitive_data', 'danger', 'El mensaje pide introducir o compartir credenciales, códigos o datos de tarjeta.')
        response = {'label': 'unavailable', 'confidence': None, 'max_tokens': 512, 'model': MODELS.get(language), 'language': language, 'task': 'spam_detection' if language == 'es' else 'phishing_detection' if language == 'en' else 'unavailable'}
        metrics = {'language': language, 'token_count': 0, 'processed_tokens': 0, 'truncated': False}
        missing_model = True
        if language in MODELS and text.strip():
            with self.lock:
                try:
                    if language not in self.classifiers:
                        self.classifiers[language] = self.model_provider(language) if self.model_provider else self.classifier_factory() if self.classifier_factory else (SpanishSpamClassifier if language == 'es' else PhishingEmailClassifier)(local_files_only=True)
                    classifier = self.classifiers[language]
                    tokenizer = getattr(classifier, 'tokenizer', None)
                    if tokenizer is not None:
                        prepared = classifier.prepare_text(email) if hasattr(classifier, 'prepare_text') else ' '.join(text.split())
                        count = len(tokenizer(prepared, truncation=False, add_special_tokens=True)['input_ids'])
                        metrics.update(token_count=count, processed_tokens=min(count, 512), truncated=count > 512)
                    else:
                        limitations.append('El clasificador proporcionado no expone tokenizador; conteos de tokens no disponibles (0).')
                    response.update(asdict(classifier.classify(email)))
                    missing_model = False
                except Exception:
                    limitations.append('El modelo local no está disponible; no se obtuvo una opinión del modelo.')
        else:
            limitations.append('Idioma no soportado o texto insuficiente para identificarlo; no se ejecutó un modelo.')
        incomplete = coverage['images_pending'] > 0 or coverage['ocr_low_confidence'] or not coverage['links_complete']
        if incomplete:
            limitations.append('La revisión de imágenes, OCR o enlaces está incompleta.')
        if metrics['truncated']:
            limitations.append('El texto excede el límite del modelo; solo se procesaron los primeros 512 tokens.')
        negative = response['label'] in ('spam', 'malicious')
        if negative:
            reason('model_auxiliary_flag', 'info', 'El modelo señala spam o contenido malicioso; su puntuación no es una probabilidad calibrada de seguridad ni prueba de phishing.')
        concrete = any(r['severity'] == 'danger' for r in reasons)
        verdict = 'suspicious' if concrete else 'inconclusive' if missing_model or incomplete or metrics['truncated'] or negative or any(r['severity'] == 'warning' for r in reasons) else 'no_clear_signals'
        if verdict == 'no_clear_signals':
            reason('no_clear_signals', 'info', 'No se hallaron señales claras en el contenido revisado; esto no garantiza que sea seguro.')
        response['assessment'] = {'verdict': verdict, 'reasons': reasons, 'limitations': limitations, 'text': metrics, 'coverage': coverage, 'links': reports, 'authentication': auth}
        if corpus_prediction is not None:
            response.update(decide_email(payload, response['assessment'], corpus_prediction))
        return response
