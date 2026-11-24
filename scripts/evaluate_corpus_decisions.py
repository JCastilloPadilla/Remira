"""Exploratory evaluation of displayed categories on the synthetic test families."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path

from sklearn.metrics import confusion_matrix, classification_report
from src.analysis_engine import AnalysisEngine
from src.corpus_classifier import load_default_classifier
from src.corpus_store import ROOT, connect
from src.hf_classifier import ClassificationResult


class NoAuxiliary:
    # The old HF model is irrelevant to the new primary category; avoid loading it.
    def classify(self, _email):
        return ClassificationResult('not_spam', 0, 'not_spam')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', default=str(ROOT / 'instance/corpus.db'))
    parser.add_argument('--output', default=str(ROOT / 'models/corpus-decisions.metrics.json'))
    args = parser.parse_args()
    model = load_default_classifier()
    engine = AnalysisEngine(classifier_factory=NoAuxiliary, corpus_provider=lambda: model)
    mapping = {'legitimate': 'likely_legitimate', 'spam': 'possible_spam', 'phishing': 'possible_phishing', 'malicious': 'possible_malicious'}
    cases = []
    with connect(args.db) as db:
        rows = db.execute("SELECT e.* FROM corpus_examples e JOIN corpus_sources s ON s.id=e.source_id WHERE e.split='test' AND s.origin_kind='synthetic' ORDER BY e.id").fetchall()
        for row in rows:
            positives = [item['target'] for item in db.execute('SELECT target FROM risk_annotations WHERE example_id=? AND value=1', (row['id'],))]
            if len(positives) != 1:
                continue
            output = engine.analyze({'subject': row['subject'], 'body': row['body']})
            cases.append({'id': row['source_record_id'], 'family': row['template_group'], 'language': row['language'], 'truth': mapping[positives[0]], 'predicted': output['classification']['primary'], 'strength': output['classification']['evidence_strength'], 'purpose': output['purpose']['kind']})
    labels = [*mapping.values(), 'needs_review']
    truth = [case['truth'] for case in cases]; predicted = [case['predicted'] for case in cases]
    metrics = classification_report(truth, predicted, labels=labels, output_dict=True, zero_division=0)
    metrics['accuracy'] = sum(expected == actual for expected, actual in zip(truth, predicted)) / len(cases) if cases else 0
    report = {'evaluation_status': 'exploratory_prototype_synthetic_holdout', 'model_version': model.model_version,
              'n': len(cases), 'labels': labels, 'confusion': confusion_matrix(truth, predicted, labels=labels).tolist(),
              'metrics': metrics,
              'strengths': dict(Counter(case['strength'] for case in cases)), 'cases': cases,
              'policy_sha256': hashlib.sha256((ROOT / 'src/corpus_decision.py').read_bytes()).hexdigest(),
              'limitations': ['Only synthetic test families; no real-mail validation', 'Rules revised using separate functional examples; no independent policy validation claim', 'No risk-score percentage is a safety probability', 'Old auxiliary model disabled; these are displayed corpus categories and structural rules only']}
    path = Path(args.output); path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'n': report['n'], 'accuracy': metrics['accuracy'], 'confusion': report['confusion'], 'output': str(path)}, ensure_ascii=True))


if __name__ == '__main__':
    main()
