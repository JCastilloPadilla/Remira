"""Demostración local del flujo previo a la clasificación."""

from src.email_data import EmailData
from src.preprocessing import preprocess_email


def run_demo(input_fn=input, output_fn=print) -> str:
    """Solicita un correo y muestra el texto preparado para un modelo futuro."""
    subject = input_fn("Introduzca asunto: ")
    body = input_fn("Introduzca contenido: ")

    email = EmailData(subject=subject, body=body)
    prepared_text = preprocess_email(email)

    output_fn("\nTexto preparado para el modelo:")
    output_fn(prepared_text)
    output_fn("\nModelo aún no entrenado; demostración de preparación de entrada.")

    return prepared_text


if __name__ == "__main__":
    run_demo()
