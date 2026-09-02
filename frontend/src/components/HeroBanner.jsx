import React from 'react';
import { Target, Bot, Award, Zap, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';

export default function HeroBanner({ setActiveTab, analytics }) {
  const stats = [
    {
      icon: ShieldCheck,
      label: 'Verified Schemes Indexed',
      value: analytics?.total_schemes || 16,
      subtext: 'NSFDC, NSTFDC, NBCFDC, NMDFC, PMEGP & Central Schemes',
      color: 'var(--accent)',
    },
    {
      icon: TrendingUp,
      label: 'Max Loan Range',
      value: 'Up to ₹1 Crore',
      subtext: 'Concessional interest rates (4% - 8%) & 35% subsidies',
      color: 'var(--accent-cyan)',
    },
    {
      icon: Award,
      label: 'Matching Algorithm',
      value: 'Hybrid 70:30',
      subtext: '70% Hard Rule Verification + 30% AI Vector Semantic Relevance',
      color: 'var(--primary)',
    },
    {
      icon: Zap,
      label: 'Grounded RAG Model',
      value: 'Qwen 2.5 Coder 3B',
      subtext: 'Local Ollama zero-hallucination assistant with source citations',
      color: 'var(--accent-pink)',
    },
  ];

  return (
    <div style={{ padding: '2rem 0 1rem' }}>
      <div className="glass-card" style={{ padding: '2.5rem 2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow backdrop effects */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '1rem' }}>
            <Zap size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>Smart India Hackathon SIH26092 Solution</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF', lineHeight: 1.2, marginBottom: '1rem', maxWidth: '850px' }}>
            AI-Driven Scheme Matching & Financial Inclusion for <span className="gradient-text">Marginalized Entrepreneurs</span>
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '780px', marginBottom: '2rem', lineHeight: 1.6 }}>
            Empowering Scheduled Castes (SC), Scheduled Tribes (ST), OBCs, Minorities, Women, Artisans, and PwD micro-entrepreneurs across India. Receive instant rule-matched schemes, precise loan limits, interest rates, required document checklists, and interactive guidance powered by <strong>Ollama Qwen 2.5 Coder 3B Grounded RAG</strong>.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button className="btn-primary" onClick={() => setActiveTab('matcher')}>
              <Target size={18} />
              <span>Check Applicant Eligibility Now</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('assistant')}>
              <Bot size={18} color="var(--accent-cyan)" />
              <span>Ask AI Chat Assistant</span>
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {stats.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '10px' }}>
                      <Icon size={20} color={st.color} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
                    {st.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {st.subtext}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
