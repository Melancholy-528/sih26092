import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Layers, Check, X, ExternalLink, Sparkles, Scale, Info } from 'lucide-react';

export default function SchemeExplorer({ onAskAI, setSelectedSchemeForDocs }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [comparedSchemes, setComparedSchemes] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/schemes');
      if (res.ok) {
        const data = await res.json();
        setSchemes(data);
      }
    } catch (err) {
      console.error("Error loading schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.beneficiary_category.toLowerCase() === selectedCategory.toLowerCase() || s.beneficiary_category.toLowerCase() === 'general';
    const matchesSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()) || s.provider.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleCompare = (scheme) => {
    if (comparedSchemes.some((item) => item.id === scheme.id)) {
      setComparedSchemes(comparedSchemes.filter((item) => item.id !== scheme.id));
    } else {
      if (comparedSchemes.length >= 3) {
        alert("You can compare up to 3 schemes at a time.");
        return;
      }
      setComparedSchemes([...comparedSchemes, scheme]);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      
      {/* Top Controls: Search Bar & Filters */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              placeholder="Search schemes by name, keyword, provider, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px' }}>
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'sc', label: 'SC' },
            { id: 'st', label: 'ST' },
            { id: 'obc', label: 'OBC' },
            { id: 'minority', label: 'Minority' },
            { id: 'general', label: 'Central / Open' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                color: selectedCategory === cat.id ? '#FFF' : 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Compare Floating CTA */}
        {comparedSchemes.length > 0 && (
          <button
            className="btn-primary"
            onClick={() => setShowCompareModal(true)}
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
          >
            <Scale size={18} />
            <span>Compare Selected ({comparedSchemes.length})</span>
          </button>
        )}
      </div>

      {/* Grid of Schemes */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="pulse-dot" style={{ margin: '0 auto 12px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading government schemes index...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredSchemes.map((s) => {
            const isCompared = comparedSchemes.some((item) => item.id === s.id);
            return (
              <div key={s.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: isCompared ? '3px solid var(--accent)' : 'none' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="glass-pill" style={{ color: 'var(--accent-cyan)' }}>
                      {s.code}
                    </span>
                    <span className="glass-pill" style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.15)', color: 'var(--primary)' }}>
                      Target: {s.beneficiary_category}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                    {s.name}
                  </h4>
                  
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: '12px' }}>
                    {s.provider}
                  </p>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                    {s.description}
                  </p>

                  {/* Highlights Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(15,23,42,0.6)', padding: '10px', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Max Loan Cap</span>
                      <strong style={{ color: '#FFF' }}>{s.max_loan_amount ? `₹${s.max_loan_amount.toLocaleString('en-IN')}` : 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Interest Rate</span>
                      <strong style={{ color: 'var(--accent)' }}>{s.beneficiary_interest_rate ? `${s.beneficiary_interest_rate}% p.a.` : 'Subsidy'}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(s)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span>Compare</span>
                  </label>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedSchemeForDocs({ code: s.code, name: s.name, details: { required_documents: s.required_documents, channel_partners: s.channel_partners } })}
                      style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    >
                      Checklist
                    </button>
                    
                    <button
                      className="btn-primary"
                      onClick={() => onAskAI(`What are the key benefits and document checklist for ${s.name} (${s.code})?`)}
                      style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    >
                      <Sparkles size={12} />
                      Ask AI
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Scheme Comparison Matrix Modal */}
      {showCompareModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: '#0F172A', border: '1px solid var(--primary)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scale size={24} color="var(--accent)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>Side-by-Side Scheme Comparison Matrix</h3>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setShowCompareModal(false)}
                style={{ padding: '6px 12px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Comparison Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(30,41,59,0.8)' }}>
                  <th style={{ padding: '14px', textAlign: 'left', width: '200px', color: 'var(--text-muted)' }}>Feature Parameter</th>
                  {comparedSchemes.map((cs) => (
                    <th key={cs.id} style={{ padding: '14px', textAlign: 'left', color: '#FFF', fontSize: '1rem' }}>
                      <div style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>{cs.code}</div>
                      {cs.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Implementing Authority</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px' }}>{cs.provider}</td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Target Beneficiary</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px' }}>
                      <span className="glass-pill" style={{ color: 'var(--accent)' }}>{cs.beneficiary_category}</span>
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Max Project Cost</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px', fontWeight: 700 }}>
                      {cs.max_project_cost ? `₹${cs.max_project_cost.toLocaleString('en-IN')}` : 'No Cap'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Max Loan Amount</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px', fontWeight: 700, color: '#FFF' }}>
                      {cs.max_loan_amount ? `₹${cs.max_loan_amount.toLocaleString('en-IN')}` : 'N/A'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Interest Rate</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                      {cs.beneficiary_interest_rate ? `${cs.beneficiary_interest_rate}% p.a.` : 'Capital Subsidy'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Repayment & Moratorium</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px' }}>
                      {cs.repayment_years || 5} Years ({cs.moratorium_months || 3} Mos Moratorium)
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Channelizing Partners</td>
                  {comparedSchemes.map((cs) => (
                    <td key={cs.id} style={{ padding: '12px', fontSize: '0.78rem' }}>
                      {(cs.channel_partners || []).join(', ')}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      )}

    </div>
  );
}
