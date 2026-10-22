"""Contrato de la API local; el doble sustituye únicamente la inferencia pesada."""

import pytest

from src.api import create_app
from src.hf_classifier import ClassificationResult


class RecordingClassifier:
    def __init__(self):
        self.emails = []

    def classify(self, email):
        self.emails.append(email)
        return ClassificationResult("malicious", 0.91, "phishing_url")


@pytest.fixture
def api():
    classifier = RecordingClassifier()
    loads = []

    def factory():
        loads.append(True)
        return classifier

    app = create_app(classifier_factory=factory)
    app.testing = True
    return app.test_client(), classifier, loads


def test_classifies_email_and_reuses_one_model(api):
    client, classifier, loads = api
    for _ in range(2):
        response = client.post('/api/analyze', json={"subject": "Aviso", "body": "Verifica tu cuenta"})
        assert response.status_code == 200
        assert response.json["label"] == "malicious"
        assert response.json["confidence"] == 0.91
        assert response.json["max_tokens"] == 512
    assert len(loads) == 1
    assert classifier.emails[0].subject == "Aviso"
    assert classifier.emails[0].body == "Verifica tu cuenta"


@pytest.mark.parametrize('payload', [None, [], {}, {"subject": 5, "body": "text"}, {"body": "   "}, {"body": False}, {"body": "x" * 100001}])
def test_rejects_invalid_email_without_loading_model(api, payload):
    client, _, loads = api
    response = client.post('/api/analyze', json=payload)
    assert response.status_code in (400, 415)
    assert "error" in response.json
    assert loads == []


def test_health_does_not_load_model(api):
    client, _, loads = api
    assert client.get('/api/health').json["model_loaded"] is False
    assert loads == []


@pytest.mark.parametrize('origin', ['https://mail.google.com', 'https://attacker.example', 'null'])
def test_rejects_web_origins(api, origin):
    client, _, loads = api
    assert client.post('/api/analyze', json={"body": "text"}, headers={"Origin": origin}).status_code == 403
    assert loads == []


def test_accepts_chromium_extension_origin(api):
    client, _, _ = api
    response = client.post('/api/analyze', json={"body": "text"}, headers={"Origin": "chrome-extension://" + "a" * 32})
    assert response.status_code == 200


def test_rejects_non_loopback_host(api):
    client, _, loads = api
    assert client.post('/api/analyze', json={"body": "text"}, base_url='http://attacker.example').status_code == 403
    assert loads == []


def test_model_failure_is_an_error_without_email_or_exception_details():
    def unavailable():
        raise RuntimeError('private internal failure')

    client = create_app(classifier_factory=unavailable).test_client()
    response = client.post('/api/analyze', json={"body": "private email"})
    assert response.status_code == 503
    assert "error" in response.json
    assert 'private' not in response.get_data(as_text=True)


def test_oversized_request_has_json_error(api):
    client, _, loads = api
    response = client.post('/api/analyze', data='x' * 500001, content_type='application/json')
    assert response.status_code == 413
    assert "error" in response.json
    assert loads == []
