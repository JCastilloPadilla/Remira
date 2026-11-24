"""Reproducible offline training, with test isolated from all model choices."""
from __future__ import annotations
import argparse
from collections import Counter, defaultdict
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.metrics import average_precision_score, brier_score_loss, precision_recall_fscore_support, confusion_matrix
import sklearn
from src.corpus_store import connect, ROOT, TARGETS, checksum, validate_partition
from src.corpus_classifier import feature_text


def weights(rows, indices):
    # Equal total source weights, and equal languages within each source.
    counts=Counter((rows[i]['source'],rows[i]['language']) for i in indices)
    languages=Counter(s for s,_ in counts)
    sources={s for s,_ in counts}
    return np.asarray([len(indices)/(len(sources)*languages[rows[i]['source']]*counts[(rows[i]['source'],rows[i]['language'])]) for i in indices])


def raw_score(model, x):
    return model.predict_proba(x)[:,1] if hasattr(model,'predict_proba') else model.decision_function(x)


def binary_metrics(y, p):
    precision,recall,f1,_=precision_recall_fscore_support(y,np.asarray(p)>=.5,average='binary',zero_division=0)
    return dict(n=len(y),positive=int(sum(y)),negative=int(len(y)-sum(y)),precision=float(precision),recall=float(recall),f1=float(f1),brier=float(brier_score_loss(y,p)),confusion=confusion_matrix(y,np.asarray(p)>=.5,labels=[0,1]).tolist())


