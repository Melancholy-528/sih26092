from pydantic import BaseModel, Field
class AssistantRequest(BaseModel):
    question: str = Field(min_length=3,max_length=2000)
    top_k: int = Field(default=5,ge=1,le=10)
class Evidence(BaseModel):
    title: str
    scheme_code: str|None=None
    source_url: str
    similarity: float
class AssistantResponse(BaseModel):
    question: str
    answer: str
    evidence: list[Evidence]
    confidence: float
    llm_used: bool
    provider: str
    disclaimer: str
