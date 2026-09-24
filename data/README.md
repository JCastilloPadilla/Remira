# Dataset inicial: CEAS_08

## Decisión

Para el MVP de detección de correos potencialmente maliciosos se utilizará
**CEAS_08**, incluido en *Phishing Email Curated Datasets* de Champa, Rabbi y
Zibran (Zenodo, 2023): https://doi.org/10.5281/zenodo.8339691

Se eligió porque contiene texto de correo real ya etiquetado y sus campos se
alinean con el flujo planeado: asunto + cuerpo para el primer modelo, con
remitente y URLs disponibles para una fase posterior.

Archivo de trabajo local: `data/raw/CEAS_08.csv`.

## Integridad y perfil inicial

- Registros: **39,154**.
- Legítimos (`label = 0`): **17,312** (44.22%).
- Potencialmente maliciosos/phishing (`label = 1`): **21,842** (55.78%).
- Suma MD5 esperada y verificada: `1f0d59191eec892a709995d48cd8decb`.
- Duplicados exactos: 0; duplicados por `subject + body`: 0.

## Columnas

| Columna | Uso inicial | Observaciones |
| --- | --- | --- |
| `sender` | No para el baseline | Remitente original. Puede introducir sesgos si se usa desde el inicio. |
| `receiver` | No para el baseline | Tiene 462 valores vacíos. |
| `date` | No para el baseline | Fecha en texto de formato de correo. |
| `subject` | Sí | 28 valores vacíos; longitud media: 38.9 caracteres. |
| `body` | Sí | Contenido principal; longitud media: 1,571.1 caracteres. |
| `label` | Sí | Objetivo binario: 0 = legítimo, 1 = potencialmente malicioso. |
| `urls` | Fase posterior | Indicador de presencia de URL (0 o 1); 26,232 mensajes tienen una. |

## Estructura lógica de un correo

Un correo completo normalmente se divide en encabezados y cuerpo:

```text
From / To / Date / Subject / Message-ID / Received / Content-Type
\n
Cuerpo de texto o HTML; puede tener enlaces, firmas, texto citado y adjuntos MIME.
```

CEAS_08 ya separa los campos útiles para el MVP: `subject` representa el
asunto, `body` el contenido, y `sender`, `receiver`, `date` y `urls` aportan
metadatos. No se debe renderizar el cuerpo como HTML ni abrir enlaces del
corpus: contiene mensajes potencialmente maliciosos.

## Preparación para el baseline

1. Convertir los asuntos faltantes a cadena vacía.
2. Formar `text = subject + " " + body`.
3. Hacer una partición estratificada entrenamiento/prueba antes de ajustar TF-IDF.
4. Entrenar el baseline `TF-IDF + MultinomialNB` usando solo `text`.
5. Evaluar precision, recall y F1 de la clase maliciosa; priorizar recall para reducir falsos negativos.

Los archivos descargados se excluyen de Git mediante `.gitignore`; la fuente,
versión e integridad quedan documentadas aquí para que la preparación sea
reproducible.
