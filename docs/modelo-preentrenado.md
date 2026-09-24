# Modelo preentrenado y flujo de evaluación

## Decisión técnica

La primera integración del proyecto usa [`cybersectony/phishing-email-detection-distilbert_v2.4.1`](https://huggingface.co/cybersectony/phishing-email-detection-distilbert_v2.4.1), un modelo basado en DistilBERT y publicado para detección de phishing. Se eligió porque está orientado al problema de correos y enlaces maliciosos, es más ligero que un modelo generativo y puede ejecutarse localmente tras la primera descarga.

CEAS_08 **no se usa para reentrenar** este modelo en esta etapa: sirve para medir su desempeño con un dataset independiente y etiquetado.

## Qué hace cada archivo

| Archivo | Responsabilidad |
| --- | --- |
| `src/email_data.py` | Define `EmailData`, la estructura común de asunto, cuerpo y remitente. |
| `src/preprocessing.py` | Une asunto y cuerpo, convierte a minúsculas y normaliza espacios. |
| `src/hf_classifier.py` | Descarga/carga el modelo bajo demanda, lo ejecuta localmente y convierte sus etiquetas a `legitimate` o `malicious`. |
| `src/predict.py` | Permite probar manualmente asunto y cuerpo desde la consola, sin interfaz web. |
| `src/experiment.py` | Selecciona una muestra estratificada de CEAS_08 y coordina la evaluación. |
| `src/evaluation.py` | Calcula accuracy, precision, recall, F1-score y matriz de confusión. |
| `scripts/evaluate_pretrained.py` | Es el comando reproducible que realiza la evaluación y escribe el informe. |
| `tests/` | Verifica la normalización de texto, etiquetas, muestreo y métricas sin descargar el modelo. |
| `requirements.txt` | Declara las bibliotecas necesarias para ejecutar el proyecto. |

## Etiquetas normalizadas

El modelo original publica cuatro etiquetas. Para el objetivo binario del proyecto se convierten así:

| Etiqueta del modelo | Etiqueta del proyecto |
| --- | --- |
| `legitimate_email`, `legitimate_url` | `legitimate` |
| `phishing_url`, `phishing_url_alt` | `malicious` |

La correspondencia se verificó contra el ejemplo de uso publicado por el autor del modelo. Si el modelo devuelve una etiqueta distinta a las cuatro esperadas, el código detiene la ejecución en lugar de clasificar de manera silenciosamente incorrecta.

## Preparación del texto

1. Se reemplazan asunto y cuerpo ausentes por texto vacío.
2. Se unen ambos campos en una sola cadena.
3. Se convierte a minúsculas y se eliminan espacios duplicados.
4. Se limita la entrada a 512 tokens, que es el máximo de DistilBERT.

El límite de 512 tokens significa que un correo muy largo se analiza solo hasta ese límite. Es una limitación conocida que se debe considerar al analizar falsos negativos.

## Instalación y ejecución

Desde la raíz del repositorio:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m scripts.evaluate_pretrained --sample-size 500
```

La primera ejecución descarga el modelo a la caché local de Hugging Face. Las siguientes reutilizan esa copia. Si hay una GPU compatible con CUDA disponible, el clasificador la usa; de otro modo se ejecuta con CPU.

El resultado se escribe en `docs/resultados-preentrenado.md`. Los datos crudos y la caché del modelo no se agregan a GitHub.

Para clasificar un correo manualmente desde la consola:

```powershell
.\.venv\Scripts\python -m src.predict
```

## Alcance actual

Esto es un primer experimento de clasificación y evaluación. No incluye Flask, interfaz gráfica, acceso a una bandeja de correo, ni acciones automáticas sobre los mensajes. Una métrica alta no sustituye la revisión manual de correos que puedan tener impacto de seguridad.
