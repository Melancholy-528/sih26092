from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.ai.retriever import search, build_index

router = APIRouter(prefix="/api/ai", tags=["ai"])

class SearchRequest(BaseModel):
    query: str = Field(min_length=3)
    top_k: int = Field(default=5, ge=1, le=20)

@router.post("/index")
def rebuild_index():
    result = build_index()
    return {"documents_indexed": len(result["documents"])}

@router.post("/search")
def semantic_search(request: SearchRequest):
    try:
        return {"query": request.query, "results": search(request.query, request.top_k)}
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
