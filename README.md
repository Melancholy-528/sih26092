# SIH26092 — Phase 3: LLM + Grounded RAG

Phase 3 adds a provider-independent LLM layer over the verified retrieval corpus.

## 1. Install

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

## 2. Ollama first

Install/start Ollama separately, then pull the configured model:

```bash
ollama pull qwen2.5-coder:3b
ollama list
```

Start the API:

```bash
uvicorn app.main:app --reload
```

If you already built the Phase 2 index, it can be reused.

## 3. Test the assistant

```bash
curl -X POST http://localhost:8000/api/assistant/ask \\
  -H "Content-Type: application/json" \\
  -d '{"question":"I want to start an ₹8 lakh transport business. Which scheme may fit me?","top_k":5}'
```

The response contains the generated answer, evidence, similarity scores,
confidence, provider, and whether the LLM was actually used.

## 4. Switch to Gemini

Create `.env` from `.env.example`, then set:

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Restart FastAPI.

## 5. Switch to OpenAI

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
```

Restart FastAPI.

## Safety architecture

Hard eligibility remains in `app/services/eligibility.py`. The LLM cannot turn
an ineligible applicant into an eligible one. The RAG prompt instructs the model
to use only retrieved evidence and state when evidence is insufficient.

Do not commit `.env` or API keys. Government scheme information should be
versioned with source URL, retrieval date, and review status for production.
