from pathlib import Path
import json
import numpy as np
import pytest
from scripts.train_corpus import train_corpus
from src.corpus_store import prepare_corpus, connect
from src.corpus_classifier import CorpusRiskClassifier

ROOT=Path(__file__).resolve().parents[1]


def test_real_training_artifact_predicts_and_records_provenance(tmp_path):
    db=tmp_path/'corpus.db'
    prepare_corpus(db,ROOT/'data/fixtures/corpus-seed-v1.jsonl',None)
    artifact=tmp_path/'model.joblib'
    report=tmp_path/'report.json'
    result=train_corpus(db,artifact,report)
    classifier=CorpusRiskClassifier(artifact)
    prediction=classifier.predict('Recibo','Recibimos el pago. Conserva tu comprobante.','es')
    assert set(prediction['scores']) == {'legitimate','spam','phishing','malicious'}
    assert all(0 <= p <= 1 for p in prediction['scores'].values())
    assert prediction['provisional'] is True
    assert classifier.predict('Bonjour','Votre reçu','fr')['warnings'][-1].startswith('Idioma')
    assert all(len(result['validation_comparison'][k]) == 3 for k in prediction['scores'])
    assert all(result['calibration_support'][k]['positive'] > 0 for k in prediction['scores'])
    with connect(db) as cx:
        assert cx.execute('select count(*) from model_runs').fetchone()[0] == 1
    assert json.loads(report.read_text())['manifest_hash'] == result['manifest_hash']
    with pytest.raises(ValueError):
        classifier.predict('','')


def test_refuses_training_a_head_without_both_labels(tmp_path):
    db=tmp_path/'corpus.db'
    prepare_corpus(db,ROOT/'data/fixtures/corpus-seed-v1.jsonl',None)
    with connect(db) as cx:
        cx.execute("delete from risk_annotations where target='malicious' and value=1")
    with pytest.raises(ValueError,match='malicious'):
        train_corpus(db,tmp_path/'model.joblib',tmp_path/'report.json')


def test_prediction_reports_normalized_text_truncation(tmp_path):
    import joblib
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    import numpy as np
    vec=TfidfVectorizer().fit(['ordinary receipt','run executable'])
    model=LogisticRegression().fit(vec.transform(['ordinary receipt','run executable']),[0,1])
    calibrator=LogisticRegression().fit(np.array([[0.],[1.]]),[0,1])
    path=tmp_path/'tiny.joblib'
    joblib.dump(dict(version='test',vectorizer=vec,heads={k:dict(model=model,calibrator=calibrator) for k in ['legitimate','spam','phishing','malicious']}),path)
    result=CorpusRiskClassifier(path).predict('Receipt','ordinary receipt '*2000)
    assert result['truncated'] is True
    assert result['processed_characters']==15000
    assert result['total_characters']>15000
    assert any('15,000' in warning for warning in result['warnings'])
