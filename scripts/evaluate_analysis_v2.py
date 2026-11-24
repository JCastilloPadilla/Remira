"""Offline descriptive evaluation; no training, thresholds or score calibration.

Run: python -m scripts.evaluate_analysis_v2 --output tmp/analysis-v2-report.json
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
from importlib.metadata import version


def binary_metrics(truth, predictions):
    if len(truth) != len(predictions):
        raise ValueError("Truth and predictions must have equal length")
    counts = dict(tp=0, tn=0, fp=0, fn=0, abstained_positive=0, abstained_negative=0)
    for actual, predicted in zip(truth, predictions):
        if predicted is None:
            counts["abstained_positive" if actual else "abstained_negative"] += 1
        else:
            counts[("tp" if actual else "fp") if predicted else ("fn" if actual else "tn")] += 1
    tp, tn, fp, fn = (counts[k] for k in ("tp", "tn", "fp", "fn"))
    n = len(truth)
    abstentions = counts["abstained_positive"] + counts["abstained_negative"]
    def ratio(a, b):
        return a / b if b else None
    return {"n": n, **{k: counts[k] for k in ("tp", "tn", "fp", "fn")},
            "abstentions": abstentions,
            "abstained_positive": counts["abstained_positive"],
            "abstained_negative": counts["abstained_negative"],
            "coverage": ratio(n - abstentions, n), "abstention_rate": ratio(abstentions, n),
            "precision": ratio(tp, tp + fp), "recall_decided": ratio(tp, tp + fn),
            "recall_all_positives": ratio(tp, tp + fn + counts["abstained_positive"]),
            "false_positive_rate_decided": ratio(fp, fp + tn)}


def load_corpus(path):
    rows = [json.loads(line) for line in Path(path).read_text(encoding="utf-8").splitlines() if line.strip()]
    ids, messages = set(), set()
    for row in rows:
        message = (row["payload"]["subject"], row["payload"]["body"])
        if row["id"] in ids or message in messages:
            raise ValueError("Repeated id or message: " + row["id"])
        if row["split"] not in {"calibration", "test"} or row["category"] not in {"legitimate", "spam", "phishing"}:
            raise ValueError("Invalid split/category: " + row["id"])
        ids.add(row["id"])
        messages.add(message)
    return rows


def evaluate(rows, classifiers, engine):
    from src.email_data import EmailData
    cases = []
    for row in rows:
        if row["split"] != "test":
            continue
        case = {key: row[key] for key in ("id", "language", "category")}
        case["predictions"], case["raw_labels"], case["errors"] = {}, {}, {}
        payload = row["payload"]
        for name, positive_label in (("spanish_spam", "spam"), ("english_phishing", "malicious")):
            classifier = classifiers.get(name)
            try:
                if classifier is None:
                    raise RuntimeError("Model unavailable locally")
                result = classifier.classify(EmailData(subject=payload.get("subject", ""), body=payload.get("body", "")))
                if result.label not in {positive_label, "not_spam" if name == "spanish_spam" else "legitimate"}:
                    raise ValueError("Unexpected model label")
                case["predictions"][name] = result.label == positive_label
                case["raw_labels"][name] = result.label
            except Exception as error:
                case["predictions"][name] = None
                case["errors"][name] = str(error)
        try:
            response = engine.analyze(payload)
            verdict = response["assessment"]["verdict"]
            case["predictions"]["hybrid_v2"] = {"suspicious": True, "no_clear_signals": False, "inconclusive": None}[verdict]
            case["assessment"] = response["assessment"]
            case["raw_labels"]["hybrid_v2"] = response.get("label")
        except Exception as error:
            case["predictions"]["hybrid_v2"] = None
            case["errors"]["hybrid_v2"] = str(error)
        cases.append(case)
    metrics = {}
    for name, supported, target in (("spanish_spam", {"es"}, "spam"),
                                    ("english_phishing", {"en"}, "phishing"),
                                    ("hybrid_v2", {"es", "en"}, "phishing")):
        metrics[name] = {}
        for group in ("all", "supported", "unsupported"):
            selected = [c for c in cases if group == "all" or ((c["language"] in supported) == (group == "supported"))]
            metrics[name][group] = binary_metrics([c["category"] == target for c in selected],
                                                   [c["predictions"][name] for c in selected])
        metrics[name]["target"] = target
        metrics[name]["by_category"] = {
            category: binary_metrics([c["category"] == target for c in cases if c["category"] == category],
                                     [c["predictions"][name] for c in cases if c["category"] == category])
            for category in ("legitimate", "spam", "phishing")}
    return {"metrics": metrics, "cases": cases}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fixturepath", "--fixtures", type=Path, default=Path("data/fixtures/analysis-v2.jsonl"))
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--exploratory", action="store_true", help="Mark reruns after the test cases have informed policy changes")
    args = parser.parse_args()
    # Set before importing transformers; model weights must already be cached.
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"
    from src.hf_classifier import SpanishSpamClassifier, PhishingEmailClassifier
    from src.analysis_engine import AnalysisEngine
    classifiers, errors = {}, {}
    for name, cls in (("spanish_spam", SpanishSpamClassifier), ("english_phishing", PhishingEmailClassifier)):
        try:
            classifiers[name] = cls(local_files_only=True)
        except Exception as error:
            classifiers[name], errors[name] = None, str(error)
    rows = load_corpus(args.fixturepath)
    def model_provider(language):
        model = classifiers.get({"es": "spanish_spam", "en": "english_phishing"}.get(language))
        if model is None:
            raise RuntimeError("Model unavailable locally for " + language)
        return model
    report = evaluate(rows, classifiers, AnalysisEngine(model_provider=model_provider))
    report.update({"fixture_sha256": hashlib.sha256(args.fixturepath.read_bytes()).hexdigest(),
                   "fixture": args.fixturepath.as_posix(), "schema_version": 1,
                   "corpus_origin": "manually written synthetic; no real/private messages",
                   "split_counts": {s: sum(r["split"] == s for r in rows) for s in ("calibration", "test")},
                   "model_load_errors": errors,
                   "runtime": {"python": platform.python_version(), **{package: version(package) for package in ("torch", "transformers", "langdetect")}},
                   "source_sha256": {str(path): hashlib.sha256(path.read_bytes()).hexdigest() for path in (Path("src/analysis_engine.py"), Path("src/hf_classifier.py"))},
                   "models": {name: {"model": classifier.model_name,
                                     "revision": getattr(classifier._pipeline.model.config, "_commit_hash", None),
                                     "device": str(classifier._pipeline.device), "max_tokens": 512}
                              for name, classifier in classifiers.items() if classifier is not None},
                   "evaluation_status": "exploratory_after_test_observed" if args.exploratory else "descriptive_fixed_policy",
                   "protocol": "Script fits no parameters; calibration split reserved and never scored or fitted. Independent holdout status requires policy to be fixed before observing test results.",
                   "limitations": ["Small synthetic corpus, not real-mail validation", "No calibrated probabilities", "Different model tasks; targets reported separately", "Coverage is fraction of non-abstained decisions, not OCR coverage", "Unsupported-language model output is diagnostic only"]})
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"output": str(args.output), "metrics": report["metrics"], "model_load_errors": errors}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
