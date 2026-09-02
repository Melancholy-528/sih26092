import React, { useState } from 'react';
import { Settings, PlusCircle, CheckCircle2, AlertCircle, RefreshCw, Database } from 'lucide-react';

export default function AdminPortal() {
  const [formData, setFormData] = useState({
    code: 'NSFDC-NEW-SCHEME',
    name: 'Special Green Enterprise Scheme for SC Artisans',
    provider: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
    description: 'Concessional credit support for setting up eco-friendly handicraft and solar manufacturing units.',
    beneficiary_category: 'SC',
    min_project_cost: 50000,
    max_project_cost: 2000000,
    max_loan_amount: 1800000,
    beneficiary_interest_rate: 5.5,
    repayment_years: 6,
    moratorium_months: 6,
    channel_partners: 'State Channelizing Agencies (SCAs), Public Sector Banks',
    purposes: 'handicrafts, green business, solar equipment, micro enterprise',
    required_documents: 'Caste Certificate (SC), Income Proof, Detailed Project Report, KYC',
    source_url: 'https://nsfdc.nic.in/schemes',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    const payload = {
      ...formData,
      min_project_cost: formData.min_project_cost ? parseFloat(formData.min_project_cost) : null,
      max_project_cost: formData.max_project_cost ? parseFloat(formData.max_project_cost) : null,
      max_loan_amount: formData.max_loan_amount ? parseFloat(formData.max_loan_amount) : null,
      beneficiary_interest_rate: formData.beneficiary_interest_rate ? parseFloat(formData.beneficiary_interest_rate) : null,
      repayment_years: formData.repayment_years ? parseInt(formData.repayment_years) : null,
      moratorium_months: formData.moratorium_months ? parseInt(formData.moratorium_months) : null,
      channel_partners: formData.channel_partners.split(',').map((x) => x.strip ? x.strip() : x.trim()),
      purposes: formData.purposes.split(',').map((x) => x.strip ? x.strip() : x.trim()),
      required_documents: formData.required_documents.split(',').map((x) => x.strip ? x.strip() : x.trim()),
      eligibility_rules: ['SC community', 'Annual income <= 5L', 'Project cost <= 20L'],
    };

    try {
      const res = await fetch('http://localhost:8000/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to create scheme in backend database.');
      }

      const data = await res.json();
      setStatusMsg({ type: 'success', text: `Scheme "${data.name}" successfully added to SQLite database and vector search re-indexed!` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Error communicating with server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReindex = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai/index', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStatusMsg({ type: 'success', text: `Vector Index Rebuilt! Total documents indexed: ${data.documents_indexed}` });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Error triggering vector index rebuild.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(99,102,241,0.15)', padding: '10px', borderRadius: '12px' }}>
              <Settings size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFF' }}>Admin Scheme Management Portal</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add new government schemes and trigger live vector re-indexing</p>
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={handleReindex}
            disabled={loading}
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <RefreshCw size={14} />
            <span>Rebuild Vector Index</span>
          </button>
        </div>

        {statusMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              background: statusMsg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: statusMsg.type === 'success' ? '1px solid var(--accent)' : '1px solid var(--danger)',
              color: statusMsg.type === 'success' ? 'var(--accent)' : 'var(--danger)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px' }}>
            <div>
              <label className="input-label">Scheme Code</label>
              <input
                type="text"
                className="input-field"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="input-label">Scheme Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '12px' }}>
            <div>
              <label className="input-label">Implementing Authority / Provider</label>
              <input
                type="text"
                className="input-field"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="input-label">Target Beneficiary Category</label>
              <select
                className="input-field"
                value={formData.beneficiary_category}
                onChange={(e) => setFormData({ ...formData, beneficiary_category: e.target.value })}
                style={{ background: '#1E293B' }}
              >
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="Minority">Minority</option>
                <option value="General">General / Open</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Scheme Description</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div>
              <label className="input-label">Max Cost (₹)</label>
              <input
                type="number"
                className="input-field"
                value={formData.max_project_cost}
                onChange={(e) => setFormData({ ...formData, max_project_cost: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label">Max Loan (₹)</label>
              <input
                type="number"
                className="input-field"
                value={formData.max_loan_amount}
                onChange={(e) => setFormData({ ...formData, max_loan_amount: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={formData.beneficiary_interest_rate}
                onChange={(e) => setFormData({ ...formData, beneficiary_interest_rate: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label">Tenure (Years)</label>
              <input
                type="number"
                className="input-field"
                value={formData.repayment_years}
                onChange={(e) => setFormData({ ...formData, repayment_years: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Channel Partners (Comma-separated)</label>
            <input
              type="text"
              className="input-field"
              value={formData.channel_partners}
              onChange={(e) => setFormData({ ...formData, channel_partners: e.target.value })}
            />
          </div>

          <div>
            <label className="input-label">Target Business Purposes / Sectors (Comma-separated)</label>
            <input
              type="text"
              className="input-field"
              value={formData.purposes}
              onChange={(e) => setFormData({ ...formData, purposes: e.target.value })}
            />
          </div>

          <div>
            <label className="input-label">Required Documents Checklist (Comma-separated)</label>
            <input
              type="text"
              className="input-field"
              value={formData.required_documents}
              onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
            />
          </div>

          <div>
            <label className="input-label">Source Documentation URL</label>
            <input
              type="url"
              className="input-field"
              value={formData.source_url}
              onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '12px', padding: '14px' }}>
            <PlusCircle size={18} />
            <span>Add Scheme to Database & Auto-Reindex AI</span>
          </button>
        </form>

      </div>
    </div>
  );
}
