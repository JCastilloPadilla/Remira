import unittest

from src.email_data import EmailData
from src.preprocessing import preprocess_email


class PreprocessEmailTests(unittest.TestCase):
    def test_normalizes_case_and_repeated_whitespace(self):
        email = EmailData(
            subject="  URGENTE:   Verifique ",
            body="\nSu   cuenta será suspendida.  ",
        )

        self.assertEqual(
            preprocess_email(email),
            "urgente: verifique su cuenta será suspendida.",
        )

    def test_returns_empty_text_for_email_without_subject_or_body(self):
        email = EmailData(subject=None, body=None)

        self.assertEqual(preprocess_email(email), "")

    def test_does_not_modify_the_original_email_data(self):
        email = EmailData(subject="Asunto Original", body="Cuerpo Original")

        preprocess_email(email)

        self.assertEqual(email.subject, "Asunto Original")
        self.assertEqual(email.body, "Cuerpo Original")
