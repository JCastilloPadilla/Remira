"""Offline corpus preparation; never imports analyzed personal messages."""
import argparse
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from src.corpus_store import prepare_corpus, ROOT

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db',type=Path,default=ROOT/'instance/corpus.db')
    parser.add_argument('--seed',type=Path,default=ROOT/'data/fixtures/corpus-seed-v1.jsonl')
    parser.add_argument('--public',type=Path,default=ROOT/'data/raw/CEAS_08.csv')
    parser.add_argument('--seed-only',action='store_true',help='Prepara solo la semilla sintética de forma explícita; no reproduce el corpus público completo')
    args=parser.parse_args()
    if not args.seed_only and not args.public.is_file():
        parser.error('Falta CEAS_08.csv. Descárgalo de la fuente documentada o usa --seed-only para un corpus exclusivamente sintético.')
    print(prepare_corpus(args.db,args.seed,None if args.seed_only else args.public))
