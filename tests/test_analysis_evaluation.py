"""Evaluation arithmetic is tested with literal decisions, without loading models."""
from pathlib import Path

import pytest

from scripts.evaluate_analysis_v2 import binary_metrics, load_corpus, evaluate


def test_metrics_keep_abstained_positives_out_of_decided_fn_and_show_them():
    result = binary_metrics([True, True, False, False, True, False],
                            [True, False, True, False, None, None])
    assert result == {
        "n": 6, "tp": 1, "tn": 1, "fp": 1, "fn": 1,
        "abstentions": 2, "abstained_positive": 1, "abstained_negative": 1,
        "coverage": 4 / 6, "abstention_rate": 2 / 6,
        "precision": 0.5, "recall_decided": 0.5, "recall_all_positives": 1 / 3,
        "false_positive_rate_decided": 0.5,
    }


def test_undefined_metrics_are_null_and_lengths_cannot_silently_truncate():
    result = binary_metrics([True], [None])
    assert result["precision"] is None
    assert result["recall_decided"] is None
    assert result["recall_all_positives"] == 0
    with pytest.raises(ValueError):
        binary_metrics([True], [])


def test_versioned_fixture_has_disjoint_splits_and_distinct_messages():
    rows = load_corpus(Path("data/fixtures/analysis-v2.jsonl"))
    assert 36 <= len(rows) <= 60
    calibration = {r["id"] for r in rows if r["split"] == "calibration"}
    test = {r["id"] for r in rows if r["split"] == "test"}
    assert len(calibration) >= 9 and len(test) >= 27
    assert not calibration & test
    assert len({(r["payload"]["subject"], r["payload"]["body"]) for r in rows}) == len(rows)
    assert {r["category"] for r in rows} == {"legitimate", "spam", "phishing"}
    assert {r["language"] for r in rows} >= {"es", "en", "fr"}


def test_evaluation_uses_test_only_and_preserves_distinct_targets():
    rows = [
        {"id": "cal", "split": "calibration", "language": "es", "category": "phishing", "payload": {}},
        {"id": "one", "split": "test", "language": "es", "category": "spam", "payload": {}},
        {"id": "two", "split": "test", "language": "en", "category": "phishing", "payload": {}},
    ]
    class Classifier:
        def classify(self, email):
            return type("Result", (), {"label": "spam"})()
    class Engine:
        def analyze(self, payload):
            return {"assessment": {"verdict": "inconclusive"}}
    report = evaluate(rows, {"spanish_spam": Classifier(), "english_phishing": None}, Engine())
    assert [r["id"] for r in report["cases"]] == ["one", "two"]
    assert report["metrics"]["spanish_spam"]["supported"]["tp"] == 1
    assert report["metrics"]["hybrid_v2"]["supported"]["abstained_positive"] == 1
    assert report["metrics"]["english_phishing"]["supported"]["abstentions"] == 1
