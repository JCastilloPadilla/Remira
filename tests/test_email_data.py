import unittest

from src.email_data import EmailData


class EmailDataTests(unittest.TestCase):
    def test_combined_text_includes_subject_and_body(self):
        email = EmailData(
            subject="Entrega del proyecto",
            body="La entrega es el viernes.",
        )

        self.assertEqual(
            email.combined_text(),
            "Entrega del proyecto La entrega es el viernes.",
        )

    def test_missing_values_are_normalized_to_empty_text(self):
        email = EmailData(subject=None, body=None, sender=None)

        self.assertEqual(email.subject, "")
        self.assertEqual(email.body, "")
        self.assertIsNone(email.sender)
        self.assertEqual(email.combined_text(), "")
