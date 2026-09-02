import React from 'react';
import { Target, Bot, BookOpen, FileCheck, BarChart3, Settings, Globe, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentLang, setCurrentLang }) {
  const navItems = [
    { id: 'matcher', label: 'Scheme Matcher', icon: Target },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Qwen 2.5' },
    { id: 'explorer', label: 'Scheme Directory', icon: BookOpen },
    { id: 'checklist', label: 'Doc Checklist', icon: FileCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Portal', icon: Settings },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
  ];

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, sticky: 'top', zIndex: 100, position: 'sticky', top: 0 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('matcher')}>
          <div style={{ background: 'var(--gradient-hero)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="#FFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#FFF' }}>UdyamMarg</h1>
              <span className="glass-pill" style={{ fontSize: '0.7rem', color: 'var(--primary)', borderColor: 'rgba(99,102,241,0.3)', padding: '2px 8px' }}>SIH26092</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>AI-Driven Scheme Intelligence for Marginalized Entrepreneurs</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#FFF' : 'var(--text-muted)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: '0.65rem', background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.2)', color: isActive ? '#FFF' : 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '6px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Live Ollama Status Indicator */}
          <div className="glass-pill" title="Ollama Qwen2.5-Coder:3B AI Engine Active">
            <div className="pulse-dot"></div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>Ollama 3B Active</span>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 8px' }}>
            <Globe size={14} color="var(--text-muted)" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '0.8rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ background: '#1E293B', color: '#FFF' }}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
