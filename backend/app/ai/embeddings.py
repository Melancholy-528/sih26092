from functools import lru_cache
import os
import numpy as np

MODEL_NAME = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

@lru_cache(maxsize=1)
def get_model():
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError as exc:
        raise RuntimeError(
            "sentence-transformers is not installed. Run: pip install sentence-transformers"
        ) from exc
    return SentenceTransformer(MODEL_NAME)

def embed(texts: list[str]) -> np.ndarray:
    model = get_model()
    return np.asarray(model.encode(texts, normalize_embeddings=True))
