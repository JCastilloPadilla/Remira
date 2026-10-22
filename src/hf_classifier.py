"""Clasificación local de correos con un modelo especializado de Hugging Face."""

from dataclasses import dataclass
from typing import Callable

from src.email_data import EmailData
from src.preprocessing import preprocess_email


MODEL_NAME = "cybersectony/phishing-email-detection-distilbert_v2.4.1"
SPANISH_MODEL_NAME = "tanaos/tanaos-spam-detection-spanish"

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


def _load_pipeline(local_files_only: bool = False, model_name: str = MODEL_NAME) -> Callable:
    """Carga el modelo solo cuando se necesita clasificar un correo."""
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

    device = 0 if torch.cuda.is_available() else -1
    return pipeline(
        "text-classification",
        model=AutoModelForSequenceClassification.from_pretrained(
            model_name, local_files_only=local_files_only
        ),
        tokenizer=AutoTokenizer.from_pretrained(
            model_name, local_files_only=local_files_only
        ),
        device=device,
    )


class PhishingEmailClassifier:
    """Adaptador del modelo especializado al dominio del proyecto."""

    model_name = MODEL_NAME
    label_mapping = LABEL_MAPPING
    preserve_case = False

    def __init__(self, pipeline: Callable | None = None, *, local_files_only: bool = False):
        self._pipeline = pipeline or _load_pipeline(local_files_only=local_files_only, model_name=self.model_name)

    def classify(self, email: EmailData) -> ClassificationResult:
        """Clasifica un correo y devuelve una etiqueta binaria consistente."""
        # El modelo español parte de multilingual-cased: conserva mayúsculas y acentos.
        text = " ".join(email.combined_text().split()) if self.preserve_case else preprocess_email(email)
        prediction = self._pipeline(text, truncation=True, max_length=512)[0]
        source_label = prediction["label"]

        if source_label not in self.label_mapping:
            raise ValueError(f"Etiqueta no soportada por el modelo: {source_label}")

        return ClassificationResult(
            label=self.label_mapping[source_label],
            confidence=float(prediction["score"]),
            source_label=source_label,
        )


class SpanishSpamClassifier(PhishingEmailClassifier):
    """Filtro de spam en español; no convierte spam en un veredicto de phishing."""

    model_name = SPANISH_MODEL_NAME
    label_mapping = {"spam": "spam", "not_spam": "not_spam"}
    preserve_case = True
