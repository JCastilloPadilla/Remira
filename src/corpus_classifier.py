"""Local inference only: loading this module never trains a model."""
from functools import lru_cache
from pathlib import Path
import re
import joblib
from src.corpus_store import ROOT, TARGETS


def feature_text(subject, body):
    text=(subject or '')+'\n'+(body or '')
    text=re.sub(r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}',' emailaddress ',text)
    text=re.sub(r'https?://[^\s<>]+',' webaddress ',text)
    return re.sub(r'\b\d+(?:[.,:/-]\d+)*\b',' number ',text)


class CorpusRiskClassifier:
    def __init__(self, artifact_path=None):
        path=Path(artifact_path) if artifact_path else ROOT/'models/corpus-v1.joblib'
        if not path.is_file():
            raise FileNotFoundError(f'Corpus artifact unavailable: {path}; run scripts/train_corpus.py offline')
        self.artifact=joblib.load(path)
        self.model_version=self.artifact['version']

    def predict(self, subject, body, language=None):
        if not ((subject or '').strip() or (body or '').strip()):
            raise ValueError('Readable text is required')
        normalized=feature_text(subject,body)
        truncated=len(normalized)>15000
        features=self.artifact['vectorizer'].transform([normalized[:15000]])
        scores={}
        for target in TARGETS:
            head=self.artifact['heads'][target]
            raw=head['model'].predict_proba(features)[:,1] if hasattr(head['model'],'predict_proba') else head['model'].decision_function(features)
            scores[target]=float(head['calibrator'].predict_proba(raw.reshape(-1,1))[0,1])
        warnings=['Modelo experimental: spam y contenido malicioso solo cuentan con ejemplos sintéticos; estimaciones de contenido, no autenticidad.']
        if language and language.lower().split('-')[0] not in ('es','en'):
            warnings.append('Idioma fuera de la cobertura de entrenamiento ES/EN.')
        if truncated:
            warnings.append('El modelo solo procesó los primeros 15,000 caracteres del texto normalizado; revisa también el contenido restante.')
        result=dict(scores=scores,model_version=self.model_version,provisional=True,warnings=warnings,truncated=truncated,processed_characters=min(len(normalized),15000),total_characters=len(normalized),character_count_basis='normalized_text')
        if self.artifact.get('purpose_model'):
            result['purpose']=str(self.artifact['purpose_model'].predict(features)[0])
        return result


@lru_cache(maxsize=1)
def load_default_classifier():
    return CorpusRiskClassifier()
