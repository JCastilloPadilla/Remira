-- Esquema de diseño. No crea ni importa automáticamente correos personales.
PRAGMA foreign_keys = ON;

CREATE TABLE corpus_sources (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    source_url TEXT,
    license TEXT,
    revision TEXT,
    checksum TEXT,
    origin_kind TEXT NOT NULL CHECK (origin_kind IN ('public_real', 'synthetic', 'consented_private')),
    label_definition TEXT NOT NULL
);

CREATE TABLE corpus_examples (
    id INTEGER PRIMARY KEY,
    source_id INTEGER NOT NULL REFERENCES corpus_sources(id),
    source_record_id TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL,
    language TEXT NOT NULL,
    normalized_hash TEXT NOT NULL,
    template_group TEXT NOT NULL,
    annotation_status TEXT NOT NULL DEFAULT 'pending' CHECK (annotation_status IN ('pending', 'reviewed', 'rejected')),
    split TEXT CHECK (split IN ('train', 'validation', 'test')),
    anonymized INTEGER NOT NULL CHECK (anonymized IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (source_id, source_record_id)
);
CREATE INDEX example_hash ON corpus_examples(normalized_hash);
CREATE INDEX example_group ON corpus_examples(template_group);

-- Ausencia de fila = desconocido, no negativo. Permite etiquetas superpuestas.
CREATE TABLE risk_annotations (
    example_id INTEGER NOT NULL REFERENCES corpus_examples(id) ON DELETE CASCADE,
    target TEXT NOT NULL CHECK (target IN ('legitimate', 'spam', 'phishing', 'malicious')),
    value INTEGER NOT NULL CHECK (value IN (0, 1)),
    annotation_origin TEXT NOT NULL CHECK (annotation_origin IN ('source_label', 'human_review')),
    reviewer TEXT,
    rationale TEXT NOT NULL,
    PRIMARY KEY (example_id, target)
);

CREATE TABLE purpose_annotations (
    example_id INTEGER NOT NULL REFERENCES corpus_examples(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL CHECK (purpose IN ('invoice', 'payment_request', 'receipt', 'account_notice', 'advertisement', 'ordinary', 'other')),
    reviewer TEXT,
    rationale TEXT NOT NULL,
    PRIMARY KEY (example_id, purpose)
);

CREATE TABLE model_runs (
    id INTEGER PRIMARY KEY,
    version TEXT NOT NULL UNIQUE,
    corpus_manifest_hash TEXT NOT NULL,
    code_revision TEXT NOT NULL,
    configuration_json TEXT NOT NULL,
    validation_metrics_json TEXT NOT NULL,
    test_metrics_json TEXT,
    artifact_path TEXT NOT NULL,
    artifact_checksum TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE annotation_proposals (
    id INTEGER PRIMARY KEY,
    example_id INTEGER NOT NULL REFERENCES corpus_examples(id),
    dimension TEXT NOT NULL CHECK (dimension IN ('risk', 'purpose')),
    proposed_target TEXT NOT NULL,
    proposed_value INTEGER NOT NULL CHECK (proposed_value IN (0, 1)),
    rationale TEXT NOT NULL,
    review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'accepted', 'rejected')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
      (dimension = 'risk' AND proposed_target IN ('legitimate', 'spam', 'phishing', 'malicious'))
      OR
      (dimension = 'purpose' AND proposed_target IN ('invoice', 'payment_request', 'receipt', 'account_notice', 'advertisement', 'ordinary', 'other'))
    )
);

-- El importador/entrenador debe rechazar particiones donde una familia aparezca
-- en más de un split y contradicciones de anotación legítimo+riesgo positivo.
