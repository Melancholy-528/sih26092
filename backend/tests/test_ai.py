import json
from pathlib import Path

def test_scheme_documents_exist():
    path = Path(__file__).resolve().parents[2] / "data" / "documents" / "nsfdc.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    assert len(data["documents"]) >= 4
    assert all(d["source_url"].startswith("https://") for d in data["documents"])
