import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users, DollarSign, ShieldAlert, Award } from 'lucide-react';

export default function AnalyticsDashboard({ analytics }) {
  const data = analytics || {
    total_schemes: 16,
    community_breakdown: { SC: 6, ST: 3, OBC: 2, Minority: 2, General: 3 },
    total_max_loan_pool: 24500000,
    average_interest_rate: 7.2,
    providers_count: 8,
  };

  const communityColors = {
    SC: 'var(--primary)',
    ST: 'var(--accent)',
    OBC: 'var(--accent-cyan)',
    Minority: 'var(--warning)',
    General: 'var(--accent-pink)',
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <BarChart3 size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Indexed Schemes</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>{data.total_schemes}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Across 8 Ministries & Corporations</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <TrendingUp size={20} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Funding Capacity</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>
            ₹{(data.total_max_loan_pool / 10000000).toFixed(2)} Cr
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Max credit pool available</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Award size={20} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Interest Rate</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {data.average_interest_rate}% p.a.
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Concessional rate vs 14% commercial</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Users size={20} color="var(--accent-pink)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Implementing Agencies</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>{data.providers_count}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>NSFDC, NSTFDC, NBCFDC, KVIC, SIDBI</span>
        </div>

      </div>

      {/* Community Coverage Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="var(--primary)" /> Scheme Distribution by Beneficiary Target Group
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(data.community_breakdown).map(([cat, count]) => {
              const pct = Math.round((count / data.total_schemes) * 100);
              const barColor = communityColors[cat] || 'var(--primary)';
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#FFF', fontWeight: 600 }}>{cat} Target Schemes</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} Schemes ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="var(--accent)" /> SIH26092 Explainable AI Architecture
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid var(--accent)' }}>
              <strong style={{ color: '#FFF' }}>1. Zero-Hallucination RAG Assistant:</strong> Grounded prompt architecture forces Ollama Qwen2.5-Coder:3b to respond ONLY from verified government scheme documentation with source citations.
            </div>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
              <strong style={{ color: '#FFF' }}>2. Hybrid Rule + Embedding Score:</strong> Hard eligibility rules enforce financial and category ceilings, while sentence-transformers semantic vectors rank relevant business sectors.
            </div>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '12px', borderRadius: '10px', borderLeft: '3px solid var(--accent-cyan)' }}>
              <strong style={{ color: '#FFF' }}>3. Multi-Channel Partner Routing:</strong> Automatically maps matched schemes to state channelizing agencies (SCAs), district industry centers (DICs), and rural banks.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
