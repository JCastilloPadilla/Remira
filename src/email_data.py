"""Estructura común para los datos de un correo electrónico."""

from dataclasses import dataclass


@dataclass
class EmailData:
    """Representa la información mínima que el clasificador recibirá."""

    subject: str | None = ""
    body: str | None = ""
    sender: str | None = None

    def __post_init__(self) -> None:
        """Normaliza campos de texto opcionales para evitar valores nulos."""
        self.subject = self.subject or ""
        self.body = self.body or ""

    def combined_text(self) -> str:
        """Une asunto y cuerpo para su procesamiento posterior."""
        return " ".join(part for part in (self.subject, self.body) if part)
