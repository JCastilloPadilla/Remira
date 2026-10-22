"""Clasificación local de correos con un modelo especializado de Hugging Face."""

from dataclasses import dataclass
from typing import Callable

from src.email_data import EmailData
from src.preprocessing import preprocess_email


MODEL_NAME = "cybersectony/phishing-email-detection-distilbert_v2.4.1"

LABEL_MAPPING = {
    "legitimate_email": "legitimate",
    "legitimate_url": "legitimate",
    "phishing_url": "malicious",
    "phishing_url_alt": "malicious",
    "LABEL_0": "legitimate",
    "LABEL_1": "malicious",
    "LABEL_2": "legitimate",
    "LABEL_3": "malicious",
}


@dataclass(frozen=True)
class ClassificationResult:
    """Resultado binario normalizado para el resto de la aplicación."""

    label: str
    confidence: float
    source_label: str


def _load_pipeline(local_files_only: bool = False) -> Callable:
    """Carga el modelo solo cuando se necesita clasificar un correo."""
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

    device = 0 if torch.cuda.is_available() else -1
    return pipeline(
        "text-classification",
        model=AutoModelForSequenceClassification.from_pretrained(
            MODEL_NAME, local_files_only=local_files_only
        ),
        tokenizer=AutoTokenizer.from_pretrained(
            MODEL_NAME, local_files_only=local_files_only
        ),
        device=device,
    )


class PhishingEmailClassifier:
    """Adaptador del modelo especializado al dominio del proyecto."""

    def __init__(self, pipeline: Callable | None = None, *, local_files_only: bool = False):
        self._pipeline = pipeline or _load_pipeline(local_files_only=local_files_only)

    def classify(self, email: EmailData) -> ClassificationResult:
        """Clasifica un correo y devuelve una etiqueta binaria consistente."""
        prediction = self._pipeline(
            preprocess_email(email), truncation=True, max_length=512
        )[0]
        source_label = prediction["label"]

        if source_label not in LABEL_MAPPING:
            raise ValueError(f"Etiqueta no soportada por el modelo: {source_label}")

        return ClassificationResult(
            label=LABEL_MAPPING[source_label],
            confidence=float(prediction["score"]),
            source_label=source_label,
        )
