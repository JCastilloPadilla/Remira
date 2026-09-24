"""Ejecuta una evaluación reproducible del modelo preentrenado con CEAS_08."""

import argparse
from pathlib import Path

import pandas as pd

from src.experiment import evaluate_classifier, select_stratified_sample
from src.hf_classifier import MODEL_NAME, PhishingEmailClassifier


REQUIRED_COLUMNS = {"subject", "body", "label"}


def build_report_markdown(sample_size: int, report: object) -> str:
    """Construye el archivo Markdown con las métricas obtenidas."""
    return f"""# Resultados del modelo preentrenado

## Configuración del experimento

- Modelo: `{MODEL_NAME}`.
- Dataset de evaluación: `data/raw/CEAS_08.csv`.
- Tamaño de muestra: {sample_size} correos.
- Selección: muestreo estratificado con semilla 42.
- Clase positiva: `malicious` (correos con `label = 1` en CEAS_08).

Esta evaluación no reentrena el modelo. CEAS_08 se utiliza únicamente para medir
cómo se comporta el modelo preentrenado con datos ajenos a su entrenamiento.

## Métricas

| Métrica | Resultado |
| --- | ---: |
| Accuracy | {report.accuracy:.4f} |
| Precision | {report.precision:.4f} |
| Recall | {report.recall:.4f} |
| F1-score | {report.f1:.4f} |

## Matriz de confusión

Filas: clase real. Columnas: predicción. El orden de clases es
`[legitimate, malicious]`.

```text
{report.confusion_matrix[0]}
{report.confusion_matrix[1]}
```

## Interpretación

La métrica más importante en este caso es el **recall** de la clase maliciosa:
indica qué proporción de los correos peligrosos fue detectada. Antes de usar el
modelo en una interfaz o como filtro, se debe repetir esta evaluación con una
muestra mayor y revisar manualmente falsos positivos y falsos negativos.
"""


def main() -> None:
    """Carga CEAS_08, evalúa el modelo y guarda las métricas en documentación."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="data/raw/CEAS_08.csv")
    parser.add_argument("--sample-size", type=int, default=500)
    parser.add_argument("--output", default="docs/resultados-preentrenado.md")
    args = parser.parse_args()

    emails = pd.read_csv(args.input)
    missing_columns = REQUIRED_COLUMNS.difference(emails.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"El dataset no contiene las columnas requeridas: {missing}")

    sample = select_stratified_sample(emails, args.sample_size)
    report = evaluate_classifier(PhishingEmailClassifier(), sample)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(build_report_markdown(len(sample), report), encoding="utf-8")
    print(f"Evaluación terminada con {len(sample)} correos.")
    print(f"Accuracy: {report.accuracy:.4f}; F1: {report.f1:.4f}")
    print(f"Informe: {output_path}")


if __name__ == "__main__":
    main()
