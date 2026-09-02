from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import Base, engine
from app.api.schemes import router as schemes_router
from app.api.matching import router as matching_router
from app.api.ai import router as ai_router
from app.api.assistant import router as assistant_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="0.3.0",
    description="Explainable AI-ready scheme matching platform for SIH26092.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schemes_router)
app.include_router(matching_router)
app.include_router(ai_router)
app.include_router(assistant_router)

@app.get("/")
def root():
    return {"name":"SIH26092", "description":"AI-Driven Scheme Matching for Marginalized Entrepreneurs", "version":"0.3.0", "docs":"/docs", "health":"/health"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "sih26092", "version": "0.2.0"}
