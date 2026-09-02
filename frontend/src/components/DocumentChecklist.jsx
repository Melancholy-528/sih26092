import React, { useState } from 'react';
import { FileCheck, CheckSquare, Square, Download, Printer, ShieldCheck, HelpCircle } from 'lucide-react';

export default function DocumentChecklist({ selectedScheme }) {
  const schemeName = selectedScheme ? selectedScheme.name : 'NSFDC Term Loan & Central Schemes';
  const schemeCode = selectedScheme ? selectedScheme.code : 'NSFDC-TL';
  const docsList = selectedScheme?.details?.required_documents || [
    'Caste Certificate (SC/ST/OBC non-creamy layer / Minority proof)',
    'Family Income Certificate issued by competent Revenue Authority (<= ₹5 Lakh)',
    'Aadhaar Card & PAN Card (KYC Identity & Address Proof)',
    'Detailed Project Report (DPR) / Machinery Price Quotation',
    'Bank Account Passbook (6-month statement with IFSC code)',
    'Rent / Lease Agreement or Land Ownership Proof for Business Unit',
    'EDP (Entrepreneurship Development Programme) Training Certificate (if applicable)',
    '2 Passport-size Recent Photographs',
  ];

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / docsList.length) * 100);

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div className="glass-card" style={{ padding: '2rem', maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '10px', borderRadius: '12px' }}>
              <FileCheck size={24} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFF' }}>Application Document Roadmap</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Scheme: <strong style={{ color: 'var(--accent-cyan)' }}>{schemeName} ({schemeCode})</strong></p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              onClick={() => window.print()}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Printer size={14} />
              <span>Print Roadmap</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem', background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: '#FFF' }}>Verification Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{completedCount} of {docsList.length} Completed ({progressPercent}%)</span>
          </div>

          <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-cyan) 100%)',
                transition: 'width 0.4s ease',
              }}
            ></div>
          </div>
        </div>

        {/* Checklist List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
          {docsList.map((doc, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                style={{
                  background: isChecked ? 'rgba(16,185,129,0.08)' : 'rgba(30,41,59,0.5)',
                  border: isChecked ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {isChecked ? (
                  <CheckSquare size={22} color="var(--accent)" />
                ) : (
                  <Square size={22} color="var(--text-subtle)" />
                )}
                <span style={{ fontSize: '0.925rem', color: isChecked ? '#FFF' : 'var(--text-muted)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                  {doc}
                </span>
              </div>
            );
          })}
        </div>

        {/* Actionable Instructions */}
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '1.25rem', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '0.925rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> How to Submit Application to Channelizing Partner
          </h4>
          <ol style={{ paddingLeft: '1.2rem', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <li>Gather original and self-attested photocopies of all checked documents above.</li>
            <li>Visit your nearest <strong>State Channelizing Agency (SCA) office</strong>, District Industries Centre (DIC), or designated public sector bank branch.</li>
            <li>Submit the application form along with the Detailed Project Report (DPR).</li>
            <li>Upon verification, loan sanction and subsidy disburser will credit funds directly to your bank account.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
