#!/usr/bin/env bash
set -e

echo "======================================================================"
echo "  SIH26092: AI-Driven Scheme Matching for Marginalized Entrepreneurs  "
echo "======================================================================"

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Check Ollama
echo "[1/4] Checking Ollama AI model (qwen2.5-coder:3b)..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "  -> Ollama service is active on http://localhost:11434"
else
    echo "  -> WARNING: Ollama is not running on http://localhost:11434. Starting Ollama..."
    ollama serve &
    sleep 3
fi

# 2. Seed database & build vector index
echo "[2/4] Initializing Database & SentenceTransformer Vector Index..."
cd "$BASE_DIR/backend"
PYTHONPATH=. .venv/bin/python app/seed.py
PYTHONPATH=. .venv/bin/python -c "from app.ai.retriever import build_index; res = build_index(); print('  -> Vector Index Built with', len(res['documents']), 'documents')"

# 3. Start Backend Server
echo "[3/4] Launching FastAPI Backend Server on http://localhost:8000..."
PYTHONPATH=. .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 4. Start Frontend Server
echo "[4/4] Launching Vite React Frontend on http://localhost:5173..."
cd "$BASE_DIR/frontend"
npm run dev -- --port 5173 &
FRONTEND_PID=$!

echo "======================================================================"
echo "  System Ready!"
echo "  Backend API:  http://localhost:8000/docs"
echo "  Frontend UI:  http://localhost:5173"
echo "  AI Chatbot:   Ollama qwen2.5-coder:3b Grounded RAG"
echo "======================================================================"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT
wait
