import unittest

from src.email_data import EmailData
from src.hf_classifier import PhishingEmailClassifier, SpanishSpamClassifier


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
    def test_spanish_spam_keeps_its_real_label_and_preserves_case(self):
        pipeline = FakePipeline({"label": "spam", "score": 0.99999})
        result = SpanishSpamClassifier(pipeline=pipeline).classify(
            EmailData(subject="URGENTE", body="  Verifica   tu cuenta ")
        )
        self.assertEqual(result.label, "spam")
        self.assertEqual(result.source_label, "spam")
        self.assertEqual(pipeline.received_text, "URGENTE Verifica tu cuenta")
        self.assertEqual(pipeline.received_options, {"truncation": True, "max_length": 512})

    def test_spanish_non_spam_is_not_a_security_verdict(self):
        result = SpanishSpamClassifier(pipeline=FakePipeline({"label": "not_spam", "score": 0.95})).classify(
            EmailData(subject="Reunión", body="Mañana a las diez")
        )
        self.assertEqual(result.label, "not_spam")

    def test_spanish_model_rejects_old_ambiguous_labels(self):
        with self.assertRaisesRegex(ValueError, "Etiqueta no soportada"):
            SpanishSpamClassifier(pipeline=FakePipeline({"label": "LABEL_1", "score": 0.9})).classify(EmailData(body="Texto"))

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
