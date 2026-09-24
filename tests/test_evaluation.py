import unittest

from src.evaluation import evaluate_predictions


class EvaluationTests(unittest.TestCase):
    def test_calculates_metrics_with_malicious_as_positive_class(self):
        report = evaluate_predictions(
            true_labels=[0, 0, 1, 1],
            predicted_labels=["legitimate", "malicious", "malicious", "malicious"],
        )

        self.assertAlmostEqual(report.accuracy, 0.75)
        self.assertAlmostEqual(report.precision, 2 / 3)
        self.assertAlmostEqual(report.recall, 1.0)
        self.assertAlmostEqual(report.f1, 0.8)
        self.assertEqual(report.confusion_matrix, [[1, 1], [0, 2]])
