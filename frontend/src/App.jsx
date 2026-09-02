import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import SchemeMatcher from './components/SchemeMatcher';
import AssistantChat from './components/AssistantChat';
import SchemeExplorer from './components/SchemeExplorer';
import DocumentChecklist from './components/DocumentChecklist';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AdminPortal from './components/AdminPortal';
import { Heart, Sparkles, Code2, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('matcher');
  const [currentLang, setCurrentLang] = useState('en');
  const [analytics, setAnalytics] = useState(null);
  const [assistantPrompt, setAssistantPrompt] = useState(null);
  const [selectedSchemeForDocs, setSelectedSchemeForDocs] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/schemes/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn("Analytics endpoint offline or unreachable.");
    }
  };

  const handleAskAI = (promptText) => {
    setAssistantPrompt(promptText);
    setActiveTab('assistant');
  };

  const handleSelectSchemeForDocs = (schemeMatch) => {
    setSelectedSchemeForDocs(schemeMatch);
    setActiveTab('checklist');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        
        {/* Show Hero Banner on Matcher page */}
        {activeTab === 'matcher' && (
          <HeroBanner setActiveTab={setActiveTab} analytics={analytics} />
        )}

        {/* Tab Views */}
        {activeTab === 'matcher' && (
          <SchemeMatcher
            onAskAI={handleAskAI}
            setSelectedSchemeForDocs={handleSelectSchemeForDocs}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantChat
            initialPrompt={assistantPrompt}
            clearInitialPrompt={() => setAssistantPrompt(null)}
          />
        )}

        {activeTab === 'explorer' && (
          <SchemeExplorer
            onAskAI={handleAskAI}
            setSelectedSchemeForDocs={handleSelectSchemeForDocs}
          />
        )}

        {activeTab === 'checklist' && (
          <DocumentChecklist selectedScheme={selectedSchemeForDocs} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analytics={analytics} />
        )}

        {activeTab === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* Modern Footer */}
      <footer style={{ background: '#090D16', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={16} color="var(--primary)" />
              <strong style={{ color: '#FFF' }}>SIH26092 — UdyamMarg Scheme Matcher</strong>
            </div>
            <p style={{ margin: 0 }}>AI-Driven Concessional Credit & Scheme Assistance for Marginalized Entrepreneurs.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="glass-pill" style={{ color: 'var(--accent)' }}>
              <Bot size={14} /> Ollama Qwen 2.5 Coder 3B
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
              Built for Smart India Hackathon
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
