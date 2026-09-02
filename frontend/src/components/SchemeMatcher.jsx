import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, ArrowRight, Shield, FileText, Landmark, Sparkles, Filter } from 'lucide-react';

export default function SchemeMatcher({ onAskAI, setSelectedSchemeForDocs }) {
  const [formData, setFormData] = useState({
    name: 'Ramesh Kumar',
    age: 32,
    category: 'SC',
    gender: 'male',
    annual_family_income: 250000,
    state: 'Maharashtra',
    district: 'Nagpur',
    project_cost: 300000,
    business_type: 'transport',
    business_description: 'Setting up a commercial electric auto-rickshaw transport service.',
  });

  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // all, eligible, partial, ineligible
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  const categories = [
    { id: 'SC', name: 'Scheduled Caste (SC)' },
    { id: 'ST', name: 'Scheduled Tribe (ST)' },
    { id: 'OBC', name: 'Other Backward Classes (OBC)' },
    { id: 'Minority', name: 'Notified Minority (Muslim/Sikh/Christian/Buddhist/Parsi/Jain)' },
    { id: 'General', name: 'General / Micro Entrepreneur' },
  ];

  const sectors = [
    { id: 'transport', name: 'Transport & E-Vehicles (E-Rickshaw, Auto, Commercial)' },
    { id: 'retail', name: 'Retail, Shop & Grocery' },
    { id: 'agriculture', name: 'Agriculture, Dairy, Farming & Poultry' },
    { id: 'manufacturing', name: 'Manufacturing & Small Factory' },
    { id: 'handicrafts', name: 'Handicrafts, Weaving & Artisans (Vishwakarma)' },
    { id: 'boutique', name: 'Boutique, Tailoring & Garments' },
    { id: 'services', name: 'Repair Shop & Service Enterprise' },
    { id: 'green business', name: 'Green / Solar / Recycling Energy' },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate scheme eligibility. Backend service error.');
      }

      const data = await response.json();
      setMatchResults(data);
    } catch (err) {
      setError(err.message || 'Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matchResults?.matches?.filter((match) => {
    if (filterTab === 'eligible') return match.eligible;
    if (filterTab === 'ineligible') return !match.eligible;
    if (filterTab === 'partial') return !match.eligible && match.score > 30;
    return true;
  }) || [];

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: matchResults ? '1fr 1.6fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
        
        {/* Left Column: Applicant Profile Quiz Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
            <div style={{ background: 'rgba(99,102,241,0.15)', padding: '10px', borderRadius: '12px' }}>
              <Target size={22} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>Applicant Profile Wizard</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter profile details for instant AI rule evaluation</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Name & Age */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px' }}>
              <div>
                <label className="input-label">Applicant Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="input-label">Age (Years)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.age}
                  min={18}
                  max={100}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                  required
                />
              </div>
            </div>

            {/* Category & Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
              <div>
                <label className="input-label">Beneficiary Category</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ background: '#1E293B' }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Gender</label>
                <select
                  className="input-field"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{ background: '#1E293B' }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Transgender/Other</option>
                </select>
              </div>
            </div>

            {/* Annual Household Income Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="input-label">Annual Family Income</label>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>
                  ₹{formData.annual_family_income.toLocaleString('en-IN')} / year
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                step={25000}
                value={formData.annual_family_income}
                onChange={(e) => setFormData({ ...formData, annual_family_income: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                <span>₹0 (Below Poverty Line)</span>
                <span>₹5 Lakh (NSFDC Ceiling)</span>
                <span>₹10 Lakh+</span>
              </div>
            </div>

            {/* Project Cost Financing Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="input-label">Required Project Financing</label>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  ₹{formData.project_cost.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={5000000}
                step={25000}
                value={formData.project_cost}
                onChange={(e) => setFormData({ ...formData, project_cost: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                <span>₹20k (Micro)</span>
                <span>₹1.4 Lakh (MFS)</span>
                <span>₹5 Lakh (UNY)</span>
                <span>₹50 Lakh (Term Loan)</span>
              </div>
            </div>

            {/* Business Sector */}
            <div>
              <label className="input-label">Target Business Sector</label>
              <select
                className="input-field"
                value={formData.business_type}
                onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                style={{ background: '#1E293B' }}
              >
                {sectors.map((sec) => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>

            {/* State & District */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">State</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">District</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>

            {/* Business Proposal Brief */}
            <div>
              <label className="input-label">Business Description / Proposal</label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.business_description}
                onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                placeholder="Briefly describe your proposed business activity..."
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', padding: '14px' }}>
              {loading ? (
                <>
                  <div className="pulse-dot" style={{ background: '#FFF' }}></div>
                  <span>Running Hybrid Rule & Semantic AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze Scheme Eligibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Match Results Display */}
        {matchResults && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            
            {/* Header & Filter Bar */}
            <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
                  Matched Schemes ({filteredMatches.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Applicant: <strong>{matchResults.applicant.name}</strong> ({matchResults.applicant.category}, ₹{matchResults.applicant.project_cost.toLocaleString('en-IN')} project)
                </p>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(15,23,42,0.8)', padding: '4px', borderRadius: '10px' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'eligible', label: '✅ Eligible Only' },
                  { id: 'partial', label: '⚠️ Partial Match' },
                  { id: 'ineligible', label: '❌ Ineligible' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    style={{
                      background: filterTab === tab.id ? 'var(--primary)' : 'transparent',
                      color: filterTab === tab.id ? '#FFF' : 'var(--text-muted)',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Match Cards */}
            {filteredMatches.length === 0 ? (
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={36} color="var(--warning)" style={{ marginBottom: '8px' }} />
                <p>No schemes match the selected filter criteria. Try selecting "All" or adjusting your project cost/income.</p>
              </div>
            ) : (
              filteredMatches.map((match) => {
                const isExpanded = expandedSchemeId === match.scheme_id;
                const scoreClass = match.score >= 70 ? 'score-high' : match.score >= 40 ? 'score-medium' : 'score-low';

                return (
                  <div key={match.scheme_id} className="glass-card" style={{ padding: '1.5rem', borderLeft: match.eligible ? '4px solid var(--accent)' : '4px solid var(--danger)' }}>
                    
                    {/* Top Row: Title, Badges & Match Gauge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span className="glass-pill" style={{ background: match.eligible ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: match.eligible ? 'var(--accent)' : 'var(--danger)', borderColor: match.eligible ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
                            {match.eligible ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {match.eligible ? 'HARD ELIGIBLE' : 'INELIGIBLE'}
                          </span>
                          <span className="glass-pill" style={{ color: 'var(--accent-cyan)' }}>
                            {match.code}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                            Target: {match.details.beneficiary_category}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: '4px 0' }}>
                          {match.name}
                        </h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          {match.details.provider}
                        </p>
                      </div>

                      {/* Score Circle Gauge */}
                      <div style={{ textAlign: 'center' }}>
                        <div className={`score-badge ${scoreClass}`}>
                          {match.score}%
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: '2px', display: 'block' }}>Match Score</span>
                      </div>
                    </div>

                    {/* Financial Metrics Strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '12px', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Max Loan Cap</span>
                        <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#FFF' }}>
                          {match.details.max_loan_amount ? `₹${match.details.max_loan_amount.toLocaleString('en-IN')}` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Interest Rate</span>
                        <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--accent)' }}>
                          {match.details.beneficiary_interest_rate ? `${match.details.beneficiary_interest_rate}% p.a.` : 'Varies / Subsidy'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Repayment Tenure</span>
                        <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#FFF' }}>
                          {match.details.repayment_years ? `${match.details.repayment_years} Years` : 'Flexible'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', display: 'block' }}>Moratorium</span>
                        <span style={{ fontSize: '0.925rem', fontWeight: 700, color: '#FFF' }}>
                          {match.details.moratorium_months ? `${match.details.moratorium_months} Months` : 'None'}
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => setExpandedSchemeId(isExpanded ? null : match.scheme_id)}
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <Shield size={14} color="var(--primary)" />
                        <span>{isExpanded ? 'Hide Rule Breakdown' : 'Explainability Breakdown'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => setSelectedSchemeForDocs(match)}
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          <FileText size={14} color="var(--accent)" />
                          <span>View Doc Checklist</span>
                        </button>

                        <button
                          className="btn-primary"
                          onClick={() => onAskAI(`What are the specific eligibility requirements, interest rates, and application steps for ${match.name} (${match.code})?`)}
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          <Sparkles size={14} />
                          <span>Ask AI Assistant</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Explainability Details */}
                    {isExpanded && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="animate-fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1rem' }}>
                          
                          {/* Passed Criteria */}
                          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '10px' }}>
                            <h5 style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle2 size={14} /> Criteria Passed ({match.reasons.length})
                            </h5>
                            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {match.reasons.map((r, idx) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>{r}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Failed Criteria */}
                          <div style={{ background: match.failed_rules.length > 0 ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)', border: match.failed_rules.length > 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '10px' }}>
                            <h5 style={{ fontSize: '0.85rem', color: match.failed_rules.length > 0 ? 'var(--danger)' : 'var(--text-subtle)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <XCircle size={14} /> Failed Eligibility Rules ({match.failed_rules.length})
                            </h5>
                            {match.failed_rules.length === 0 ? (
                              <p style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>✨ Zero failed rules! All hard eligibility criteria satisfied.</p>
                            ) : (
                              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--danger)' }}>
                                {match.failed_rules.map((fr, idx) => (
                                  <li key={idx} style={{ marginBottom: '4px' }}>{fr}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        {/* Channel Partners & Documents */}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <strong style={{ color: '#FFF' }}>🏛️ Channelizing Partners:</strong>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                              {(match.details.channel_partners || []).map((cp, idx) => (
                                <span key={idx} className="glass-pill" style={{ fontSize: '0.72rem' }}>{cp}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <strong style={{ color: '#FFF' }}>📜 Mandatory Documents:</strong>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                              {(match.details.required_documents || []).map((doc, idx) => (
                                <span key={idx} className="glass-pill" style={{ fontSize: '0.72rem', borderColor: 'rgba(99,102,241,0.3)' }}>{doc}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
