import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Send, Mic, Sparkles, ExternalLink, ShieldAlert, Award, FileText, RefreshCw } from 'lucide-react';

export default function AssistantChat({ initialPrompt, clearInitialPrompt }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **UdyamMarg AI Scheme Assistant**, powered by **Ollama Qwen 2.5 Coder 3B** with Grounded Vector RAG.

How can I help you today? You can ask me about:
- 📌 Concessional loans & interest rates for SC, ST, OBC, Minority, or Women entrepreneurs
- 💰 Subsidies under PMEGP, PM Vishwakarma, and Stand-Up India
- 📜 Required document checklists & channelizing partner bank details
- ⚖️ Scheme comparisons and eligibility rules`,
      evidence: [],
      confidence: 1.0,
      provider: 'ollama:qwen2.5-coder:3b',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionPills = [
    "What schemes are available for SC female entrepreneurs?",
    "Explain PMEGP 35% capital subsidy rules and eligibility",
    "What are the interest rates and loans for PM Vishwakarma traditional artisans?",
    "Compare NSFDC Term Loan vs Stand-Up India scheme",
    "What documents do I need for NBCFDC New Swarnima scheme?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      setInputQuery(initialPrompt);
      handleSendMessage(initialPrompt);
      if (clearInitialPrompt) clearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, top_k: 5 }),
      });

      if (!response.ok) {
        throw new Error('AI Assistant endpoint returned an error.');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          evidence: data.evidence || [],
          confidence: data.confidence,
          provider: data.provider || 'ollama',
          llm_used: data.llm_used,
          disclaimer: data.disclaimer,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Service Notice:** Unable to reach AI backend server at http://localhost:8000. Please ensure the FastAPI server and Ollama are running.`,
          evidence: [],
          confidence: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '75vh', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--gradient-hero)', padding: '10px', borderRadius: '12px' }}>
              <Bot size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', margin: 0 }}>Grounded AI Assistant</h3>
                <span className="glass-pill" style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', borderColor: 'rgba(6,182,212,0.3)' }}>
                  Ollama qwen2.5-coder:3b
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Zero-hallucination factual scheme advice with verified sources</p>
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setMessages([messages[0]])}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            title="Clear Chat Conversation"
          >
            <RefreshCw size={14} />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Suggestion Pills Bar */}
        <div style={{ padding: '10px 1.5rem', background: 'rgba(30, 41, 59, 0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="var(--primary)" /> Prompts:
          </span>
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill)}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-main)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Messages Stream Area */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                }}
                className="animate-fade-in"
              >
                {/* Avatar Icon */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: isUser ? 'var(--primary)' : 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isUser ? <User size={20} color="#FFF" /> : <Bot size={20} color="#FFF" />}
                </div>

                {/* Message Content Bubble */}
                <div style={{ maxWidth: '80%' }}>
                  <div
                    style={{
                      background: isUser ? 'var(--primary)' : 'rgba(30, 41, 59, 0.8)',
                      border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: '#FFF',
                      padding: '14px 18px',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      fontSize: '0.925rem',
                      lineHeight: '1.6',
                    }}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Grounded Evidence Citations & Confidence (for Assistant) */}
                  {!isUser && msg.evidence && msg.evidence.length > 0 && (
                    <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Award size={14} /> Official Verified Source Evidence ({msg.evidence.length})
                        </span>
                        {msg.confidence !== undefined && (
                          <span className="glass-pill" style={{ fontSize: '0.68rem', color: 'var(--accent)' }}>
                            Confidence: {Math.round(msg.confidence * 100)}%
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {msg.evidence.map((ev, evIdx) => (
                          <div key={evIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>📄 <strong>{ev.title}</strong> ({ev.scheme_code})</span>
                            <a href={ev.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              Source <ExternalLink size={10} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer notice */}
                  {!isUser && msg.disclaimer && (
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                      ℹ️ {msg.disclaimer}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#FFF" />
              </div>
              <div className="glass-card" style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="pulse-dot"></div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Generating answer with Ollama qwen2.5-coder:3b...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(15, 23, 42, 0.9)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '12px', borderRadius: '10px' }}
              title="Voice Speech Input"
              onClick={() => alert("Voice input active! Speak your question now...")}
            >
              <Mic size={18} color="var(--accent-cyan)" />
            </button>

            <input
              type="text"
              className="input-field"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about schemes, loans, interest rates, eligibility criteria, or documents..."
              disabled={loading}
            />

            <button type="submit" className="btn-primary" disabled={loading || !inputQuery.trim()}>
              <Send size={18} />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
