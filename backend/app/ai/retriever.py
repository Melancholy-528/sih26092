from pathlib import Path
import json
import pickle
import numpy as np
from app.ai.embeddings import embed

DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "documents"
INDEX_PATH = DATA_DIR / "index.pkl"

def _documents():
    docs = []
    for path in DATA_DIR.glob("*.json"):
        payload = json.loads(path.read_text(encoding="utf-8"))
        docs.extend(payload.get("documents", []))
    return docs

def build_index():
    docs = _documents()
    if not docs:
        return {"documents": [], "embeddings": []}

    vectors = embed([d["text"] for d in docs])
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with INDEX_PATH.open("wb") as f:
        pickle.dump({"documents": docs, "embeddings": vectors}, f)
    return {"documents": docs, "embeddings": vectors}

def _load_index():
    if not INDEX_PATH.exists():
        return build_index()
    with INDEX_PATH.open("rb") as f:
        return pickle.load(f)

def search(query: str, top_k: int = 5):
    index = _load_index()
    docs = index["documents"]
    vectors = np.asarray(index["embeddings"])

    if not docs:
        return []

    q = embed([query])[0]
    scores = vectors @ q
    order = np.argsort(scores)[::-1][:top_k]

    return [
        {
            **docs[i],
            "similarity": round(float(scores[i]), 4),
        }
        for i in order
    ]
