# Sistema inteligente para la detección de correos electrónicos maliciosos

Proyecto semestral de la materia **Técnicas de Inteligencia Artificial**.

El objetivo es desarrollar una aplicación capaz de analizar un correo electrónico y clasificarlo como **legítimo** o **potencialmente malicioso**, mediante aprendizaje automático. La primera versión usa un modelo especializado preentrenado de Hugging Face que se descarga una vez y se ejecuta localmente; no envía el contenido de los correos a un servicio externo.

## Objetivo del MVP

La primera versión funcional permitirá que una persona escriba el asunto y el cuerpo de un correo en una interfaz web. El backend unirá y normalizará el texto y utilizará un modelo previamente entrenado para emitir una clasificación.

```text
Usuario → Formulario web → Flask → Preprocesamiento → Modelo local → Resultado
```

El entrenamiento y la clasificación serán procesos separados. El modelo no se volverá a entrenar cada vez que alguien analice un correo.

## Arquitectura planeada

### Evaluación del modelo preentrenado

```text
CEAS_08 etiquetado
    ↓
Muestra estratificada reproducible
    ↓
Preprocesamiento de asunto + cuerpo
    ↓
Modelo especializado de Hugging Face ejecutado localmente
    ↓
Métricas y matriz de confusión
```

### Uso del modelo

```text
Correo recibido
    ↓
EmailData
    ↓
Preprocesamiento compartido
    ↓
Clasificador preentrenado local
    ↓
Clasificación: legítimo o potencialmente malicioso
```

En fases posteriores, la entrada podrá provenir de un formulario web, un archivo `.eml` o una cuenta de correo mediante IMAP. Todas las fuentes deberán producir una estructura interna común antes de pasar al clasificador.

## Tecnologías propuestas

- **Python**: lenguaje principal.
- **Pandas**: carga, limpieza y exploración del dataset.
- **Transformers y PyTorch**: descarga y ejecución local del modelo de lenguaje especializado.
- **Scikit-learn**: muestreo estratificado y métricas de evaluación.
- **Flask**: backend y futura API `POST /api/analyze`.
- **HTML, CSS y JavaScript**: interfaz web.
- **SQLite**: opcional para historial de análisis.

## Evaluación prevista

El modelo preentrenado se medirá con CEAS_08 bajo condiciones reproducibles. Más adelante podrá compararse contra modelos propios (Naive Bayes, SVM y Random Forest) con el mismo conjunto de evaluación.

Las métricas previstas son:

- Accuracy
- Precision
- Recall
- F1-score
- Matriz de confusión

Se dará especial atención a los falsos negativos: correos realmente maliciosos que el sistema clasifique como legítimos.

## Estado actual

El dataset de evaluación seleccionado es CEAS_08 y la integración del modelo preentrenado está en desarrollo en la rama `dev`. Todavía no se ha implementado Flask, IMAP, OAuth ni la recepción automática de correos.

La primera evaluación reproducible con una muestra estratificada de 100 correos
obtuvo F1-score de 0.8829. El detalle, incluidos los falsos positivos y falsos
negativos, está en [docs/resultados-preentrenado.md](docs/resultados-preentrenado.md).
La descripción de cada módulo y el comando para repetir el experimento están en
[docs/modelo-preentrenado.md](docs/modelo-preentrenado.md).

Los primeros avances de código están en la rama `feature/foundation-prototype`:

| Commit | Descripción |
| --- | --- |
| `9949285` | Modelo base `EmailData` para asunto, cuerpo y remitente opcional. |
| `cdaae50` | Función centralizada de preprocesamiento: combina texto, convierte a minúsculas y normaliza espacios. |
| `754267a` | Demostración local por consola del flujo previo al entrenamiento. |

Estos avances incluyen pruebas automatizadas y preparan el flujo de texto que utiliza el clasificador preentrenado.

## Próximos pasos

1. Ejecutar y documentar la evaluación del modelo preentrenado con CEAS_08.
2. Revisar errores y métricas, especialmente falsos negativos.
3. Comparar contra un baseline propio si se requiere justificar la elección del modelo.
4. Integrar el clasificador validado con Flask.

## Principios del proyecto

- Usar la misma lógica de preprocesamiento durante entrenamiento e inferencia.
- No asumir columnas, etiquetas ni características antes de inspeccionar el dataset.
- No almacenar contraseñas, tokens ni secretos en el repositorio.
- No entrenar modelos desde una petición web.
- Priorizar un MVP explicable y funcional antes de integrar correo automático, OAuth o un dashboard.
