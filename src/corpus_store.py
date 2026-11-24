"""Auditable, idempotent local corpus import. Unknown labels remain absent."""
from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path
import re
import sqlite3
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
TARGETS = ('legitimate', 'spam', 'phishing', 'malicious')


def connect(path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    cx = sqlite3.connect(path)
    cx.row_factory = sqlite3.Row
    cx.execute('PRAGMA foreign_keys=ON')
    if not cx.execute("select 1 from sqlite_master where name='corpus_sources'").fetchone():
        cx.executescript((ROOT/'docs/clasificador-corpus-schema.sql').read_text(encoding='utf-8'))
    return cx


def checksum(path):
    h = hashlib.sha256()
    with open(path, 'rb') as stream:
        for block in iter(lambda: stream.read(1024*1024), b''):
            h.update(block)
    return h.hexdigest()


def normalize(text):
    text = re.sub(r'[\w.+-]+@[\w.-]+\.[a-z]{2,}', ' emailaddress ', text.lower())
    text = re.sub(r'https?://[^\s<>]+', ' webaddress ', text)
    text = re.sub(r'\b\d+(?:[.,:/-]\d+)*\b', ' number ', text)
    return ' '.join(re.findall(r'[\w]+', text))


def source(cx, name, path, origin, definition, url):
    row = cx.execute('select id, checksum from corpus_sources where name=?', (name,)).fetchone()
    digest = checksum(path)
    if row:
        if row['checksum'] != digest:
            raise ValueError(f'Source {name} changed: import under a new version, preserving existing rows')
        return row['id']
    return cx.execute('insert into corpus_sources(name,source_url,license,revision,checksum,origin_kind,label_definition) values(?,?,?,?,?,?,?)',
                      (name,url,'See upstream source record' if origin=='public_real' else 'Original synthetic educational fixtures','v1',digest,origin,json.dumps(definition))).lastrowid


def insert_example(cx, sid, record, group):
    labels = record['labels']
    if labels.get('legitimate') == 1 and any(labels.get(k) == 1 for k in TARGETS[1:]):
        raise ValueError('Contradictory legitimacy annotation')
    normalized = normalize(record['subject']+' '+record['body'])
    cx.execute('insert or ignore into corpus_examples(source_id,source_record_id,subject,body,language,normalized_hash,template_group,annotation_status,anonymized) values(?,?,?,?,?,?,?,?,?)',
               (sid,str(record['id']),record['subject'],record['body'],record['language'],hashlib.sha256(normalized.encode()).hexdigest(),group,'reviewed',record.get('anonymized',1)))
    eid = cx.execute('select id from corpus_examples where source_id=? and source_record_id=?',(sid,str(record['id']))).fetchone()[0]
    for target,value in labels.items():
        cx.execute('insert or ignore into risk_annotations values(?,?,?,?,?,?)',(eid,target,value,'source_label',None,record['rationale']))
    if record.get('purpose'):
        cx.execute('insert or ignore into purpose_annotations values(?,?,?,?)',(eid,record['purpose'],None,record['rationale']))


def assign_splits(cx):
    # Existing partitions (including consented private sources) remain immutable.
    families=defaultdict(list)
    for row in cx.execute('select e.template_group,s.name from corpus_examples e join corpus_sources s on s.id=e.source_id where e.split is null group by e.template_group,s.name'):
        group=row['template_group']
        stratum = 'public' if row['name']=='CEAS_08' else ('spam' if group.startswith('seed:spam-') else 'malicious' if group.startswith('seed:malicious-') else 'paired')
        families[stratum].append(group)
    for stratum,groups in families.items():
        groups.sort(key=lambda g:hashlib.sha256(('corpus-v1:'+g).encode()).hexdigest())
        # Rounded counts supply validation/test support for the small seed strata.
        nvalid=max(1,round(len(groups)*.15)) if len(groups)>=3 else 0
        ntest=nvalid
        for i,group in enumerate(groups):
            existing=cx.execute('select distinct split from corpus_examples where template_group=? and split is not null',(group,)).fetchall()
            split=existing[0][0] if existing else ('validation' if i<nvalid else 'test' if i<nvalid+ntest else 'train')
            cx.execute('update corpus_examples set split=? where template_group=? and split is null',(split,group))


def validate_partition(cx):
    if cx.execute('select template_group from corpus_examples group by template_group having count(distinct split)>1').fetchone():
        raise ValueError('Template family leaks across partitions')
    if cx.execute('select normalized_hash from corpus_examples group by normalized_hash having count(distinct split)>1').fetchone():
        raise ValueError('Normalized duplicate leaks across partitions')
    if cx.execute('select example_id from risk_annotations group by example_id having max(case when target=\'legitimate\' then value else 0 end)=1 and max(case when target!=\'legitimate\' then value else 0 end)=1').fetchone():
        raise ValueError('Contradictory legitimacy annotation')


def prepare_corpus(db=ROOT/'instance/corpus.db', seed=ROOT/'data/fixtures/corpus-seed-v1.jsonl', public=ROOT/'data/raw/CEAS_08.csv'):
    with connect(db) as cx:
        sid=source(cx,'remira-synthetic-v1',seed,'synthetic',{'known':list(TARGETS),'review':'original synthetic annotations; not human review'},'local:corpus-seed-v1.jsonl')
        for line in Path(seed).read_text(encoding='utf-8').splitlines():
            row=json.loads(line)
            insert_example(cx,sid,row,row['template_group'])
        if public and Path(public).exists():
            sid=source(cx,'CEAS_08',public,'public_real',{'0':{'legitimate':1,'phishing':0},'1':{'legitimate':0,'phishing':1},'spam':'unknown','malicious':'unknown'},'https://zenodo.org/records/8339691')
            csv.field_size_limit(16 * 1024 * 1024)
            with open(public,encoding='utf-8-sig',newline='') as stream:
                for i,row in enumerate(csv.DictReader(stream)):
                    label=int(row['label'])
                    if label not in (0,1):
                        raise ValueError('Unknown CEAS label')
                    body=row.get('body','') or ''
                    subject=row.get('subject','') or ''
                    # Normalize repeated forwarding/IDs. The first 160 normalized words
                    # deliberately overgroups shared boilerplate to reduce leakage.
                    signature=' '.join(normalize(body).split()[:160])
                    group='ceas:'+hashlib.sha256(signature.encode()).hexdigest()
                    # Strip email addresses and variable identifiers; URLs keep hosts so
                    # structural evidence remains available to downstream decision logic.
                    clean=lambda t: re.sub(r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}','[EMAIL]',t)
                    insert_example(cx,sid,dict(id=i,anonymized=0,subject=clean(subject),body=clean(body),language='en',labels={'legitimate':1-label,'phishing':label},rationale='CEAS source label 0 legitimate / 1 phishing; other dimensions unknown'),group)
        # Source-reviewed means the declared label mapping was checked, NOT that
        # an individual human reviewed each message. Annotations remain source_label.
        cx.execute("update corpus_examples set annotation_status='reviewed' where source_id in (select id from corpus_sources where name in ('CEAS_08','remira-synthetic-v1')) and annotation_status='pending'")
        cx.execute("update corpus_examples set anonymized=0 where source_id in (select id from corpus_sources where name='CEAS_08')")
        # Merge normalized duplicates globally, including subject variations.
        for row in cx.execute('select normalized_hash,min(template_group) g,count(distinct template_group) n from corpus_examples group by normalized_hash having n>1').fetchall():
            groups=[r[0] for r in cx.execute('select distinct template_group from corpus_examples where normalized_hash=?',(row['normalized_hash'],))]
            # Never move previously partitioned private examples.
            if not any(cx.execute('select 1 from corpus_examples where template_group=? and split is not null',(g,)).fetchone() for g in groups):
                for group in groups:
                    cx.execute('update corpus_examples set template_group=? where template_group=?',(row['g'],group))
        assign_splits(cx)
        validate_partition(cx)
        return {r['split']:r['n'] for r in cx.execute('select split,count(*) n from corpus_examples group by split')}
