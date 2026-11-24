import pytest

from src.corpus_decision import decide_email, CorpusNotReadyError, require_readable_content


def prediction(**scores):
    return {'scores': {'legitimate': .85, 'spam': .05, 'phishing': .06, 'malicious': .04, **scores},
            'model_version': 'corpus-test', 'provisional': True, 'warnings': ['Corpus experimental.']}


def assessment(*codes):
    return {'reasons': [{'code': code, 'severity': 'danger', 'message': 'Señal de prueba'} for code in codes],
            'coverage': {'images_pending': 0, 'images_total': 0, 'ocr_low_confidence': False, 'links_complete': True},
            'text': {'truncated': False, 'language': 'en'}, 'limitations': []}


def test_invoice_is_independent_of_risk_and_gets_calm_review_advice():
    payload = {'subject': 'Your invoice is ready', 'body': 'Invoice number: TEST. Amount: $0.00 USD. Billing period: October. Sign in to view it.'}
    result = decide_email(payload, assessment(), prediction())
    assert result['classification']['primary'] == 'likely_legitimate'
    assert result['purpose']['kind'] == 'invoice'
    assert 'calma' in result['recommendation']
    assert result['classification']['provisional'] is True
    risky = decide_email(payload, assessment('display_host_mismatch'), prediction())
    assert risky['classification']['primary'] == 'possible_phishing'
    assert risky['purpose']['kind'] == 'invoice'
    assert 'formato' in risky['recommendation']


def test_spam_is_not_relabelled_as_phishing_or_malware():
    result = decide_email({'subject': 'Ofertas', 'body': 'Descuentos de temporada y promociones.'}, assessment(), prediction(legitimate=.1, spam=.8))
    assert result['classification']['primary'] == 'possible_spam'
    assert result['purpose']['kind'] == 'advertisement'


def test_promotional_copy_does_not_become_phishing_from_text_model_alone():
    payload = {'subject': 'Oferta de temporada', 'body': 'Compra ahora con descuento y consigue promociones especiales para tus pedidos.'}
    result = decide_email(payload, assessment(), prediction(legitimate=.1, spam=.3, phishing=.7, malicious=.1))
    assert result['classification']['primary'] == 'needs_review'
    assert result['classification']['evidence_strength'] == 'weak'
    assert 'possible_phishing' in result['classification']['secondary']
    risky = decide_email(payload, assessment('requests_sensitive_data'), prediction(legitimate=.1, spam=.3, phishing=.7, malicious=.1))
    assert risky['classification']['primary'] == 'possible_phishing'


def test_macro_instruction_keeps_malicious_signal_even_when_model_prefers_legitimate():
    result = decide_email({'subject': 'Factura', 'body': 'Factura número: 123. Importe: $100. Habilita las macros del archivo para ver tu factura.'}, assessment(), prediction())
    assert result['classification']['primary'] == 'possible_malicious'
    assert result['purpose']['kind'] == 'invoice'
    assert result['classification']['evidence_strength'] == 'strong'


def test_negated_macro_security_advice_is_not_a_download_instruction():
    result = decide_email({'body': 'Nunca habilites las macros de archivos desconocidos. Este aviso explica cómo mantener tu equipo protegido.'}, assessment(), prediction())
    assert result['classification']['primary'] == 'likely_legitimate'


@pytest.mark.parametrize('body', [
    'You should not enable macros from unknown files.',
    'Download the report.pdf. Never open surprise.exe.',
    'No es recomendable habilitar macros en documentos desconocidos.',
])
def test_security_advice_and_separate_sentences_do_not_become_execution_signals(body):
    result = decide_email({'body': body}, assessment(), prediction())
    assert result['classification']['primary'] == 'likely_legitimate'


def test_overlapping_model_categories_are_preserved_as_secondary_risk():
    result = decide_email({'body': 'Consulta la oferta de la cuenta.'}, assessment(), prediction(legitimate=.1, spam=.94, phishing=.75, malicious=.1))
    assert result['classification']['primary'] == 'possible_spam'
    assert 'possible_phishing' in result['classification']['secondary']


def test_uncertainty_and_partial_ocr_are_secondary_not_main_category():
    evidence = assessment(); evidence['coverage']['images_pending'] = 1
    result = decide_email({'body': 'El informe de la reunión está listo.'}, evidence, prediction(legitimate=.4, spam=.3, phishing=.2, malicious=.1))
    assert result['classification']['primary'] == 'likely_legitimate'
    assert result['classification']['evidence_strength'] == 'weak'
    assert any('incompleta' in warning for warning in result['warnings'])


