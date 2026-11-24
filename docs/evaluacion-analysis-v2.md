# Evaluación descriptiva de análisis v2

Ejecutada el 10 de noviembre de 2026 con pesos locales en CPU. Este experimento usa **48 mensajes sintéticos escritos manualmente**, sin correos privados ni datos del usuario. No es una validación en correo real, una muestra representativa ni una calibración de puntuaciones.

## Protocolo fijado

`data/fixtures/analysis-v2.jsonl` contiene 12 casos `calibration` reservados y 36 casos `test`. Cada fila declara su partición; identificadores y pares asunto/cuerpo son distintos. La partición reservada no se ejecuta, no entrena y no selecciona umbrales. La primera ejecución aplicó los modelos existentes y la política v2 sin ajustar parámetros desde este evaluador. Tras observar el test, la política recibió una corrección de negación: su ejecución posterior es exploratoria y no constituye un holdout independiente. Las etiquetas son juicios del autor sintético, sin revisión independiente. Casos futuros usados para corregir la política deberán considerarse regresión; una nueva estimación requiere otro conjunto no observado.

La prueba contiene 17 mensajes españoles, 16 ingleses y 3 franceses; 13 legítimos, 11 spam comercial y 12 phishing. Incluye facturas, recibos, escuela, boletines solicitados, publicidad no solicitada, solicitudes de contraseña/códigos, enlaces con destino distinto, imágenes pendientes y OCR de baja confianza. No ejecuta OCR: solo verifica cómo responde la política a su cobertura declarada. No visita enlaces. Los dominios de ejemplo y los remitentes son ficticios.

Las categorías son excluyentes **para este corpus**. Tanaos tiene objetivo `spam` frente a las otras dos categorías; Cybersectony e híbrida tienen objetivo `phishing` frente a legítimo/spam. Un phishing real puede también ser spam: los FP de Tanaos sobre phishing reflejan esta convención y no prueban que su etiqueta de spam sea incorrecta en general. No corresponde ordenar los tres sistemas en una única tabla de calidad ni interpretar spam como phishing.

## Reproducción

Desde la raíz, con las dependencias instaladas y ambos modelos ya en caché:

```powershell
.venv/Scripts/python.exe -m scripts.evaluate_analysis_v2 --fixturepath data/fixtures/analysis-v2.jsonl --output tmp/analysis-v2-report.json --exploratory
.venv/Scripts/python.exe -m pytest tests/test_analysis_evaluation.py -q
```

El ejecutable fuerza `HF_HUB_OFFLINE=1`, `TRANSFORMERS_OFFLINE=1` y `local_files_only=True`. Reutiliza las dos instancias en la política mediante `model_provider`. Si un modelo no está disponible se registra el error y su predicción cuenta como abstención; no se descarga. El JSON conserva decisiones individuales, errores, motivos de la política, métricas por categoría y por soporte lingüístico, versiones, revisiones de pesos y hashes de corpus/código. No utiliza la puntuación como probabilidad ni fija umbrales de confianza.

Configuración de esta ejecución: Python 3.11.9, torch 2.14.0, transformers 5.17.0, langdetect 1.0.9; máximo 512 tokens. Pesos Tanaos `55c69b6deb7ef4d45cfbd8792d61b19e37a80008`; Cybersectony `6724dec17360ab1f6450553f1d950404f66a5dde`. SHA-256 del corpus: `d92756c0771ab916bc50cd1a74acc5f2f1cb5837d972a3f6133072ecbfa6b6c9`. Ambos modelos cargaron sin errores.

## Definiciones

Para la híbrida, `suspicious` es positivo, `no_clear_signals` negativo e `inconclusive` abstención. Los modelos independientes no tienen una abstención lingüística automática: se ejecutan también fuera de su idioma de uso para exponer esa limitación, en una tabla separada. Los grupos se determinan por el idioma anotado manualmente, no por la detección del sistema.

TP/TN/FP/FN cuentan únicamente decisiones emitidas. Se reportan además abstenciones positivas y negativas. Precisión = TP/(TP+FP). Recall decidido = TP/(TP+FN). **Recall total = TP/(TP+FN+positivos abstendidos)**; evita ocultar phishing sin decisión. Cobertura = decisiones/total; abstención = 1−cobertura. Esta cobertura de decisiones es distinta de la cobertura de imágenes. Un denominador cero se representa como `null`, nunca como acierto perfecto.

## Primera ejecución: idioma soportado

| Sistema y objetivo | n | TP | TN | FP | FN | Abstenciones | Precisión | Recall total | Cobertura |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Tanaos, spam, español | 17 | 2 | 6 | 6 | 3 | 0 | 25.0% | 40.0% | 100% |
| Cybersectony, phishing, inglés | 16 | 4 | 4 | 7 | 1 | 0 | 36.4% | 80.0% | 100% |
| Híbrida, phishing, español/inglés | 33 | 6 | 10 | 1 | 0 | 16 | 85.7% | 54.5% | 51.5% |

