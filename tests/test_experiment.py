import unittest

import pandas as pd

from src.hf_classifier import ClassificationResult
from src.experiment import evaluate_classifier, select_stratified_sample


class RuleBasedClassifier:
    def classify(self, email):
        if "alarma" in email.subject.lower():
            return ClassificationResult("malicious", 0.9, "phishing_url")
        return ClassificationResult("legitimate", 0.9, "legitimate_email")


class ExperimentTests(unittest.TestCase):
    def test_select_stratified_sample_keeps_the_class_proportion(self):
        emails = pd.DataFrame(
            {
                "subject": [f"Asunto {index}" for index in range(10)],
                "body": [f"Cuerpo {index}" for index in range(10)],
                "label": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            }
        )

        sample = select_stratified_sample(emails, sample_size=4, random_state=42)

        self.assertEqual(len(sample), 4)
        self.assertEqual(sample["label"].value_counts().to_dict(), {0: 2, 1: 2})

    def test_evaluate_classifier_uses_subject_and_body_from_dataset(self):
        emails = pd.DataFrame(
            {
                "subject": ["Reunión", "Alarma de cuenta"],
                "body": ["Confirmada", "Verifique ahora"],
                "label": [0, 1],
            }
        )

        report = evaluate_classifier(RuleBasedClassifier(), emails)

        self.assertAlmostEqual(report.accuracy, 1.0)
        self.assertEqual(report.confusion_matrix, [[1, 0], [0, 1]])
