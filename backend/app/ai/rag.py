from app.ai.llm import get_llm
from app.ai.llm.base import LLMError
from app.ai.prompts import SYSTEM_PROMPT, USER_PROMPT
from app.ai.retriever import search
def answer_question(question, top_k=5):
    hits=search(question,top_k=top_k)
    if not hits: return {'answer':'I could not find relevant verified scheme information for that question.','evidence':[],'confidence':0.0,'llm_used':False}
    context='\n\n'.join(f"[SOURCE {i}]\nTitle: {h['title']}\nScheme: {h.get('scheme_code','N/A')}\nURL: {h['source_url']}\nContent: {h['text']}" for i,h in enumerate(hits,1))
    try: answer=get_llm().generate(SYSTEM_PROMPT,USER_PROMPT.format(question=question,context=context)); used=True
    except LLMError: answer='The AI language model is currently unavailable.\n\n'+ '\n\n'.join(f"- {h['title']}: {h['text']}" for h in hits[:3]); used=False
    confidence=round(max(0,min(1,sum(h['similarity'] for h in hits[:3])/min(3,len(hits)))),3)
    return {'answer':answer,'evidence':[{'title':h['title'],'scheme_code':h.get('scheme_code'),'source_url':h['source_url'],'similarity':h['similarity']} for h in hits],'confidence':confidence,'llm_used':used}
