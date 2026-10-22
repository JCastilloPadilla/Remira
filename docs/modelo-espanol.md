# Modelo español para la extensión local

Fecha: 22 de octubre de 2026. Rama: `codex/extension-local-v1`.

La API local utiliza `tanaos/tanaos-spam-detection-spanish`, basado en
`distilbert-base-multilingual-cased`. Su ficha declara entrenamiento en español
con datos sintéticos y etiquetas `spam` / `not_spam`.

Fuente: https://huggingface.co/tanaos/tanaos-spam-detection-spanish

El spam de este modelo abarca publicidad no solicitada, engaños y otras categorías,
incluidos intentos de phishing. No equivale a un detector específico de phishing.
Por ello conservamos sus etiquetas originales y no las convertimos en `malicious`
ni en una garantía de legitimidad. El popup explica esta diferencia.

`SpanishSpamClassifier` carga el modelo/tokenizador español y conserva mayúsculas
y acentos; normaliza solo espacios. `PhishingEmailClassifier` conserva el modelo
anterior y su preprocesamiento para reproducir la evaluación original. Ambos
limitan su entrada a 512 tokens.

`src.api` usa exclusivamente el clasificador español por defecto y carga desde
caché local. `/api/health` y `/api/analyze` identifican modelo, idioma y tarea.
No hay fallback silencioso al inglés ni envío de correos a Hugging Face.

Verificación inicial con ejemplos ficticios: reunión en español → `not_spam`;
premio que solicita contraseña y tarjeta → `spam`. Se comprueba también el flujo
con la extensión compilada instalada en un perfil Chrome de pruebas.

Las métricas históricas en `resultados-preentrenado.md` pertenecen a Cybersectony
y no describen este modelo. Sigue pendiente una evaluación representativa con
correos españoles legítimos y spam/phishing, además de revisión de falsos positivos
y negativos. Dos ejemplos no demuestran precisión general.
