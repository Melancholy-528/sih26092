import httpx
from app.ai.llm.base import BaseLLM, LLMError
class GeminiLLM(BaseLLM):
    def __init__(self, api_key, model, timeout=60.0): self.api_key=api_key; self.model=model; self.timeout=timeout
    def generate(self, system_prompt, user_prompt):
        if not self.api_key: raise LLMError('GEMINI_API_KEY is not configured.')
        url=f'https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}'
        try:
            r=httpx.post(url,json={'systemInstruction':{'parts':[{'text':system_prompt}]},'contents':[{'role':'user','parts':[{'text':user_prompt}]}],'generationConfig':{'temperature':0.1}},timeout=self.timeout); r.raise_for_status(); cs=r.json().get('candidates',[])
            if not cs: raise LLMError('Gemini returned no candidates.')
            c=''.join(p.get('text','') for p in cs[0].get('content',{}).get('parts',[])).strip()
            if not c: raise LLMError('Gemini returned an empty response.')
            return c
        except httpx.TimeoutException as e: raise LLMError('Gemini request timed out.') from e
        except httpx.HTTPError as e: raise LLMError(f'Gemini request failed: {e}') from e
