# Implementación del clasificador con corpus

**Autorización:** el usuario pide completar el diseño e integrarlo para uso real en su clasificador. Ejecutar sin nueva aprobación; preservar todos los cambios anteriores.

**Diseño:** docs/diseno-clasificador-corpus.md y docs/clasificador-corpus-schema.sql.

## Tareas y contrato

- [x] SQLite: importar CEAS_08 con etiquetas parciales y semilla sintética ES/EN de estructuras anotadas explícitamente. No almacenar correos personales del chat. Fuentes, hash, grupos, partición y manifiesto de modelos auditables.
- [x] Entrenar cabezas legítimo/spam/phishing/malicious con TF-IDF de palabras/caracteres y comparar LogisticRegression, NB y LinearSVC. Calibrar/seleccionar con validación, nunca test. Informar fuentes reales/sintéticas y soporte insuficiente; no presentar clases sintéticas como validadas en correo real.
- [x] Interfaz Python `CorpusRiskClassifier(artifact_path=...)`, `.predict(subject, body, language=None)` => `{scores:{legitimate,spam,phishing,malicious}, model_version:string, provisional:bool, warnings:string[], purpose?:string}`. Artefacto local versionado, sin entrenamiento en petición HTTP. `load_default_classifier()` caché en módulo o equivalente.
- [x] API: añadir `classification:{primary:'likely_legitimate'|'possible_spam'|'possible_phishing'|'possible_malicious',secondary:string[],evidence_strength:'weak'|'moderate'|'strong',provisional:bool,model_version:string}`, `purpose:{kind:'invoice'|'payment_request'|'receipt'|'account_notice'|'advertisement'|'ordinary'|'other',basis:string[]}`, `recommendation:string`, `warnings:string[]`.
- [x] Mantener assessment técnico anterior para compatibilidad/diagnóstico; resultado principal procede del corpus y señales concretas. Factura no anula riesgo; legitimidad requiere apoyo positivo. OCR vacío requiere acción y no clasificación fabricada. Metadatos de calidad son aviso secundario.
- [x] Web y extensión consumen el contrato nuevo, muestran categoría principal, finalidad/recomendación y señales, con avisos de estimación débil/cobertura. Conservar OCR/.eml/privacidad.
- [x] Pruebas, entrenamiento real, informe y navegador; recargar API/compilar extensión para uso inmediato.

## Archivos por dominio paralelo

Corpus/modelo: src/corpus_store.py, src/corpus_classifier.py, scripts/prepare_corpus.py, scripts/train_corpus.py, data/fixtures/corpus-seed-v1.jsonl, tests/test_corpus_*.py y reporte propio.

UI: frontend/src/features/analysis/{assessment,api,AnalysisResult}.ts(x), extension/src/{AnalysisResult,analysis-types}.tsx/ts y pruebas UI/clientes.

Integración: src/analysis_engine.py, src/corpus_decision.py, src/api.py si necesario, tests de decisión, scripts de navegador, documentación/paquete.

## Límites

Primer artefacto experimental con estructuras sintéticas para clases sin corpus real suficiente. Validación común para comparar cabezas; reportar soporte y métricas por idioma/origen. Toda puntuación describe el corpus, no autenticidad ni seguridad garantizada. Correcciones de usuario no reentrenan automáticamente.

## Cierre verificado — 2026-11-10

Base local: 39,314 ejemplos (39,154 CEAS y 160 sintéticos ES/EN). Artefacto corpus-v1-1eaede829e6d entrenado y cargado por la API local. Extensión 0.3.0 compilada.

Verificación final: Python 99/99, Vitest 71/71, compilación web/extensión y lint web aprobados. Pruebas en Chrome con extensión real: categorías, factura con calma, OCR local, .eml y ausencia de red externa. Web probada a 1440/390 px sin errores ni desbordamiento.

Evaluación exploratoria de la decisión final: 18/24 familias sintéticas de test (75 %); no mide precisión sobre correo real. Persisten soporte real insuficiente ES/spam/malicioso y límite de 15,000 caracteres normalizados con aviso. No se usó el correo personal compartido para entrenar. Detalles en docs/resultados-corpus-v1.md.
