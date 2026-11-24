# Resultado del corpus experimental v1

Fecha: 10 de noviembre de 2026. Entrenamiento real ejecutado localmente; no constituye validación de seguridad de correos reales.

## Corpus y procedencia

- SQLite local: `instance/corpus.db`; 39,154 registros CEAS_08 públicos y 160 plantillas sintéticas originales bilingües. No se incorporaron correos personales del chat.
- CEAS_08: etiqueta 0 → legitimate=1, phishing=0; etiqueta 1 → legitimate=0, phishing=1. Spam y malicious permanecen desconocidos, sin filas de anotación.
- Semilla: 40 familias, 24 de comunicaciones con contrafactual legítimo/phishing y 8 de publicidad más 8 de instrucciones peligrosas; ES/EN de cada familia permanecen juntas. Cada fila tiene las cuatro dimensiones explícitas.
- Todas las anotaciones importadas son `source_label`, nunca `human_review`. `reviewed` significa que se comprobó la autoría o correspondencia declarada de etiquetas de la fuente, no revisión humana individual de los 39,314 textos.
- CEAS conserva texto público con direcciones de correo sustituidas, sin garantía de anonimización completa (`anonymized=0`). La semilla no contiene personas reales (`anonymized=1`).
- Idioma CEAS asignado `en` por fuente, sin detección ni comprobación individual; no equivale a un conjunto inglés cuidadosamente revisado.

## Particiones y procedimiento

Familias fijadas antes de entrenar: 25,749 train, 5,310 validation, 8,255 test. El reparto se hace sobre familias con objetivo 70/15/15; sus tamaños desiguales producen aproximadamente 65.5/13.5/21.0 % de filas. La semilla tiene 112/24/24 filas. Se verificó que ninguna familia ni hash normalizado cruza particiones. Los duplicados públicos se agrupan por texto normalizado y los primeros 160 tokens del cuerpo; no es una detección exhaustiva de todas las paráfrasis o plantillas cercanas.

TF-IDF de palabras (1–2, máximo 35,000) y caracteres (3–5, máximo 45,000), ajustado solamente con train. Se normalizan correos, URLs y números. No se garantiza quitar identificadores alfanuméricos como G197368273 ni todos los nombres propios. Se procesan los primeros 15,000 caracteres del texto normalizado tanto en entrenamiento como inferencia; la respuesta avisa del recorte y devuelve contadores con `character_count_basis=normalized_text`.

Cuatro cabezas independientes, entrenadas exclusivamente donde existe su etiqueta. Cada fuente aporta el mismo peso total y sus idiomas se reparten ese peso por igual: CEAS no domina por sus 39 mil filas al pequeño corpus español. Se compararon regresión logística, MultinomialNB y LinearSVC por AP media ES/EN en los mismos 24 ejemplos de validación completamente anotados. Los empates se resuelven por el orden fijado LR/NB/SVC. Se ajustó después una sigmoide por cabeza sobre esa validación común, nunca sobre test. Su soporte es solo 8 positivos para legitimate/phishing y 4 para spam/malicious. Reutilizar validación para elección y calibración produce optimismo; sus diagnósticos no son una evaluación independiente.

| Cabeza | LR AP | NB AP | SVC AP | Selección |
| --- | ---: | ---: | ---: | --- |
| legitimate | 0.7853 | 0.8125 | 0.7702 | MultinomialNB |
| spam | 1.0000 | 1.0000 | 1.0000 | LogisticRegression |
| phishing | 0.7327 | 0.7556 | 0.7744 | LinearSVC |
| malicious | 1.0000 | 1.0000 | 1.0000 | LogisticRegression |

Las opciones anteriores se congelaron antes de consultar test. El segundo entrenamiento se ejecutó para reproducir el mismo ajuste tras añadir estado de revisión, paridad de inferencia y versionado de metadatos; no se cambió ningún hiperparámetro ni se usaron resultados de test para elegir.

