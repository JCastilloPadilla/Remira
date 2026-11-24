import io
import pytest
from src.api import create_app
from src.hf_classifier import ClassificationResult

class Classifier:
    def classify(self, email):
        return ClassificationResult('not_spam', .9, 'not_spam')

def analyze(payload, factory=Classifier):
    return create_app(classifier_factory=factory).test_client().post('/api/analyze', json=payload)

def test_model_is_only_an_auxiliary_opinion():
    result = analyze({'body': 'Tu factura del servicio está disponible para consultar.'}).json
    assert result['assessment']['verdict'] == 'no_clear_signals'

def test_mismatching_link_is_concrete_evidence():
    result = analyze({'body': 'Consulta tu factura', 'links': [{'text': 'https://banco.example', 'url': 'https://evil.example/login'}]}).json
    assert result['assessment']['verdict'] == 'suspicious'
    assert 'display_host_mismatch' in result['assessment']['links'][0]['issues']

def test_unavailable_model_returns_inconclusive():
    def missing():
        raise RuntimeError('secret')
    response = analyze({'body': 'Tu factura está disponible para consultar.'}, missing)
    assert response.status_code == 200
    assert response.json['label'] == 'unavailable'
    assert response.json['assessment']['verdict'] == 'inconclusive'
    assert 'secret' not in response.get_data(as_text=True)

@pytest.mark.parametrize('coverage', [{'images_total': 2, 'images_pending': 1}, {'images_total': 1, 'images_pending': 0, 'ocr_low_confidence': True}, {'images_total': 0, 'images_pending': 0, 'links_complete': False}])
def test_incomplete_coverage_abstains(coverage):
    assert analyze({'body': 'Tu factura está disponible', 'coverage': coverage}).json['assessment']['verdict'] == 'inconclusive'

@pytest.mark.parametrize('coverage', [{'images_total': -1, 'images_pending': 0}, {'images_total': 0, 'images_pending': 1}, {'images_total': True, 'images_pending': 0}, {'images_total': 1, 'images_pending': 0, 'links_complete': 'yes'}])
def test_coverage_is_validated(coverage):
    assert analyze({'body': 'Factura', 'coverage': coverage}).status_code == 400

def test_authentication_is_never_verified():
    result = analyze({'body': 'Tu factura está disponible', 'authentication': {'source': 'eml', 'spf': 'pass', 'verified': True}}).json
    assert result['assessment']['authentication']['verified'] is False

def test_eml_extracts_html_and_declared_authentication():
    raw = b'From: Example <a@example.com>\r\nSubject: Tu factura\r\nAuthentication-Results: mx; spf=pass; dkim=pass\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<p>Consulta tu factura</p><a href="https://evil.example">https://bank.example</a>'
    response = create_app(classifier_factory=Classifier).test_client().post('/api/analyze-eml', data={'file': (io.BytesIO(raw), 'email.eml')})
    assert response.status_code == 200
    assert response.json['email']['links'][0]['url'] == 'https://evil.example'
    assert response.json['assessment']['authentication']['verified'] is False

def test_unsupported_language_does_not_load_model():
    calls = []
    def factory():
        calls.append(True)
        return Classifier()
    result = analyze({'body': 'Bonjour, votre facture est disponible. Merci de consulter votre compte pour télécharger le document.'}, factory).json
    assert result['assessment']['verdict'] == 'inconclusive'
    assert result['label'] == 'unavailable'
    assert calls == []

def test_real_token_metrics_and_truncation():
    class Tokenizer:
        def __call__(self, text, **kwargs):
            return {'input_ids': list(range(620))}
    class TokenClassifier(Classifier):
        tokenizer = Tokenizer()
    result = analyze({'body': 'Tu factura está disponible'}, TokenClassifier).json
    assert result['assessment']['text'] == {'language': 'es', 'token_count': 620, 'processed_tokens': 512, 'truncated': True}
    assert result['assessment']['verdict'] == 'inconclusive'

def test_spam_alone_is_inconclusive():
    class Spam(Classifier):
        def classify(self, email):
            return ClassificationResult('spam', .99, 'spam')
    assert analyze({'body': 'Tu factura está disponible'}, Spam).json['assessment']['verdict'] == 'inconclusive'

def test_image_only_email_is_inconclusive_without_loading_model():
    def forbidden():
        raise AssertionError('must not load')
    result = analyze({'subject': '', 'body': '', 'coverage': {'images_total': 1, 'images_pending': 1}}, forbidden)
    assert result.status_code == 200
    assert result.json['assessment']['verdict'] == 'inconclusive'

def test_models_selected_per_language_and_cached():
    from src.analysis_engine import AnalysisEngine
    calls = []
    def provider(language):
        calls.append(language)
        return Classifier()
    engine = AnalysisEngine(model_provider=provider)
    for _ in range(2):
        assert engine.analyze({'body': 'Tu factura está disponible'})['language'] == 'es'
        assert engine.analyze({'body': 'Your invoice is available for viewing in the account dashboard.'})['language'] == 'en'
    assert calls == ['es', 'en']

def test_encoded_redirect_reports_destination_without_fetching():
    from src.analysis_engine import analyze_links
    report = analyze_links([{'text': 'Review', 'url': 'https://redirect.example/?url=https%253A%252F%252Fevil.example%252Flogin'}])[0]
    assert report['decoded_url'] == 'https://evil.example/login'
    assert 'external_redirect_destination' in report['issues']

