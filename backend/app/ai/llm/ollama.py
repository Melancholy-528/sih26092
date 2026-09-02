import httpx
from app.ai.llm.base import BaseLLM, LLMError
class OllamaLLM(BaseLLM):
    def __init__(self, base_url, model, timeout=60.0): self.base_url=base_url.rstrip('/'); self.model=model; self.timeout=timeout
    def generate(self, system_prompt, user_prompt):
        try:
            r=httpx.post(f'{self.base_url}/api/chat',json={'model':self.model,'stream':False,'messages':[{'role':'system','content':system_prompt},{'role':'user','content':user_prompt}],'options':{'temperature':0.1}},timeout=self.timeout); r.raise_for_status(); c=r.json().get('message',{}).get('content','').strip()
            if not c: raise LLMError('Ollama returned an empty response.')
            return c
        except httpx.TimeoutException as e: raise LLMError(f'Ollama timed out after {self.timeout:.0f}s.') from e
        except httpx.HTTPError as e: raise LLMError(f'Ollama request failed: {e}') from e
