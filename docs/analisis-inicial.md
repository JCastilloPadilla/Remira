# Análisis inicial del dataset CEAS_08

## Propósito

CEAS_08 es el dataset seleccionado para entrenar el primer modelo de
clasificación de correos potencialmente maliciosos. El objetivo del MVP es
distinguir mensajes legítimos de mensajes maliciosos a partir de su texto.

## Fuente e integridad

- Fuente: [Phishing Email Curated Datasets](https://doi.org/10.5281/zenodo.8339691).
- Archivo local de trabajo: `data/raw/CEAS_08.csv`.
- Suma MD5 verificada: `1f0d59191eec892a709995d48cd8decb`.

El archivo CSV se descarga localmente y no se versiona en Git. Esto mantiene
el repositorio ligero y permite reproducir la descarga desde la fuente.

## Composición

| Clase | Etiqueta | Correos | Proporción |
| --- | ---: | ---: | ---: |
| Legítimo | 0 | 17,312 | 44.22% |
| Potencialmente malicioso/phishing | 1 | 21,842 | 55.78% |
| **Total** | - | **39,154** | **100%** |

No se encontraron duplicados exactos ni duplicados por la combinación de
asunto y cuerpo durante la inspección inicial.

## Campos disponibles

| Campo | Descripción | Uso en el MVP |
| --- | --- | --- |
| `subject` | Asunto del correo. | Sí |
| `body` | Cuerpo principal del mensaje. | Sí |
| `label` | Clase objetivo: 0 legítimo, 1 potencialmente malicioso. | Sí |
| `sender` | Remitente. | No, fase posterior |
| `receiver` | Destinatario. | No, fase posterior |
| `date` | Fecha en formato de correo. | No, fase posterior |
| `urls` | Indicador de presencia de URL. | No, fase posterior |

Hay 28 asuntos vacíos y 462 destinatarios vacíos. El cuerpo no presenta
valores vacíos. Para el modelo base, los asuntos vacíos se reemplazarán por
una cadena vacía antes de unirlos con el cuerpo.

## Estructura de un correo electrónico

Un correo completo contiene encabezados y cuerpo. Los encabezados incluyen
campos como `From`, `To`, `Date`, `Subject`, `Message-ID` y `Content-Type`.
Después de una línea vacía aparece el cuerpo, que puede ser texto, HTML,
enlaces, firmas, texto citado y adjuntos MIME.

CEAS_08 ya separa los campos necesarios para el MVP: el asunto en `subject`,
el contenido en `body` y la clase en `label`.

## Decisión para el modelo base

La primera representación será:

```text
text = subject + " " + body
```

El primer experimento utilizará TF-IDF y Multinomial Naive Bayes. Esta
decisión permite validar el flujo de preparación, entrenamiento y evaluación
antes de añadir metadatos o modelos más complejos.

`sender`, `urls` y `date` se dejarán para una fase posterior. Usar el
remitente desde el inicio puede hacer que el modelo memorice direcciones en
lugar de aprender el contenido. El indicador `urls` solo informa si existe un
enlace, no si el dominio es confiable; la fecha, por sí sola, tampoco define
la legitimidad de un mensaje.

## Patrones que pueden aparecer

Los mensajes potencialmente maliciosos pueden mostrar urgencia, promesas
exageradas, peticiones de datos, errores de redacción, enlaces externos o
lenguaje comercial agresivo. Los mensajes legítimos pueden tener contexto
específico y tono conversacional o técnico.

Estos son patrones de apoyo para el análisis humano, no reglas deterministas:
un correo legítimo también puede contener enlaces o lenguaje urgente, y un
correo malicioso puede estar bien redactado. El modelo se evaluará con
precision, recall, F1-score y matriz de confusión, con atención especial a
los falsos negativos.