def test_attached_email_is_not_added_to_body():
    from src.eml_parser import parse_eml
    raw = b'Subject: Tu factura\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=x\r\n\r\n--x\r\nContent-Type: text/plain\r\n\r\nTu factura esta disponible\r\n--x\r\nContent-Type: message/rfc822\r\nContent-Disposition: attachment; filename=secret.eml\r\n\r\nSubject: hidden\r\nContent-Type: text/plain\r\n\r\nATTACHED SECRET\r\n--x--'
    assert 'ATTACHED SECRET' not in parse_eml(raw)['body']

def test_eml_size_limit_and_missing_file():
    client = create_app(classifier_factory=Classifier).test_client()
    assert client.post('/api/analyze-eml', data={}).status_code == 400
    assert client.post('/api/analyze-eml', data={'file': (io.BytesIO(b'x' * (8 * 1024 * 1024 + 1)), 'x.eml')}).status_code == 413

@pytest.mark.parametrize('body', ['Never share your password with anyone, please keep your account secure.', 'No compartas tu contraseña con nadie. Mantén tu cuenta segura.'])
def test_password_safety_advice_is_not_a_request(body):
    result = analyze({'body': body}).json
    assert not any(r['code'] == 'requests_sensitive_data' for r in result['assessment']['reasons'])


@pytest.mark.parametrize('body', ['Proporciona tu contraseña para recuperar tu cuenta.', 'Facilita tu número de tarjeta para reclamar el premio.', 'Submit your password to restore access.', 'Type your verification code here to claim the prize.'])
def test_explicit_credential_requests_are_not_lost_by_common_paraphrases(body):
    result = analyze({'body': body}).json
    assert result['assessment']['verdict'] == 'suspicious'


@pytest.mark.parametrize('body', ['Nunca proporciones tu contraseña a nadie.', 'Never submit your password to someone else.'])
def test_common_paraphrases_preserve_negation(body):
    result = analyze({'body': body}).json
    assert not any(reason['code'] == 'requests_sensitive_data' for reason in result['assessment']['reasons'])

def test_safelink_compares_display_to_decoded_destination():
    result = analyze({'body': 'Tu factura está disponible', 'links': [{'text': 'https://billing.example', 'url': 'https://safe.example/?url=https%3A%2F%2Fbilling.example'}]}).json
    assert 'display_host_mismatch' not in result['assessment']['links'][0]['issues']

@pytest.mark.parametrize('url', ['mailto:billing@example.com', 'tel:+15555550123'])
def test_non_web_contact_links_are_informational(url):
    result = analyze({'body': 'Tu factura está disponible', 'links': [{'text': 'Contacto', 'url': url}]}).json
    assert result['assessment']['verdict'] == 'no_clear_signals'

def test_alternative_mime_does_not_duplicate_body():
    from src.eml_parser import parse_eml
    raw = b'Subject: Tu factura\r\nContent-Type: multipart/alternative; boundary=x\r\n\r\n--x\r\nContent-Type: text/plain\r\n\r\nTu factura disponible\r\n--x\r\nContent-Type: text/html\r\n\r\n<p>Tu factura disponible</p><a href="https://billing.example">Factura</a>\r\n--x--'
    result = parse_eml(raw)
    assert result['body'].count('Tu factura disponible') == 1
    assert len(result['links']) == 1


def test_html_alternative_cannot_hide_a_credential_request_behind_benign_plaintext():
    from src.eml_parser import parse_eml
    raw = 'Subject: Tu factura\r\nContent-Type: multipart/alternative; boundary=x\r\n\r\n--x\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nTu factura del servicio esta disponible para consultar.\r\n--x\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<p>Ingresa tu contraseña para verificar tu cuenta.</p>\r\n--x--'.encode()
    payload = parse_eml(raw)
    assert 'contraseña' in payload['body']
    assert analyze(payload).json['assessment']['verdict'] == 'suspicious'


def test_unclosed_html_link_preserves_its_real_destination():
    from src.eml_parser import parse_eml
    payload = parse_eml(b'Subject: Tu factura\r\nContent-Type: text/html\r\n\r\n<a href="https://evil.example">https://bank.example')
    assert payload['links'][0] == {'url': 'https://evil.example', 'text': 'https://bank.example'}
    assert analyze(payload).json['assessment']['verdict'] == 'suspicious'

def test_eml_accepts_large_unparsed_attachment_but_json_stays_bounded():
    client = create_app(classifier_factory=Classifier).test_client()
    raw = b'Subject: Tu factura\r\nContent-Type: multipart/mixed; boundary=x\r\n\r\n--x\r\nContent-Type: text/plain\r\n\r\nTu factura esta disponible\r\n--x\r\nContent-Type: application/pdf\r\nContent-Disposition: attachment; filename=bill.pdf\r\n\r\n' + b'x' * 600000 + b'\r\n--x--'
    assert client.post('/api/analyze-eml', data={'file': (io.BytesIO(raw), 'x.eml')}).status_code == 200
    assert client.post('/api/analyze', data='x' * 500000, content_type='application/json').status_code == 413
