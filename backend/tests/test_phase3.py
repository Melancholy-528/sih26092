from app.ai.prompts import SYSTEM_PROMPT

def test_rag_prompt_is_grounded():
    assert 'ONLY the supplied retrieved evidence' in SYSTEM_PROMPT
    assert 'Never invent' in SYSTEM_PROMPT
