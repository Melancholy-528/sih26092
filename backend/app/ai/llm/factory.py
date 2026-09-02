from functools import lru_cache
from app.core.config import settings
from app.ai.llm.base import LLMError
from app.ai.llm.ollama import OllamaLLM
from app.ai.llm.gemini import GeminiLLM
from app.ai.llm.openai import OpenAILLM
@lru_cache(maxsize=1)
def get_llm():
    p=settings.llm_provider.lower()
    if p=='ollama': return OllamaLLM(settings.ollama_url,settings.ollama_model,settings.llm_timeout)
    if p=='gemini': return GeminiLLM(settings.gemini_api_key,settings.gemini_model,settings.llm_timeout)
    if p=='openai': return OpenAILLM(settings.openai_api_key,settings.openai_model,settings.llm_timeout)
    raise LLMError(f"Unsupported LLM_PROVIDER '{settings.llm_provider}'.")
