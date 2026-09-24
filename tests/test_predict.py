import unittest

from src.hf_classifier import ClassificationResult
from src.predict import run_demo


class FakeClassifier:
    def classify(self, email):
        self.email = email
        return ClassificationResult(
            label="malicious", confidence=0.91, source_label="phishing_url"
        )


class PredictDemoTests(unittest.TestCase):
    def test_collects_an_email_and_displays_the_classification(self):
        answers = iter(["  URGENTE ", "Verifique   su cuenta"])
        messages = []
        classifier = FakeClassifier()

        result = run_demo(
            input_fn=lambda prompt: next(answers),
            output_fn=messages.append,
            classifier=classifier,
        )

        self.assertEqual(result.label, "malicious")
        self.assertEqual(classifier.email.subject, "  URGENTE ")
        self.assertEqual(
            messages,
            [
                "\nClasificación del modelo:",
                "Etiqueta: malicious",
                "Confianza: 91.00%",
                "Etiqueta original: phishing_url",
            ],
        )
