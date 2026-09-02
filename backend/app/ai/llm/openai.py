import httpx
from app.ai.llm.base import BaseLLM, LLMError
class OpenAILLM(BaseLLM):
    def __init__(self, api_key, model, timeout=60.0): self.api_key=api_key; self.model=model; self.timeout=timeout
    def generate(self, system_prompt, user_prompt):
        if not self.api_key: raise LLMError('OPENAI_API_KEY is not configured.')
        try:
            r=httpx.post('https://api.openai.com/v1/chat/completions',json={'model':self.model,'messages':[{'role':'system','content':system_prompt},{'role':'user','content':user_prompt}],'temperature':0.1},headers={'Authorization':f'Bearer {self.api_key}'},timeout=self.timeout); r.raise_for_status(); c=r.json().get('choices',[{}])[0].get('message',{}).get('content','').strip()
            if not c: raise LLMError('OpenAI returned an empty response.')
            return c
        except (httpx.TimeoutException) as e: raise LLMError('OpenAI request timed out.') from e
        except (httpx.HTTPError, IndexError, KeyError) as e: raise LLMError(f'OpenAI request failed: {e}') from e