def test_corpus_text_cutoff_is_disclosed_and_out_of_language_is_weak():
    pred = prediction(); pred.update(truncated=True, processed_characters=15000, total_characters=20000)
    result = decide_email({'body': 'Texto'}, assessment(), pred)
    assert result['classification']['evidence_strength'] == 'weak'
    assert any('15000' in warning and '20000' in warning for warning in result['warnings'])
    evidence = assessment(); evidence['text']['language'] = 'fr'
    assert decide_email({'body': 'Bonjour'}, evidence, prediction())['classification']['evidence_strength'] == 'weak'


def test_model_scores_must_contain_positive_legitimacy_head_and_be_finite():
    bad = prediction(); del bad['scores']['legitimate']
    with pytest.raises(CorpusNotReadyError): decide_email({'body': 'Texto'}, assessment(), bad)
    bad = prediction(legitimate=float('nan'))
    with pytest.raises(CorpusNotReadyError): decide_email({'body': 'Texto'}, assessment(), bad)


def test_unread_image_requests_ocr_instead_of_inventing_category():
    with pytest.raises(ValueError, match='imagen'):
        require_readable_content({'subject': 'Aviso', 'body': '[Imagen: Aviso de cuenta]', 'coverage': {'images_pending': 1}})
    require_readable_content({'subject': 'Aviso', 'body': 'Texto reconocido revisado', 'coverage': {'images_pending': 1}})


def test_api_uses_trained_corpus_for_primary_category_and_keeps_evidence_separate():
    from src.api import create_app
    from src.hf_classifier import ClassificationResult
    class Auxiliary:
        def classify(self, _email): return ClassificationResult('spam', .99, 'spam')
    class Corpus:
        def predict(self, subject, body, language=None): return prediction()
    client = create_app(classifier_factory=Auxiliary, corpus_provider=Corpus).test_client()
    result = client.post('/api/analyze', json={'subject': 'Factura', 'body': 'Factura número: 42. Importe: $0.00.'})
    assert result.status_code == 200
    assert result.json['classification']['primary'] == 'likely_legitimate'
    assert result.json['purpose']['kind'] == 'invoice'
    assert result.json['label'] == 'spam'  # Original auxiliar conservado, no determina título.


def test_missing_corpus_artifact_is_actionable_and_never_random_classification():
    from src.api import create_app
    from src.hf_classifier import ClassificationResult
    class Auxiliary:
        def classify(self, _email): return ClassificationResult('not_spam', .9, 'not_spam')
    def missing(): raise FileNotFoundError('private path')
    client = create_app(classifier_factory=Auxiliary, corpus_provider=missing).test_client()
    result = client.post('/api/analyze', json={'body': 'Tu factura del servicio está disponible.'})
    assert result.status_code == 503
    assert 'entrena' in result.json['error'].lower()
    assert 'private path' not in result.get_data(as_text=True)


def test_api_requires_ocr_for_image_only_content_without_calling_models():
    from src.api import create_app
    def forbidden(): raise AssertionError('No debe cargarse con entrada sin leer')
    client = create_app(classifier_factory=forbidden, corpus_provider=forbidden).test_client()
    result = client.post('/api/analyze', json={'subject': 'Aviso', 'body': '[Imagen: Texto]', 'coverage': {'images_total': 1, 'images_pending': 1}})
    assert result.status_code == 400
    assert 'OCR' in result.json['error']


@pytest.mark.parametrize('body', ['You should not share your password with anyone.', 'Nunca te pediremos por correo que compartas tu contraseña.'])
def test_engine_security_reminders_do_not_override_legitimate_corpus_prediction(body):
    from src.api import create_app
    from src.hf_classifier import ClassificationResult
    class Auxiliary:
        def classify(self, _email): return ClassificationResult('not_spam', .9, 'not_spam')
    class Corpus:
        def predict(self, subject, body, language=None): return prediction()
    result = create_app(classifier_factory=Auxiliary, corpus_provider=Corpus).test_client().post('/api/analyze', json={'body': body})
    assert result.json['classification']['primary'] == 'likely_legitimate'


@pytest.mark.parametrize(('subject', 'scores', 'expected_secondary'), [
    ('Aviso de inicio de sesión', {'phishing': .93}, 'possible_phishing'),
    ('Estado del servicio', {'malicious': .88}, 'possible_malicious'),
    ('Comprobante de pago', {'spam': .58}, 'possible_spam'),
    ('Invitación académica', {'spam': .74, 'legitimate': .68}, 'possible_spam'),
])
def test_unsubstantiated_risk_is_presented_as_needs_review(subject, scores, expected_secondary):
    evidence = assessment()
    result = decide_email({'subject': subject, 'body': 'Consulta el detalle de la notificación.'},
                          evidence, prediction(**({'legitimate': .1} | scores)))
    assert result['classification']['primary'] == 'needs_review'
    assert result['classification']['evidence_strength'] == 'weak'
    assert expected_secondary in result['classification']['secondary']
    assert evidence['reasons'] == []