## Evaluación final por clase, fuente e idioma

Umbral diagnóstico fijado en 0.5 para cada cabeza. Son tareas binarias superpuestas: no se suman las puntuaciones como si fueran una distribución exclusiva. `n+` es soporte positivo. El idioma EN agregado incluye CEAS con idioma supuesto; consulte también las filas por fuente.

| Cabeza | Subconjunto | n | n+ | Precisión | Recall | F1 | Brier |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| legitimate | source:CEAS_08 | 8231 | 2537 | 0.674 | 0.998 | 0.805 | 0.135 |
| legitimate | source:remira-synthetic-v1 | 24 | 8 | 0.500 | 0.250 | 0.333 | 0.215 |
| legitimate | language:en | 8243 | 2541 | 0.674 | 0.997 | 0.804 | 0.135 |
| legitimate | language:es | 12 | 4 | 0.000 | 0.000 | 0.000 | 0.232 |
| spam | source:remira-synthetic-v1 | 24 | 4 | 1.000 | 0.500 | 0.667 | 0.064 |
| spam | language:en | 12 | 2 | 0.000 | 0.000 | 0.000 | 0.090 |
| spam | language:es | 12 | 2 | 1.000 | 1.000 | 1.000 | 0.039 |
| phishing | source:CEAS_08 | 8231 | 5694 | 1.000 | 0.478 | 0.646 | 0.221 |
| phishing | source:remira-synthetic-v1 | 24 | 8 | 0.714 | 0.625 | 0.667 | 0.117 |
| phishing | language:en | 8243 | 5698 | 0.999 | 0.478 | 0.646 | 0.220 |
| phishing | language:es | 12 | 4 | 1.000 | 0.750 | 0.857 | 0.075 |
| malicious | source:remira-synthetic-v1 | 24 | 4 | 1.000 | 0.750 | 0.857 | 0.045 |
| malicious | language:en | 12 | 2 | 1.000 | 1.000 | 1.000 | 0.041 |
| malicious | language:es | 12 | 2 | 1.000 | 0.500 | 0.667 | 0.050 |

La cabeza legítima no identificó ninguno de los cuatro legítimos españoles de test al umbral 0.5. El phishing CEAS omite aproximadamente 52 % de los positivos con ese mismo umbral, aunque su precisión sea alta. El resultado no acredita buen rendimiento de uso general ni justifica porcentajes de «seguridad». Spam y malicious tienen únicamente cuatro positivos sintéticos de test por clase, pertenecientes a una sola familia nueva por clase: cifras muy inestables.

En las cuatro filas sintéticas de finalidad factura (dos legítimas y dos phishing), phishing marcó una de las dos fraudulentas y ninguna legítima; omitió una fraudulenta. En cobro (dos legítimas y dos phishing), marcó una legítima y una fraudulenta y omitió la otra fraudulenta. No hubo recibos en test; no se inventa su rendimiento. La cabeza de finalidad obtuvo 12/24 aciertos (50 %) en test sintético. No existe todavía evaluación independiente con facturas reales anonimizadas ni comparación equivalente con todos los modelos anteriores.

## Uso y límites

Ejecutar `.venv/Scripts/python.exe scripts/prepare_corpus.py` y `.venv/Scripts/python.exe scripts/train_corpus.py`. Ambos admiten rutas de salida; no se entrena durante una petición. La preparación es idempotente y preserva fuentes privadas y sus anotaciones. Una fuente cuyo checksum cambie debe importarse bajo una revisión/nombre nuevos, sin borrar el corpus anterior.

`src.corpus_classifier.CorpusRiskClassifier(artifact_path=...)` ofrece `.predict(subject, body, language=None)`. `load_default_classifier()` conserva el modelo en caché. La salida incluye cuatro scores calibrados experimentalmente, versión, finalidad estimada, advertencias y `provisional=true`; vacío legible lanza ValueError e idiomas distintos de ES/EN generan aviso.

