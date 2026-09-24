"""Demostración local de clasificación con el modelo preentrenado."""

from src.email_data import EmailData
from src.hf_classifier import ClassificationResult, PhishingEmailClassifier


def run_demo(
    input_fn=input,
    output_fn=print,
    classifier: PhishingEmailClassifier | None = None,
) -> ClassificationResult:
    """Solicita un correo y muestra la clasificación local obtenida."""
    subject = input_fn("Introduzca asunto: ")
    body = input_fn("Introduzca contenido: ")

    email = EmailData(subject=subject, body=body)
    result = (classifier or PhishingEmailClassifier()).classify(email)

    output_fn("\nClasificación del modelo:")
    output_fn(f"Etiqueta: {result.label}")
    output_fn(f"Confianza: {result.confidence:.2%}")
    output_fn(f"Etiqueta original: {result.source_label}")

    return result


if __name__ == "__main__":
    run_demo()
