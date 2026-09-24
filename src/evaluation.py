"""Métricas de evaluación para la detección de correos maliciosos."""

from dataclasses import dataclass
from collections.abc import Sequence

from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score


@dataclass(frozen=True)
class EvaluationReport:
    """Métricas calculadas considerando malicioso como clase positiva."""

    accuracy: float
    precision: float
    recall: float
    f1: float
    confusion_matrix: list[list[int]]


def evaluate_predictions(
    true_labels: Sequence[int], predicted_labels: Sequence[str]
) -> EvaluationReport:
    """Calcula métricas binarias para las predicciones normalizadas."""
    expected = ["legitimate" if label == 0 else "malicious" for label in true_labels]

    return EvaluationReport(
        accuracy=float(accuracy_score(expected, predicted_labels)),
        precision=float(
            precision_score(expected, predicted_labels, pos_label="malicious", zero_division=0)
        ),
        recall=float(
            recall_score(expected, predicted_labels, pos_label="malicious", zero_division=0)
        ),
        f1=float(f1_score(expected, predicted_labels, pos_label="malicious", zero_division=0)),
        confusion_matrix=confusion_matrix(
            expected, predicted_labels, labels=["legitimate", "malicious"]
        ).tolist(),
    )