def train_corpus(db=ROOT/'instance/corpus.db', artifact=ROOT/'models/corpus-v1.joblib', report=ROOT/'models/corpus-v1.metrics.json'):
    artifact,report=Path(artifact),Path(report)
    with connect(db) as cx:
        validate_partition(cx)
        rows=[dict(r) for r in cx.execute('select e.*,s.name source,s.origin_kind from corpus_examples e join corpus_sources s on s.id=e.source_id where e.split is not null and e.annotation_status=\'reviewed\' order by e.id')]
        annotations=defaultdict(dict)
        for r in cx.execute('select * from risk_annotations'):
            annotations[r['example_id']][r['target']]=r['value']
        purposes={r['example_id']:r['purpose'] for r in cx.execute('select * from purpose_annotations')}
        sources=[dict(r) for r in cx.execute('select * from corpus_sources order by id')]
    train=[i for i,r in enumerate(rows) if r['split']=='train']
    valid=[i for i,r in enumerate(rows) if r['split']=='validation']
    common=[i for i in valid if all(k in annotations[rows[i]['id']] for k in TARGETS)]
    # Support checks occur before costly fitting and never inspect test outcomes.
    for target in TARGETS:
        for name,idx in [('train',train),('common validation',common)]:
            known=[annotations[rows[i]['id']][target] for i in idx if target in annotations[rows[i]['id']]]
            if set(known)!={0,1}:
                raise ValueError(f'{target}: {name} requires known positive and negative labels')
    vectorizer=FeatureUnion([
        ('word',TfidfVectorizer(ngram_range=(1,2),min_df=1,max_features=35000,sublinear_tf=True,dtype=np.float32)),
        ('character',TfidfVectorizer(analyzer='char_wb',ngram_range=(3,5),min_df=2,max_features=45000,sublinear_tf=True,dtype=np.float32)),
    ])
    texts=[feature_text(r['subject'],r['body'])[:15000] for r in rows]
    print(f'Vectorizing train={len(train)}, validation={len(valid)}, common={len(common)}',flush=True)
    vectorizer.fit([texts[i] for i in train])
    x=vectorizer.transform(texts).tocsr()
    heads={}; comparison={}; support={}; calibration_diagnostics={}
    for target in TARGETS:
        idx=[i for i in train if target in annotations[rows[i]['id']]]
        y=np.asarray([annotations[rows[i]['id']][target] for i in idx])
        ycommon=np.asarray([annotations[rows[i]['id']][target] for i in common])
        candidates={
            'LogisticRegression':LogisticRegression(C=2.0,solver='liblinear',max_iter=1000,random_state=42),
            'MultinomialNB':MultinomialNB(alpha=.5),
            'LinearSVC':LinearSVC(C=.5,random_state=42,max_iter=5000),
        }
        comparison[target]={}
        for name,model in candidates.items():
            print(f'Fitting {target}: {name}, known={len(idx)}',flush=True)
            model.fit(x[idx],y,sample_weight=weights(rows,idx))
            # AP is rank based: avoids comparing incompatible raw margins.
            # Average by language on the SAME fully annotated seed validation.
            aps=[]
            for lang in sorted({rows[i]['language'] for i in common}):
                li=[i for i in common if rows[i]['language']==lang]
                ly=[annotations[rows[i]['id']][target] for i in li]
                aps.append(float(average_precision_score(ly,raw_score(model,x[li]))))
            comparison[target][name]={'mean_language_average_precision':float(np.mean(aps))}
        selected=max(candidates,key=lambda name:comparison[target][name]['mean_language_average_precision'])
        model=candidates[selected]
        raw=raw_score(model,x[common])
        calibrator=LogisticRegression(C=10.0,solver='lbfgs',max_iter=1000,random_state=42)
        calibrator.fit(raw.reshape(-1,1),ycommon,sample_weight=weights(rows,common))
        heads[target]=dict(model=model,calibrator=calibrator,selected=selected)
        support[target]={'n':len(common),'positive':int(sum(ycommon)),'negative':int(len(ycommon)-sum(ycommon))}
        calibration_diagnostics[target]=binary_metrics(ycommon,calibrator.predict_proba(raw.reshape(-1,1))[:,1])
    purpose_idx=[i for i in train if rows[i]['id'] in purposes]
    purpose_model=LogisticRegression(C=3.0,max_iter=1500,random_state=42)
    purpose_model.fit(x[purpose_idx],[purposes[rows[i]['id']] for i in purpose_idx],sample_weight=weights(rows,purpose_idx))
    manifest={'sources':sources,'examples':[dict(id=r['id'],source=r['source'],source_record_id=r['source_record_id'],hash=r['normalized_hash'],family=r['template_group'],split=r['split'],language=r['language'],labels=annotations[r['id']],purpose=purposes.get(r['id'])) for r in rows]}
    manifest_hash=hashlib.sha256(json.dumps(manifest,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    try:
        revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
    except (OSError,subprocess.CalledProcessError):
        revision='unavailable'
    code_hashes={name:checksum(ROOT/name) for name in ['src/corpus_store.py','src/corpus_classifier.py','scripts/train_corpus.py','scripts/prepare_corpus.py']}
    configuration=dict(seed=42,sklearn_version=sklearn.__version__,source_weight='equal total per source; equal language within source',selection='max mean ES/EN AP on common fully annotated validation; ties in listed model order',calibration='sigmoid LogisticRegression C=10 on common validation; never test',max_text_characters=15000,positive_threshold=.5,provisional=True,code_hashes=code_hashes)
    version='corpus-v1-'+hashlib.sha256((manifest_hash+json.dumps(configuration,sort_keys=True)).encode()).hexdigest()[:12]
    # Model choices are frozen above. Test is evaluated only now.
    test=[i for i,r in enumerate(rows) if r['split']=='test']
    test_metrics={}
    for target in TARGETS:
        test_metrics[target]={}
        known=[i for i in test if target in annotations[rows[i]['id']]]
        slices={'all':known}
        for field in ['source','language','origin_kind']:
            for value in sorted({rows[i][field] for i in known}):
                slices[field+':'+value]=[i for i in known if rows[i][field]==value]
        for purpose in ['invoice','payment_request','receipt']:
            slices['purpose:'+purpose]=[i for i in known if purposes.get(rows[i]['id'])==purpose]
        for name,idx in slices.items():
            if not idx:
                continue
            yy=np.asarray([annotations[rows[i]['id']][target] for i in idx])
            raw=raw_score(heads[target]['model'],x[idx])
            pp=heads[target]['calibrator'].predict_proba(raw.reshape(-1,1))[:,1]
            test_metrics[target][name]=binary_metrics(yy,pp)
    purpose_true=[purposes[rows[i]['id']] for i in test if rows[i]['id'] in purposes]
    purpose_test=[i for i in test if rows[i]['id'] in purposes]
    purpose_pred=purpose_model.predict(x[purpose_test])
    purpose_metrics={'n':len(purpose_true),'accuracy':float(np.mean(np.asarray(purpose_true)==purpose_pred))}
    result=dict(version=version,created_at=datetime.now(timezone.utc).isoformat(),manifest_hash=manifest_hash,code_revision=revision,configuration=configuration,split_counts=dict(Counter(r['split'] for r in rows)),validation_comparison=comparison,selected={k:v['selected'] for k,v in heads.items()},calibration_support=support,validation_calibration_in_sample=calibration_diagnostics,test_metrics=test_metrics,purpose_test=purpose_metrics,limits=['Spam and malicious evaluated only on small synthetic examples, not real-world mail.','Common validation is reused for selection and sigmoid calibration; calibration diagnostics are in-sample and optimistic.','CEAS language is assumed English, not individually verified.','Grouping uses normalized duplicate and shared first 160 words, not exhaustive semantic near-duplicate detection.','Purpose trained only from synthetic templates; unsupported real-world accuracy.','Scores are experimental corpus estimates, not verified safety probabilities.'])
    artifact.parent.mkdir(parents=True,exist_ok=True)
    # Atomic replacement ensures readers never load an incomplete artifact.
    staging=artifact.with_suffix('.tmp')
    joblib.dump(dict(version=version,vectorizer=vectorizer,heads=heads,purpose_model=purpose_model,metadata=result),staging,compress=3)
    staging.replace(artifact)
    report.parent.mkdir(parents=True,exist_ok=True)
    report.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    artifact.with_suffix('.manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    with connect(db) as cx:
        cx.execute('insert into model_runs(version,corpus_manifest_hash,code_revision,configuration_json,validation_metrics_json,test_metrics_json,artifact_path,artifact_checksum) values(?,?,?,?,?,?,?,?) on conflict(version) do update set corpus_manifest_hash=excluded.corpus_manifest_hash,code_revision=excluded.code_revision,configuration_json=excluded.configuration_json,validation_metrics_json=excluded.validation_metrics_json,test_metrics_json=excluded.test_metrics_json,artifact_path=excluded.artifact_path,artifact_checksum=excluded.artifact_checksum,created_at=CURRENT_TIMESTAMP',(version,manifest_hash,revision,json.dumps(configuration),json.dumps({'comparison':comparison,'support':support,'calibration_in_sample':calibration_diagnostics}),json.dumps(test_metrics),str(artifact.resolve()),checksum(artifact)))
    print(json.dumps({'selected':result['selected'],'test_n':len(test),'artifact':str(artifact)},indent=2),flush=True)
    return result


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db',type=Path,default=ROOT/'instance/corpus.db')
    parser.add_argument('--artifact',type=Path,default=ROOT/'models/corpus-v1.joblib')
    parser.add_argument('--report',type=Path,default=ROOT/'models/corpus-v1.metrics.json')
    args=parser.parse_args()
    train_corpus(args.db,args.artifact,args.report)