La híbrida se abstuvo en 5 phishing y 11 negativos de estos 33 casos. Su recall entre decisiones es 100%, pero su recall sobre todos los phishing soportados es 54.5%. FN=0 no significa que detectó todos los ataques. La tasa de abstención es 48.5%.

## Primera ejecución: diagnóstico fuera del idioma soportado

| Sistema y objetivo | n | TP | TN | FP | FN | Abstenciones | Precisión | Recall total | Cobertura |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Tanaos, spam, inglés/francés | 19 | 3 | 8 | 5 | 3 | 0 | 37.5% | 50.0% | 100% |
| Cybersectony, phishing, español/francés | 20 | 5 | 3 | 10 | 2 | 0 | 33.3% | 71.4% | 100% |
| Híbrida, phishing, francés | 3 | 0 | 0 | 0 | 0 | 3 | — | 0% | 0% |

Emitir una etiqueta fuera del idioma no demuestra soporte ni fiabilidad. La híbrida se abstiene en los tres franceses, incluido un phishing.

## Primera ejecución: conjunto completo y errores observados

En los 36 casos la híbrida obtuvo TP=6, TN=10, FP=1, FN=0 y 19 abstenciones (6 phishing, 13 negativos). Precisión 85.7%, recall total 50.0%, cobertura 47.2% y abstención 52.8%. Por categoría: legítimos 7 negativos/1 positivo/5 abstenciones; spam 3 negativos/0 positivos/8 abstenciones; phishing 6 positivos/0 negativos/6 abstenciones.

El falso positivo `v2-034` es un aviso legítimo: “Never share your password or verification code. Our help desk will never ask for them in an email.” La regla de solicitud de información sensible no distingue adecuadamente esta negación. Es un límite observado en la primera ejecución. Después se corrigió la negación; los resultados posteriores se reportan como exploratorios porque el test ya fue observado. Las solicitudes indirectas de códigos y la cobertura incompleta también dejan phishing sin decisión. Los detalles de cada caso están en el JSON reproducible.

Tanaos en los 36 mensajes: TP=5, TN=14, FP=11, FN=6 para spam. Cybersectony: TP=9, TN=7, FP=17, FN=3 para phishing. El modelo inglés marca como maliciosos los 11 anuncios comerciales de prueba, evidencia de que su etiqueta aislada no separa spam y phishing en esta muestra.

## Ejecución posterior exploratoria

Después de observar los ejemplos de prueba se revisó la regla de negación. La ejecución actual debe interpretarse como comprobación exploratoria de regresión. El JSON `tmp/analysis-v2-report.json` se genera con `--exploratory`; la primera ejecución se conservó en `tmp/analysis-v2-report-initial.json`. Los informes temporales no sustituyen las tablas versionadas de este documento.

| Híbrida actual | n | TP | TN | FP | FN | Abstenciones | Precisión | Recall total | Cobertura |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Español/inglés | 33 | 5 | 10 | 0 | 0 | 18 | 100% | 45.5% | 45.5% |
| Francés | 3 | 0 | 0 | 0 | 0 | 3 | — | 0% | 0% |
| Todos | 36 | 5 | 10 | 0 | 0 | 21 | 100% | 41.7% | 41.7% |

En total se abstiene en 7 phishing y 14 negativos (58.3%). Los modelos independientes conservan los resultados anteriores. La eliminación del FP viene acompañada de un TP menos y más abstenciones; no acredita una mejora global. El 100% de precisión corresponde solo a cinco positivos emitidos en ejemplos sintéticos ya observados. Se requiere un nuevo conjunto independiente para evaluar la política corregida.

## Alcance de la evidencia

La comprobación final tras ampliar solicitudes explícitas de credenciales conservó
los mismos conteos de la ejecución posterior (TP5/TN10/FP0/FN0, 21 abstenciones).
Está en `tmp/analysis-v2-report-final.json`, también marcada exploratoria; sus
hashes identifican el código exacto. Las correcciones de importación MIME y captura
OCR se comprobaron por regresiones y navegador, no forman parte de esos 36 casos.

Los resultados solo describen estos ejemplos manuales. El tamaño, la redacción explícita de categorías, los idiomas, la selección por conveniencia y la falta de doble anotación limitan cualquier generalización. No hay estimación de prevalencia, validación externa, calibración, análisis de adjuntos, prueba de autenticidad del remitente, OCR real ni evaluación de enlaces activos. `no_clear_signals` no acredita seguridad. Los resultados históricos permanecen separados. Antes de estimar rendimiento real se necesita un corpus consentido e independiente, etiquetas revisadas y un protocolo bloqueado antes de observarlo.
