"""Utilidades para evaluar el clasificador preentrenado con CEAS_08."""

from typing import Protocol

import pandas as pd
from sklearn.model_selection import train_test_split

from src.email_data import EmailData
from src.evaluation import EvaluationReport, evaluate_predictions
from src.hf_classifier import ClassificationResult


class EmailClassifier(Protocol):
    """Contrato mínimo que debe cumplir un clasificador de correos."""

    def classify(self, email: EmailData) -> ClassificationResult:
        """Devuelve una clasificación normalizada."""


def _text_or_empty(value: object) -> str:
    return "" if pd.isna(value) else str(value)


def select_stratified_sample(
    emails: pd.DataFrame, sample_size: int, random_state: int = 42
) -> pd.DataFrame:
    """Obtiene una muestra reproducible que conserva las clases del dataset."""
    if sample_size <= 0:
        raise ValueError("El tamaño de muestra debe ser mayor que cero.")
    if sample_size >= len(emails):
        return emails.copy()

    sample, _ = train_test_split(
        emails,
        train_size=sample_size,
        random_state=random_state,
        stratify=emails["label"],
    )
    return sample.reset_index(drop=True)


def evaluate_classifier(
    classifier: EmailClassifier, emails: pd.DataFrame
) -> EvaluationReport:
    """Evalúa un clasificador usando asunto, cuerpo y etiqueta del dataset."""
    predictions = [
        classifier.classify(
            EmailData(
                subject=_text_or_empty(row.subject),
                body=_text_or_empty(row.body),
            )
        ).label
        for row in emails.itertuples(index=False)
    ]

    return evaluate_predictions(emails["label"].tolist(), predictions)
