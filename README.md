# Sistema inteligente para la detección de correos electrónicos maliciosos

Proyecto semestral de la materia **Técnicas de Inteligencia Artificial**.

El objetivo es desarrollar una aplicación capaz de analizar un correo electrónico y clasificarlo como **legítimo** o **potencialmente malicioso**, mediante técnicas de aprendizaje automático supervisado. La clasificación se realizará con modelos propios entrenados con datasets públicos etiquetados; no dependerá de servicios externos de IA generativa.

## Objetivo del MVP

La primera versión funcional permitirá que una persona escriba el asunto y el cuerpo de un correo en una interfaz web. El backend procesará el texto, lo transformará en características numéricas y utilizará un modelo previamente entrenado para emitir una clasificación.

```text
Usuario → Formulario web → Flask → Preprocesamiento → Pipeline ML → Resultado
```

El entrenamiento y la clasificación serán procesos separados. El modelo no se volverá a entrenar cada vez que alguien analice un correo.

## Arquitectura planeada

### Entrenamiento

```text
Dataset etiquetado
    ↓
Limpieza y preparación de datos
    ↓
Preprocesamiento de asunto + cuerpo
    ↓
TF-IDF
    ↓
Naive Bayes / SVM / Random Forest
    ↓
Evaluación y selección del modelo
    ↓
Guardar pipeline entrenado
```

### Uso del modelo

```text
Correo recibido
    ↓
EmailData
    ↓
Preprocesamiento compartido
    ↓
Pipeline previamente entrenado
    ↓
Clasificación: legítimo o potencialmente malicioso
```

En fases posteriores, la entrada podrá provenir de un formulario web, un archivo `.eml` o una cuenta de correo mediante IMAP. Todas las fuentes deberán producir una estructura interna común antes de pasar al clasificador.

## Tecnologías propuestas

- **Python**: lenguaje principal.
- **Pandas**: carga, limpieza y exploración del dataset.
- **Scikit-learn**: TF-IDF, entrenamiento, evaluación y serialización del pipeline.
- **Flask**: backend y futura API `POST /api/analyze`.
- **HTML, CSS y JavaScript**: interfaz web.
- **Joblib**: guardado y carga del modelo entrenado.
- **SQLite**: opcional para historial de análisis.

## Evaluación prevista

Se compararán Naive Bayes, Support Vector Machine (SVM) y Random Forest bajo las mismas condiciones experimentales. La decisión del modelo final se basará en resultados reales y no solo en accuracy.

Las métricas previstas son:

- Accuracy
- Precision
- Recall
- F1-score
- Matriz de confusión

Se dará especial atención a los falsos negativos: correos realmente maliciosos que el sistema clasifique como legítimos.

## Estado actual

El proyecto se encuentra en la etapa inicial de planeación y preparación de la base de código.

Todavía no se ha seleccionado un dataset definitivo, no existe un modelo entrenado y no hay métricas reales. Tampoco se ha implementado Flask, TF-IDF, IMAP, OAuth ni la recepción automática de correos.

Los primeros avances de código están en la rama `feature/foundation-prototype`:

| Commit | Descripción |
| --- | --- |
| `9949285` | Modelo base `EmailData` para asunto, cuerpo y remitente opcional. |
| `cdaae50` | Función centralizada de preprocesamiento: combina texto, convierte a minúsculas y normaliza espacios. |
| `754267a` | Demostración local por consola del flujo previo al entrenamiento. |

Estos avances incluyen pruebas automatizadas y no realizan clasificación; únicamente preparan el flujo que después utilizará TF-IDF y el modelo de Machine Learning.

## Próximos pasos

1. Seleccionar un dataset público de correos etiquetados.
2. Inspeccionar sus columnas, clases, valores faltantes, duplicados y balance.
3. Preparar un dataset limpio y reproducible.
4. Entrenar un baseline con TF-IDF + Naive Bayes.
5. Evaluar el baseline con métricas reales.
6. Comparar con SVM y Random Forest.
7. Guardar el pipeline seleccionado antes de iniciar la integración con Flask.

## Principios del proyecto

- Usar la misma lógica de preprocesamiento durante entrenamiento e inferencia.
- No asumir columnas, etiquetas ni características antes de inspeccionar el dataset.
- No almacenar contraseñas, tokens ni secretos en el repositorio.
- No entrenar modelos desde una petición web.
- Priorizar un MVP explicable y funcional antes de integrar correo automático, OAuth o un dashboard.
