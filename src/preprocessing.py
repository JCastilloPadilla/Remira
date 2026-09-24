"""Transformaciones básicas compartidas por entrenamiento e inferencia."""

from src.email_data import EmailData


def preprocess_email(email: EmailData) -> str:
    """Prepara el texto de un correo para su vectorización posterior.

    La función combina asunto y cuerpo, usa minúsculas y normaliza espacios.
    No modifica los datos originales del correo.
    """
    return " ".join(email.combined_text().lower().split())
