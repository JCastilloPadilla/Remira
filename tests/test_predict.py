import unittest

from src.predict import run_demo


class PredictDemoTests(unittest.TestCase):
    def test_collects_an_email_and_displays_the_prepared_text(self):
        answers = iter(["  URGENTE ", "Verifique   su cuenta"])
        messages = []

        result = run_demo(input_fn=lambda prompt: next(answers), output_fn=messages.append)

        self.assertEqual(result, "urgente verifique su cuenta")
        self.assertEqual(
            messages,
            [
                "\nTexto preparado para el modelo:",
                "urgente verifique su cuenta",
                "\nModelo aún no entrenado; demostración de preparación de entrada.",
            ],
        )
