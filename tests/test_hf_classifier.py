import unittest

from src.email_data import EmailData
from src.hf_classifier import PhishingEmailClassifier


class FakePipeline:
    def __init__(self, response):
        self.response = response
        self.received_text = None
        self.received_options = None

    def __call__(self, text, **options):
        self.received_text = text
        self.received_options = options
        return [self.response]


class HuggingFaceClassifierTests(unittest.TestCase):
    def test_classifies_a_phishing_label_as_malicious(self):
        pipeline = FakePipeline({"label": "phishing_url", "score": 0.91})
        classifier = PhishingEmailClassifier(pipeline=pipeline)

        result = classifier.classify(
            EmailData(subject="URGENTE", body="Verifique su cuenta")
        )

        self.assertEqual(result.label, "malicious")
        self.assertEqual(result.source_label, "phishing_url")
        self.assertAlmostEqual(result.confidence, 0.91)
        self.assertEqual(pipeline.received_text, "urgente verifique su cuenta")
        self.assertEqual(
            pipeline.received_options, {"truncation": True, "max_length": 512}
        )

    def test_classifies_a_legitimate_label_as_legitimate(self):
        pipeline = FakePipeline({"label": "legitimate_email", "score": 0.87})
        classifier = PhishingEmailClassifier(pipeline=pipeline)

        result = classifier.classify(EmailData(subject="Reunión", body="Mañana a las 9"))

        self.assertEqual(result.label, "legitimate")
        self.assertEqual(result.source_label, "legitimate_email")

    def test_rejects_an_unknown_model_label(self):
        pipeline = FakePipeline({"label": "unknown", "score": 0.5})
        classifier = PhishingEmailClassifier(pipeline=pipeline)

        with self.assertRaisesRegex(ValueError, "Etiqueta no soportada"):
            classifier.classify(EmailData(subject="Aviso", body="Contenido"))