Artefacto y métricas detalladas: `models/corpus-v1.joblib`, `models/corpus-v1.metrics.json` y `models/corpus-v1.manifest.json`, ignorados por Git. El manifiesto guarda fuente/checksum, hash normalizado por ejemplo, etiquetas conocidas, idioma, familia y partición. `model_runs` guarda configuración, revisión/hashes de código, checksum de artefacto y métricas. La versión incorpora un hash del corpus y de configuración/código; cambiar datos o configuración genera otro identificador.

No se inspeccionaron ni ejecutaron adjuntos ni se siguieron enlaces para construir características. Las puntuaciones solo describen similitud con este corpus. Legitimidad textual no verifica identidad del remitente; las señales estructurales de engaño requieren una política explícita de presentación. Hace falta ampliar fuentes reales revisadas para español, publicidad y acciones peligrosas, con más familias y calibración independiente, antes de considerar este modelo estable.

## Comprobaciones

Ocho pruebas corpus pasan: importación grande e idempotente, preservación de fuentes privadas, ausencia de etiquetas fabricadas, familias aisladas, entrenamiento real y registro auditable, rechazo de soporte insuficiente, entrada vacía/idioma no cubierto y recorte visible. El entrenamiento completo y la segunda preparación se ejecutaron contra los datos locales; los recuentos se conservaron.

Verificación completa de Python: 92 pruebas aprobadas (.venv/Scripts/python.exe -m pytest -q).

Las anotaciones sintéticas v1 asignan una categoría positiva por escenario aunque las cuatro cabezas permitan coexistencia. Todavía no se evaluaron con ejemplos reales anotados simultáneamente como phishing y maliciosos.

Artefacto final verificado: `corpus-v1-1eaede829e6d`; manifiesto SHA-256 `4b9d130adb630d17c1250eaa613a314de30638bbb080c503883bc265bb565bc7`.

## Categorías principales mostradas en la aplicación

La política integrada combina las cuatro estimaciones con señales concretas y
una finalidad independiente. La publicidad sin engaño observable puede priorizar
spam conservando phishing como secundaria si la cabeza la apoya; factura nunca
anula una señal de robo de credenciales o ejecución peligrosa. Avisos de seguridad
negados no se convierten en órdenes. Esta lógica se comprueba por regresiones.

`python -m scripts.evaluate_corpus_decisions` evalúa solo las familias sintéticas
de test, sin cargar el antiguo modelo auxiliar ni entrenar nada. Resultado
exploratorio: 18/24 estimaciones principales coinciden con sus etiquetas (75 %).
Matriz (filas reales, columnas estimadas: legítimo/spam/phishing/malicioso):

```text
[5, 1, 2, 0]
[0, 4, 0, 0]
[1, 2, 5, 0]
[0, 0, 0, 4]
```

Hay tres phishing que se estiman como legítimo o spam en estos ejemplos. No es
rendimiento sobre correo real ni una garantía; tampoco invalida los errores de
las cabezas al umbral 0.5 reportados arriba. La selección principal es distinta
de medir cada cabeza binaria. El JSON en `models/corpus-decisions.metrics.json`
guarda casos y hash de la política. La política se revisó con ejemplos funcionales;
se declara exploratoria y se necesita una nueva evaluación independiente antes
de estimar su utilidad real. Ningún porcentaje se muestra como seguridad al usuario.

Verificación final de integración (2026-11-10): 99/99 pruebas Python y 71/71 de interfaz, compilaciones web/extensión y lint web aprobados. Pruebas reales de Chrome con extensión 0.3.0 y API local: categorías principales, factura con recomendación tranquila, OCR local y .eml. Web verificada a 1440/390 px sin errores ni desbordamiento. El modelo experimental queda cargado en la API local; recargar la extensión instalada para usar la nueva compilación.
