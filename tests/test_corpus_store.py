from pathlib import Path
import json
import sqlite3
import pytest

from src.corpus_store import prepare_corpus, connect, validate_partition
from src.corpus_classifier import CorpusRiskClassifier

ROOT = Path(__file__).resolve().parents[1]


def test_prepare_idempotent_partial_labels_and_family_isolation(tmp_path):
    public = tmp_path / 'public.csv'
    public.write_text('subject,body,label\nHello,Meeting tomorrow,0\nVerify,Send your password now,1\n', encoding='utf-8')
    db = tmp_path / 'corpus.db'
    prepare_corpus(db, ROOT / 'data/fixtures/corpus-seed-v1.jsonl', public)
    with connect(db) as cx:
        before = cx.execute('select count(*) from corpus_examples').fetchone()[0]
        assert before >= 120
        assert cx.execute("select count(*) from risk_annotations r join corpus_examples e on e.id=r.example_id join corpus_sources s on s.id=e.source_id where s.name='CEAS_08' and r.target in ('spam','malicious')").fetchone()[0] == 0
        assert cx.execute("select count(*) from risk_annotations where annotation_origin='human_review'").fetchone()[0] == 0
        validate_partition(cx)
    prepare_corpus(db, ROOT / 'data/fixtures/corpus-seed-v1.jsonl', public)
    with connect(db) as cx:
        assert cx.execute('select count(*) from corpus_examples').fetchone()[0] == before
        assert not cx.execute('select template_group from corpus_examples group by template_group having count(distinct split)>1').fetchall()


def test_missing_artifact_does_not_train(tmp_path):
    with pytest.raises(FileNotFoundError):
        CorpusRiskClassifier(tmp_path / 'missing.joblib')


def test_seed_has_no_contradictions_and_paired_languages():
    rows = [json.loads(x) for x in (ROOT/'data/fixtures/corpus-seed-v1.jsonl').read_text(encoding='utf-8').splitlines()]
    assert 100 <= len(rows) <= 240
    for row in rows:
        assert set(row['labels']) == {'legitimate', 'spam', 'phishing', 'malicious'}
        assert not (row['labels']['legitimate'] and any(row['labels'][k] for k in ('spam','phishing','malicious')))
    groups = {r['template_group'] for r in rows}
    for group in groups:
        assert {r['language'] for r in rows if r['template_group'] == group} == {'es', 'en'}


def test_import_accepts_large_public_body(tmp_path):
    public = tmp_path/'large.csv'
    public.write_text('subject,body,label\nHello,' + 'word '*30000 + ',0\n',encoding='utf-8')
    db=tmp_path/'corpus.db'
    prepare_corpus(db,ROOT/'data/fixtures/corpus-seed-v1.jsonl',public)
    with connect(db) as cx:
        assert cx.execute("select count(*) from corpus_examples where length(body)>131072").fetchone()[0] == 1


def test_reimport_preserves_private_source_and_annotations(tmp_path):
    db=tmp_path/'private.db'
    prepare_corpus(db,ROOT/'data/fixtures/corpus-seed-v1.jsonl',None)
    with connect(db) as cx:
        sid=cx.execute("insert into corpus_sources(name,origin_kind,label_definition) values('consented-test','consented_private','legitimate')").lastrowid
        eid=cx.execute("insert into corpus_examples(source_id,source_record_id,subject,body,language,normalized_hash,template_group,anonymized,split) values(?,'private-1','Private','Consented placeholder','es','private-unique-hash','private-unique-family',1,'train')",(sid,)).lastrowid
        cx.execute("insert into risk_annotations values(?,'legitimate',1,'human_review','test reviewer','Authorized test placeholder')",(eid,))
    prepare_corpus(db,ROOT/'data/fixtures/corpus-seed-v1.jsonl',None)
    with connect(db) as cx:
        row=cx.execute('select * from risk_annotations where example_id=?',(eid,)).fetchone()
        assert row['annotation_origin']=='human_review'
        assert cx.execute('select split from corpus_examples where id=?',(eid,)).fetchone()[0]=='train'
