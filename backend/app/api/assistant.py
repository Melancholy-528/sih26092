from fastapi import APIRouter, HTTPException
from app.ai.rag import answer_question
from app.core.config import settings
from app.schemas.assistant import AssistantRequest, AssistantResponse
router=APIRouter(prefix='/api/assistant',tags=['assistant'])
@router.post('/ask',response_model=AssistantResponse)
def ask(request: AssistantRequest):
    try: result=answer_question(request.question,request.top_k)
    except RuntimeError as exc: raise HTTPException(status_code=503,detail=str(exc))
    return AssistantResponse(question=request.question,provider=settings.llm_provider,**result,disclaimer='Informational guidance only. Final eligibility, sanction, and application decisions are made by the relevant authority/channel partner.')
