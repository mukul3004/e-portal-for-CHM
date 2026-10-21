import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Scale, 
  Gavel, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Plus, 
  RefreshCw, 
  QrCode, 
  Check, 
  X,
  Search,
  Copy,
  History,
  FileCheck,
  Eye,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building,
  User,
  ShieldAlert
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [backendOnline, setBackendOnline] = useState(false);
  const [currentRole, setCurrentRole] = useState('ADVOCATE_PLAINTIFF'); // JUDGE, ADVOCATE_PLAINTIFF, ADVOCATE_DEFENDANT, CLERK
  
  // Data State
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [loadingMatrix, setLoadingMatrix] = useState(false);

  // Universal Case Search & Dossier State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [dossierError, setDossierError] = useState(null);
  const [dossierSubTab, setDossierSubTab] = useState('all');
  const [copiedCnr, setCopiedCnr] = useState(false);
  
  // New Case Form State
  const [newTitle, setNewTitle] = useState('');
  const [newValuation, setNewValuation] = useState('4500000');
  const [newHall, setNewHall] = useState('HALL_04');
  
  // Scheduler State
  const [schedDate, setSchedDate] = useState('2026-10-15');
  const [schedStartTime, setSchedStartTime] = useState('11:30:00');
  const [schedEndTime, setSchedEndTime] = useState('11:50:00');
  const [schedHall, setSchedHall] = useState('HALL_04');
  const [clashResult, setClashResult] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [checkingClash, setCheckingClash] = useState(false);

  // Search cases by query (CNR, title, court hall)
  const handleSearchCases = async (q = searchQuery) => {
    if (!q || !q.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/cases/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching cases:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch Complete Case Dossier
  const loadCaseDossier = async (identifier) => {
    if (!identifier) return;
    setLoadingDossier(true);
    setDossierError(null);
    setActiveTab('search');
    try {
      const res = await fetch(`${API_BASE}/cases/dossier/${encodeURIComponent(identifier.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setDossier(data);
        const found = cases.find(c => c.id === data.id || c.cnr_number === data.cnr_number);
        if (found) {
          setActiveCase(found);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setDossierError(errData.detail || `Case record '${identifier}' was not found in the court system.`);
      }
    } catch (err) {
      console.error('Error loading dossier:', err);
      setDossierError('Unable to connect to registry server.');
    } finally {
      setLoadingDossier(false);
    }
  };

  // Copy CNR to clipboard
  const handleCopyCnr = (cnr) => {
    if (!cnr) return;
    navigator.clipboard.writeText(cnr);
    setCopiedCnr(true);
    setTimeout(() => setCopiedCnr(false), 2000);
  };

  // Check Backend Health & Fetch initial data
  const checkHealthAndLoad = async () => {
    try {
      const res = await fetch('http://localhost:8000/');
      if (res.ok) {
        setBackendOnline(true);
        loadCases();
      } else {
        setBackendOnline(false);
      }
    } catch (e) {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkHealthAndLoad();
    const interval = setInterval(checkHealthAndLoad, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Cases from API
  const loadCases = async () => {
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'adv.mukul@barcouncil.org', password: 'Advocate@2026' })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      const res = await fetch(`${API_BASE}/cases/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCases(data);
        if (data.length > 0 && !activeCase) {
          setActiveCase(data[0]);
          loadMatrix(data[0].id, token);
          loadCaseDossier(data[0].cnr_number);
        }
      }
    } catch (err) {
      console.error('Error loading cases:', err);
    }
  };

  // Fetch Admissions Matrix for active case
  const loadMatrix = async (caseId, passedToken = null) => {
    setLoadingMatrix(true);
    try {
      let token = passedToken;
      if (!token) {
        const authRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'adv.mukul@barcouncil.org', password: 'Advocate@2026' })
        });
        const authData = await authRes.json();
        token = authData.access_token;
      }

      const res = await fetch(`${API_BASE}/admissions/${caseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMatrix(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMatrix(false);
    }
  };

  // Submit Stance (Admit or Deny)
  const handleStanceChange = async (itemId, stance) => {
    try {
      const email = currentRole === 'ADVOCATE_DEFENDANT' 
        ? 'adv.verma@barcouncil.org' 
        : (currentRole === 'JUDGE' ? 'judge.sharma@svvv-courts.gov.in' : 'adv.mukul@barcouncil.org');
      const password = currentRole === 'JUDGE' ? 'Judge@2026' : 'Advocate@2026';

      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      let denialReason = null;
      if (stance === 'DENY') {
        denialReason = prompt('Order XV-A Rule 3 Requirement: Please enter statutory justification for denial:') || 'Execution disputed; formal proof of execution demanded.';
      }

      const res = await fetch(`${API_BASE}/admissions/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: itemId,
          stance: stance,
          statutory_denial_reason: denialReason
        })
      });

      if (res.ok) {
        if (activeCase) {
          loadMatrix(activeCase.id, token);
        }
      }
    } catch (e) {
      console.error('Error submitting stance:', e);
    }
  };

  // Judge Locks Matrix
  const handleLockMatrix = async () => {
    if (!activeCase) return;
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'judge.sharma@svvv-courts.gov.in', password: 'Judge@2026' })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      const res = await fetch(`${API_BASE}/admissions/${activeCase.id}/lock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadMatrix(activeCase.id, token);
        alert('Order XV-A Fact Matrix locked successfully! Undisputed facts are permanently frozen.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // File New Case
  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'adv.mukul@barcouncil.org', password: 'Advocate@2026' })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      const res = await fetch(`${API_BASE}/cases/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          case_title: newTitle,
          case_type: 'COMMERCIAL_DISPUTE',
          claim_valuation: parseFloat(newValuation),
          court_hall_id: newHall,
          defendant_counsel_email: 'adv.verma@barcouncil.org'
        })
      });

      if (res.ok) {
        const newCaseObj = await res.json();
        setNewTitle('');
        alert(`Case registered successfully! CNR Number: ${newCaseObj.cnr_number}`);
        loadCases();
        setActiveCase(newCaseObj);
        setActiveTab('matrix');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run Clash Detection
  const handleCheckClash = async () => {
    setCheckingClash(true);
    setClashResult(null);
    setBookingSuccess(null);
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'clerk.indore@svvv-courts.gov.in', password: 'Clerk@2026' })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      const res = await fetch(`${API_BASE}/schedule/check-clash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          advocate_bar_ids: ['MP/14297/2026', 'MP/11054/2026'],
          hearing_date: schedDate,
          start_time: schedStartTime,
          end_time: schedEndTime,
          court_hall_id: schedHall
        })
      });

      if (res.ok) {
        const data = await res.json();
        setClashResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingClash(false);
    }
  };

  // Book Hearing Slot
  const handleBookSlot = async () => {
    if (!activeCase) return;
    try {
      const authRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'clerk.indore@svvv-courts.gov.in', password: 'Clerk@2026' })
      });
      const authData = await authRes.json();
      const token = authData.access_token;

      const res = await fetch(`${API_BASE}/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          case_id: activeCase.id,
          court_hall_id: schedHall,
          hearing_date: schedDate,
          start_time: schedStartTime,
          end_time: schedEndTime
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBookingSuccess(data);
        alert(`Slot Confirmed! WebRTC Room ID: ${data.webrtc_room_id}`);
      } else {
        const err = await res.json();
        alert(`Booking Failed: ${err.detail}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* 1. Court Masthead */}
      <header className="court-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#d97706', padding: '0.6rem', borderRadius: '10px', color: '#0f172a' }}>
              <Scale size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 className="serif-court" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.02em' }}>
                  Commercial Court of Madhya Pradesh (Indore Bench)
                </h1>
                <span className="court-badge">Order XV-A CPC Portal</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                e-Portal for Pre-Trial Case Management Hearing & Fact Narrowing • SVVV Major Project (MP-14)
              </p>
            </div>
          </div>

          {/* Health Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              background: backendOnline ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)',
              border: `1px solid ${backendOnline ? '#059669' : '#dc2626'}`,
              color: backendOnline ? '#34d399' : '#f87171',
              padding: '0.35rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: backendOnline ? '#10b981' : '#ef4444' 
              }}></span>
              {backendOnline ? 'FastAPI 0.110 Online (:8000)' : 'Backend Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Interactive Role Switcher */}
      <div className="role-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simulate Persona:
          </span>
          <button 
            className={`role-pill ${currentRole === 'JUDGE' ? 'active' : ''}`}
            onClick={() => setCurrentRole('JUDGE')}
          >
            <Gavel size={16} />
            <span>Hon'ble Judge (Rajesh Sharma)</span>
          </button>
          <button 
            className={`role-pill ${currentRole === 'ADVOCATE_PLAINTIFF' ? 'active' : ''}`}
            onClick={() => setCurrentRole('ADVOCATE_PLAINTIFF')}
          >
            <UserCheck size={16} />
            <span>Advocate Mukul (Plaintiff)</span>
          </button>
          <button 
            className={`role-pill ${currentRole === 'ADVOCATE_DEFENDANT' ? 'active' : ''}`}
            onClick={() => setCurrentRole('ADVOCATE_DEFENDANT')}
          >
            <UserCheck size={16} />
            <span>Adv. Priya Verma (Defendant)</span>
          </button>
          <button 
            className={`role-pill ${currentRole === 'CLERK' ? 'active' : ''}`}
            onClick={() => setCurrentRole('CLERK')}
          >
            <ShieldCheck size={16} />
            <span>Registry Clerk (Hall 4)</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Global Quick Search Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                loadCaseDossier(searchQuery.trim());
              }
            }}
            style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', padding: '0.3rem 0.65rem', border: '1px solid #cbd5e1' }}
          >
            <Search size={15} color="#64748b" style={{ marginRight: '0.4rem' }} />
            <input 
              type="text" 
              placeholder="Search CNR or Case..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem', width: '160px', color: '#0f172a' }}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
              >
                <X size={13} />
              </button>
            )}
          </form>

          {activeCase && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b' }}>Active Case:</span>
              <button 
                onClick={() => loadCaseDossier(activeCase.cnr_number)}
                title="Click to view full dossier"
                className="mono" 
                style={{ fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
              >
                {activeCase.cnr_number}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Container */}
      <div className="main-wrapper">
        
        {/* Navigation Tabs */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('search');
              if (!dossier && activeCase) {
                loadCaseDossier(activeCase.cnr_number);
              }
            }}
          >
            <Search size={18} />
            Universal Case Search & Complete Dossier
          </button>
          <button 
            className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <FileText size={18} />
            Admissions & Denials Matrix (Order XV-A)
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('cases')}
          >
            <Scale size={18} />
            Case Dockets & e-Filing
          </button>
          <button 
            className={`tab-btn ${activeTab === 'scheduler' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduler')}
          >
            <Calendar size={18} />
            Smart Clash-Free Scheduler
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cmo' ? 'active' : ''}`}
            onClick={() => setActiveTab('cmo')}
          >
            <Gavel size={18} />
            Case Management Order (CMO)
          </button>
        </div>

        {/* TAB 0: UNIVERSAL CASE SEARCH & COMPLETE DOSSIER */}
        {activeTab === 'search' && (
          <div>
            {/* Search Hero Component */}
            <div className="search-hero">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Sparkles size={13} />
                    Official e-Courts Case Dossier Lookup
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
                    Search Case Number & Full Judicial History
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', maxWidth: '750px' }}>
                    Retrieve complete real-time docket details, presiding bench, counsel assignments, chronological lifecycle milestones, past/scheduled hearings, pleadings with cryptographic SHA-256 seals, Order XV-A admissions, and signed Case Management Orders.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      if (activeCase) loadCaseDossier(activeCase.cnr_number);
                    }}
                    className="quick-search-chip"
                    style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <RefreshCw size={13} />
                    Refresh Record
                  </button>
                </div>
              </div>

              {/* Search Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    loadCaseDossier(searchQuery.trim());
                    handleSearchCases(searchQuery.trim());
                  }
                }}
                className="search-input-group"
              >
                <div className="search-input-box">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Enter 16-digit CNR (e.g. MPIN01791316742026), Case Title, or Party Name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim().length >= 2) {
                        handleSearchCases(e.target.value.trim());
                      } else {
                        setSearchResults([]);
                      }
                    }}
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                      style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button type="submit" className="search-action-btn">
                  <Search size={16} />
                  Search Dossier
                </button>
              </form>

              {/* Quick Case Selection Chips */}
              <div className="quick-search-chips">
                <span style={{ fontWeight: 600, color: '#cbd5e1' }}>Quick Selection:</span>
                {cases.map((c) => (
                  <button 
                    key={c.id} 
                    type="button"
                    onClick={() => {
                      setSearchQuery(c.cnr_number);
                      loadCaseDossier(c.cnr_number);
                    }}
                    className="quick-search-chip"
                    style={{
                      borderColor: dossier?.cnr_number === c.cnr_number ? '#38bdf8' : 'rgba(255,255,255,0.15)',
                      background: dossier?.cnr_number === c.cnr_number ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.cnr_number}</span> - {c.case_title.split(' vs.')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Autocomplete / Matching Results Grid */}
            {searchResults.length > 0 && (
              <div className="court-card" style={{ marginBottom: '1.5rem', background: '#f8fafc', borderColor: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Matching Judicial Records Found ({searchResults.length}):
                  </span>
                  <button 
                    onClick={() => setSearchResults([])} 
                    style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.75rem' }}>
                  {searchResults.map((res) => (
                    <div 
                      key={res.id}
                      onClick={() => {
                        loadCaseDossier(res.cnr_number);
                        setSearchResults([]);
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>
                          {res.cnr_number}
                        </span>
                        <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                          {res.status}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                        {res.case_title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem' }}>
                        <span>Valuation: ₹ {parseFloat(res.claim_valuation).toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>Hall: {res.court_hall_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loadingDossier && (
              <div className="court-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <RefreshCw size={32} color="#2563eb" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Compiling Judicial Case Dossier...
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Querying e-Courts ledger for hearings, cryptographic pleadings, admissions, and sealed CMO records.
                </p>
              </div>
            )}

            {/* Error Message */}
            {dossierError && !loadingDossier && (
              <div className="court-card" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertTriangle size={24} color="#dc2626" />
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 700 }}>Record Not Found</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{dossierError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* COMPLETE DOSSIER DISPLAY */}
            {dossier && !loadingDossier && (
              <div>
                {/* 1. Case Masthead Header */}
                <div className="dossier-masthead">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                        <div className="dossier-cnr-badge">
                          <span>CNR: {dossier.cnr_number}</span>
                          <button 
                            onClick={() => handleCopyCnr(dossier.cnr_number)} 
                            className="copy-btn" 
                            title="Copy 16-Digit CNR"
                          >
                            {copiedCnr ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                          </button>
                        </div>
                        {copiedCnr && (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Copied to clipboard!</span>
                        )}

                        <span className="badge" style={{
                          background: dossier.status === 'CMO_ISSUED_TRIAL_ACTIVE' ? '#ecfdf5' : '#eff6ff',
                          color: dossier.status === 'CMO_ISSUED_TRIAL_ACTIVE' ? '#065f46' : '#1d4ed8',
                          borderColor: dossier.status === 'CMO_ISSUED_TRIAL_ACTIVE' ? '#a7f3d0' : '#bfdbfe',
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}>
                          <CheckCircle2 size={12} />
                          {dossier.status.replace(/_/g, ' ')}
                        </span>

                        <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>
                          <Scale size={12} />
                          {dossier.case_type.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                        {dossier.case_title}
                      </h1>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={15} color="#94a3b8" />
                          Filing Date: <strong style={{ color: '#1e293b' }}>{new Date(dossier.filing_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Building size={15} color="#94a3b8" />
                          Assigned Hall: <strong style={{ color: '#1e293b' }}>{dossier.court_hall_id || 'Indore Court Hall 04'}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Claim Valuation: <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>₹ {parseFloat(dossier.claim_valuation).toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Header Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => window.print()}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Download size={14} />
                        Print Dossier
                      </button>

                      <button 
                        onClick={() => {
                          setActiveCase(dossier);
                          loadMatrix(dossier.id);
                          setActiveTab('matrix');
                        }}
                        style={{
                          background: '#0f172a',
                          border: 'none',
                          color: 'white',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <FileText size={14} />
                        Open Admissions Matrix
                      </button>
                    </div>
                  </div>

                  {/* 2. Stakeholders & Bench Row */}
                  <div className="stakeholders-row">
                    {/* Judge */}
                    <div className="stakeholder-card">
                      <div className="stakeholder-header">
                        <div className="stakeholder-avatar" style={{ background: '#fef3c7', color: '#b45309' }}>
                          <Gavel size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.05em' }}>
                            Presiding Judicial Officer
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                            {dossier.judge?.full_name || "Hon'ble Justice Rajesh Sharma"}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>Bench: <strong style={{ color: '#334155' }}>{dossier.judge?.bench_id || "BENCH_INDORE_COMM_01"}</strong></div>
                        <div>Email: <span className="mono">{dossier.judge?.email || "judge.sharma@svvv-courts.gov.in"}</span></div>
                        <div>Court: Indore Commercial Bench, Hall 4</div>
                      </div>
                    </div>

                    {/* Plaintiff Counsel */}
                    <div className="stakeholder-card">
                      <div className="stakeholder-header">
                        <div className="stakeholder-avatar" style={{ background: '#eff6ff', color: '#2563eb' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', letterSpacing: '0.05em' }}>
                            Plaintiff Legal Counsel
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                            {dossier.plaintiff_counsel?.full_name || "Adv. Mukul Bhamgare"}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>Bar Registration: <strong style={{ color: '#334155' }}>{dossier.plaintiff_counsel?.bar_council_id || "MP/14297/2026"}</strong></div>
                        <div>Email: <span className="mono">{dossier.plaintiff_counsel?.email || "adv.mukul@barcouncil.org"}</span></div>
                        <div>Client: Apex Infotech Ltd.</div>
                      </div>
                    </div>

                    {/* Defendant Counsel */}
                    <div className="stakeholder-card">
                      <div className="stakeholder-header">
                        <div className="stakeholder-avatar" style={{ background: '#fdf2f8', color: '#db2777' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#db2777', letterSpacing: '0.05em' }}>
                            Defendant Legal Counsel
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                            {dossier.defendant_counsel?.full_name || "Adv. Priya Verma"}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>Bar Registration: <strong style={{ color: '#334155' }}>{dossier.defendant_counsel?.bar_council_id || "MP/11054/2026"}</strong></div>
                        <div>Email: <span className="mono">{dossier.defendant_counsel?.email || "adv.verma@barcouncil.org"}</span></div>
                        <div>Client: Horizon Logistics Pvt. Ltd.</div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Dossier Sub-Navigation Pills */}
                  <div className="dossier-subnav">
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'all' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('all')}
                    >
                      <Sparkles size={14} />
                      Complete Dossier (All Sections)
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'timeline' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('timeline')}
                    >
                      <History size={14} />
                      Chronological Timeline ({dossier.timeline?.length || 0})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'hearings' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('hearings')}
                    >
                      <Calendar size={14} />
                      Hearings & Proceedings ({dossier.hearings?.length || 0})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'pleadings' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('pleadings')}
                    >
                      <FileCheck size={14} />
                      Pleadings & Exhibits ({dossier.pleadings?.length || 0})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'matrix' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('matrix')}
                    >
                      <FileText size={14} />
                      Order XV-A Matrix ({dossier.checklist?.items?.length || 0} Averments)
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'cmo' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('cmo')}
                    >
                      <Gavel size={14} />
                      Case Management Order (CMO)
                    </button>
                  </div>
                </div>

                {/* SECTION A: CHRONOLOGICAL LIFECYCLE TIMELINE */}
                {(dossierSubTab === 'all' || dossierSubTab === 'timeline') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                        <History size={18} color="#2563eb" />
                        Comprehensive Case Journey & Milestone History
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Real-time audit log under High Court e-Governance Framework
                      </span>
                    </div>

                    <div className="timeline-track">
                      {dossier.timeline && dossier.timeline.map((step, idx) => (
                        <div key={idx} className="timeline-node">
                          <div className={`timeline-bullet ${step.status === 'COMPLETED' ? 'completed' : (step.status === 'ACTIVE' ? 'active' : 'pending')}`} />
                          <div className="timeline-content-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                  {step.date}
                                </span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  [{step.stage}]
                                </span>
                              </div>
                              <span className={`badge ${step.status === 'COMPLETED' ? 'badge-undisputed' : (step.status === 'ACTIVE' ? 'badge-contested' : 'badge-pending')}`}>
                                {step.status}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                              {step.title}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION B: HEARINGS & COURTROOM PROCEEDINGS */}
                {(dossierSubTab === 'all' || dossierSubTab === 'hearings') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                          <Calendar size={18} color="#2563eb" />
                          Past & Scheduled Courtroom Hearings (CMH Sessions)
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                          Clash-free hearing calendar with WebRTC secure virtual courtroom integration.
                        </p>
                      </div>
                      <span className="badge badge-pending">
                        Total Sessions: {dossier.hearings?.length || 0}
                      </span>
                    </div>

                    {dossier.hearings && dossier.hearings.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                        {dossier.hearings.map((h, i) => (
                          <div key={h.id || i} style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            borderLeft: h.status === 'CONCLUDED' ? '4px solid #059669' : '4px solid #2563eb',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                                Hearing #{i + 1} • {h.hearing_date}
                              </span>
                              <span className={`badge ${h.status === 'CONCLUDED' ? 'badge-undisputed' : 'badge-pending'}`}>
                                {h.status}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Clock size={14} color="#64748b" />
                                <span>Time Slot: <strong>{h.start_time} - {h.end_time}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Building size={14} color="#64748b" />
                                <span>Court Hall: <strong>{h.court_hall_id}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Lock size={14} color="#64748b" />
                                <span>WebRTC Room: <code className="mono" style={{ background: '#f1f5f9', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>{h.webrtc_room_id}</code></span>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setActiveTab('scheduler');
                              }}
                              style={{
                                width: '100%',
                                background: h.status === 'CONCLUDED' ? '#f1f5f9' : '#2563eb',
                                color: h.status === 'CONCLUDED' ? '#475569' : '#ffffff',
                                border: '1px solid #cbd5e1',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem'
                              }}
                            >
                              <ExternalLink size={13} />
                              {h.status === 'CONCLUDED' ? 'View Concluded Proceedings' : 'Launch Virtual Courtroom'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>No hearings recorded yet. Use the Smart Clash-Free Scheduler to allot a session.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION C: PLEADINGS & EXHIBITS */}
                {(dossierSubTab === 'all' || dossierSubTab === 'pleadings') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                          <FileCheck size={18} color="#2563eb" />
                          Electronic Pleadings & Annexed Exhibits
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                          Tamper-evident legal discovery verified via SHA-256 digital seals.
                        </p>
                      </div>
                      <span className="badge badge-undisputed">
                        Scrutiny Verified
                      </span>
                    </div>

                    {dossier.pleadings && dossier.pleadings.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {dossier.pleadings.map((p, idx) => (
                          <div key={p.id || idx} style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '1.25rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                                  {p.pleading_type.replace(/_/g, ' ')}
                                </span>
                                <span className="badge badge-undisputed" style={{ fontSize: '0.7rem' }}>
                                  {p.is_scrutinized ? 'Scrutiny Passed' : 'Pending Scrutiny'}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Filed on: {new Date(p.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.65rem 0.85rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                <span>Cryptographic SHA-256 Hash: </span>
                                <code className="mono" style={{ color: '#0f172a', fontWeight: 600 }}>{p.sha256_checksum}</code>
                              </div>
                              <a 
                                href={p.file_storage_url} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                              >
                                <Eye size={13} />
                                View PDF Document
                              </a>
                            </div>

                            {/* Exhibits */}
                            {p.exhibits && p.exhibits.length > 0 && (
                              <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem' }}>
                                  Annexed Reliance Exhibits ({p.exhibits.length}):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  {p.exhibits.map((ex) => (
                                    <div key={ex.id} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: '#ffffff',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '6px',
                                      padding: '0.4rem 0.75rem',
                                      fontSize: '0.8rem'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="mono" style={{ fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                          {ex.exhibit_number}
                                        </span>
                                        <span style={{ fontWeight: 500, color: '#1e293b' }}>
                                          {ex.document_title}
                                        </span>
                                      </div>
                                      <span className="mono" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                        {ex.sha256_checksum.substring(0, 16)}...
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>No electronic pleadings filed yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION D: ORDER XV-A ADMISSIONS MATRIX */}
                {(dossierSubTab === 'all' || dossierSubTab === 'matrix') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                          <FileText size={18} color="#2563eb" />
                          Order XV-A Admissions & Denials Matrix
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                          Pre-trial statutory evaluation of factual averments to eliminate uncontested issues.
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Readiness Score</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
                            {dossier.checklist ? Math.round((dossier.checklist.readiness_score || 0) * 100) : 0}%
                          </div>
                        </div>
                        <span className={`badge ${dossier.checklist?.is_locked ? 'badge-undisputed' : 'badge-contested'}`}>
                          {dossier.checklist?.is_locked ? 'Matrix Locked' : 'Admissions Open'}
                        </span>
                      </div>
                    </div>

                    {dossier.checklist?.items && dossier.checklist.items.length > 0 ? (
                      <table className="court-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}>#</th>
                            <th>Factual Averment</th>
                            <th style={{ width: '130px' }}>Plaintiff Stance</th>
                            <th style={{ width: '130px' }}>Defendant Stance</th>
                            <th>Statutory Justification / Denial Note</th>
                            <th style={{ width: '140px' }}>Resolution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dossier.checklist.items.map((it) => (
                            <tr key={it.id}>
                              <td className="mono" style={{ fontWeight: 700, color: '#64748b' }}>
                                #{it.statement_index}
                              </td>
                              <td style={{ fontWeight: 500, color: '#0f172a' }}>
                                {it.factual_statement}
                              </td>
                              <td>
                                <span className={`badge ${it.plaintiff_stance?.includes('ADMIT') ? 'badge-undisputed' : (it.plaintiff_stance === 'DENY' ? 'badge-contested' : 'badge-pending')}`}>
                                  {it.plaintiff_stance}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${it.defendant_stance?.includes('ADMIT') ? 'badge-undisputed' : (it.defendant_stance === 'DENY' ? 'badge-contested' : 'badge-pending')}`}>
                                  {it.defendant_stance}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.8rem', color: it.statutory_denial_reason ? '#dc2626' : '#94a3b8' }}>
                                {it.statutory_denial_reason || '— None —'}
                              </td>
                              <td>
                                <span className={`badge ${it.resolution_status === 'UNDISPUTED_FACT' ? 'badge-undisputed' : (it.resolution_status === 'CONTESTED_ISSUE' ? 'badge-contested' : 'badge-pending')}`}>
                                  {it.resolution_status.replace(/_/g, ' ')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>No admissions checklist items found.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION E: CASE MANAGEMENT ORDER (CMO) */}
                {(dossierSubTab === 'all' || dossierSubTab === 'cmo') && (
                  <div className="court-card" style={{ border: '2px solid #0f172a', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                          Form 4 • Commercial Courts Act, 2015
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                          Case Management Order (CMO) Under Order XV-A Rule 5
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${dossier.cmo?.is_digitally_signed ? 'badge-undisputed' : 'badge-pending'}`}>
                          <ShieldCheck size={14} />
                          {dossier.cmo?.is_digitally_signed ? 'Digitally Signed & Sealed' : 'Draft / Awaiting Seal'}
                        </span>
                      </div>
                    </div>

                    {dossier.cmo ? (
                      <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.4rem' }}>
                            1. Certified Undisputed Factual Averments:
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {dossier.cmo.undisputed_facts_summary}
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.4rem' }}>
                            2. Framed Triable Issues For Trial:
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: '#334155', background: '#eff6ff', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '4px solid #2563eb' }}>
                            {(() => {
                              try {
                                const issues = JSON.parse(dossier.cmo.framed_issues_json);
                                if (Array.isArray(issues)) {
                                  return (
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                                      {issues.map((iss, idx) => (
                                        <li key={idx}><strong>{iss}</strong></li>
                                      ))}
                                    </ul>
                                  );
                                }
                              } catch (e) {}
                              return <div>{dossier.cmo.framed_issues_json}</div>;
                            })()}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Plaintiff Witness Quota</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                              Max {dossier.cmo.witness_quota_plaintiff} Witnesses
                            </div>
                          </div>

                          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Defendant Witness Quota</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                              Max {dossier.cmo.witness_quota_defendant} Witnesses
                            </div>
                          </div>
                        </div>

                        {/* Deadlines */}
                        {dossier.cmo.deadlines && dossier.cmo.deadlines.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.4rem' }}>
                              3. Binding Discovery & Trial Timetable:
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {dossier.cmo.deadlines.map((dl, idx) => (
                                <div key={dl.id || idx} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem'
                                }}>
                                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                                    • {dl.task_description}
                                  </span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className="mono" style={{ color: '#2563eb', fontWeight: 600 }}>
                                      Deadline: {dl.due_date}
                                    </span>
                                    <span className={`badge ${dl.status === 'COMPLETED' ? 'badge-undisputed' : 'badge-pending'}`}>
                                      {dl.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Official Seal Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #cbd5e1', paddingTop: '1.25rem', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <QrCode size={48} color="#0f172a" />
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>National Judicial Digital Seal</div>
                              <div>QR Verification: <span className="mono">{dossier.cmo.qr_verification_code || 'ECOURTS-CMO-IN-MP-IND'}</span></div>
                              <div>Digest: <span className="mono">{dossier.cmo.sha256_digest ? dossier.cmo.sha256_digest.substring(0, 20) + '...' : 'Verified'}</span></div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                              ({dossier.judge?.full_name || "Hon'ble Justice Rajesh Sharma"})
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Presiding Judicial Officer, Commercial Bench
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>
                          Case Management Order is pending issuance following conclusion of the virtual CMH session.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: ADMISSIONS & DENIALS MATRIX */}
        {activeTab === 'matrix' && (
          <div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Fact Checklist
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                    {matrix?.items?.length || 0} Averments
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Undisputed Facts
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                    {matrix?.items?.filter(i => i.resolution_status === 'UNDISPUTED_FACT').length || 0}
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Contested Issues (Trial)
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>
                    {matrix?.items?.filter(i => i.resolution_status === 'CONTESTED_ISSUE').length || 0}
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#f8fafc', color: '#0f172a' }}>
                  <Clock size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span>Pre-Trial Readiness</span>
                    <span style={{ color: '#2563eb' }}>{matrix?.readiness_score || 0}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${matrix?.readiness_score || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="court-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    Pre-Trial Fact Crystallization Workspace (Order XV-A Rule 2)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Both counsels mark evidentiary stances online. Mutual admissions lock permanently as undisputed facts.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {currentRole === 'JUDGE' && (
                    <button 
                      onClick={handleLockMatrix}
                      disabled={matrix?.is_locked}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: matrix?.is_locked ? '#94a3b8' : '#0f172a',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: matrix?.is_locked ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Lock size={16} />
                      {matrix?.is_locked ? 'Matrix Locked by Court' : 'Lock & Finalize Matrix'}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => activeCase && loadMatrix(activeCase.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                </div>
              </div>

              <table className="court-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Factual Averment & Reliance Exhibits</th>
                    <th style={{ width: '180px' }}>Plaintiff Stance</th>
                    <th style={{ width: '180px' }}>Defendant Stance</th>
                    <th style={{ width: '160px' }}>Evidentiary Status</th>
                    <th style={{ width: '180px' }}>Actions ({currentRole.replace('ADVOCATE_', '')})</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix?.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="mono" style={{ fontWeight: 600 }}>{item.statement_index}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.2rem' }}>
                          {item.factual_statement}
                        </div>
                        {item.statutory_denial_reason && (
                          <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontStyle: 'italic', background: '#fef2f2', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                            Denial Justification: {item.statutory_denial_reason}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${item.plaintiff_stance === 'DENY' ? 'badge-contested' : (item.plaintiff_stance === 'PENDING' ? 'badge-pending' : 'badge-undisputed')}`}>
                          {item.plaintiff_stance}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${item.defendant_stance === 'DENY' ? 'badge-contested' : (item.defendant_stance === 'PENDING' ? 'badge-pending' : 'badge-undisputed')}`}>
                          {item.defendant_stance}
                        </span>
                      </td>
                      <td>
                        {item.resolution_status === 'UNDISPUTED_FACT' && (
                          <span className="badge badge-undisputed">
                            <CheckCircle2 size={13} />
                            UNDISPUTED FACT
                          </span>
                        )}
                        {item.resolution_status === 'CONTESTED_ISSUE' && (
                          <span className="badge badge-contested">
                            <AlertTriangle size={13} />
                            CONTESTED ISSUE
                          </span>
                        )}
                        {item.resolution_status === 'PENDING' && (
                          <span className="badge badge-pending">
                            <Clock size={13} />
                            PENDING OVERLAP
                          </span>
                        )}
                      </td>
                      <td>
                        {!matrix?.is_locked ? (
                          <div className="stance-btn-group">
                            <button 
                              className="stance-btn"
                              title="Admit Contents"
                              onClick={() => handleStanceChange(item.id, 'ADMIT_CONTENTS')}
                            >
                              <Check size={14} style={{ color: '#059669', display: 'inline', marginRight: '2px' }} />
                              Admit
                            </button>
                            <button 
                              className="stance-btn"
                              title="Deny Allegation"
                              onClick={() => handleStanceChange(item.id, 'DENY')}
                            >
                              <X size={14} style={{ color: '#dc2626', display: 'inline', marginRight: '2px' }} />
                              Deny
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            Locked by Court
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CASE DOCKETS & E-FILING */}
        {activeTab === 'cases' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            <div className="court-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} color="#2563eb" />
                New Case e-Filing (CNR Intake)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Order XV-A statutory filing under Commercial Courts Act, 2015.
              </p>

              <form onSubmit={handleCreateCase}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Case Title / Parties
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., Bharat Telecom vs. Global Cloud Corp"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Claim Valuation (INR)
                  </label>
                  <input 
                    type="number" 
                    value={newValuation}
                    onChange={(e) => setNewValuation(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Court Hall Assignment
                  </label>
                  <select 
                    value={newHall}
                    onChange={(e) => setNewHall(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="HALL_04">Court Hall 4 (Commercial Bench)</option>
                    <option value="HALL_02">Court Hall 2 (Civil Recovery)</option>
                    <option value="HALL_01">Court Hall 1 (Chief Commercial Judge)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Generate 16-Digit CNR & File Case
                </button>
              </form>
            </div>

            <div className="court-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Active Commercial Court Dockets ({cases.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Select any case below to switch the active Admissions Matrix and scheduling view.
              </p>

              <table className="court-table">
                <thead>
                  <tr>
                    <th>CNR Number</th>
                    <th>Case Title</th>
                    <th>Valuation</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id} style={{ background: activeCase?.id === c.id ? '#f0fdf4' : 'transparent' }}>
                      <td className="mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                        {c.cnr_number}
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {c.case_title}
                      </td>
                      <td className="mono">
                        ₹ {parseFloat(c.claim_valuation).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="badge badge-pending">{c.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            onClick={() => {
                              setActiveCase(c);
                              loadMatrix(c.id);
                              setActiveTab('matrix');
                            }}
                            style={{
                              background: '#0f172a',
                              color: 'white',
                              border: 'none',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Open Matrix
                          </button>
                          <button 
                            onClick={() => loadCaseDossier(c.cnr_number)}
                            style={{
                              background: '#2563eb',
                              color: 'white',
                              border: 'none',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Search size={12} />
                            Full Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SMART CLASH-FREE SCHEDULER */}
        {activeTab === 'scheduler' && (
          <div className="court-card">
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} color="#2563eb" />
                Cross-Courtroom Advocate Schedule Clash Detection Engine
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Statutory anti-collision algorithm: scans all court halls to eliminate advocate double-booking adjournments.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Target Hearing Date
                </label>
                <input 
                  type="date" 
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Start Time (Slot)
                </label>
                <input 
                  type="time" 
                  value={schedStartTime}
                  onChange={(e) => setSchedStartTime(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  End Time
                </label>
                <input 
                  type="time" 
                  value={schedEndTime}
                  onChange={(e) => setSchedEndTime(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Court Hall
                </label>
                <select 
                  value={schedHall}
                  onChange={(e) => setSchedHall(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                >
                  <option value="HALL_04">Court Hall 4 (Commercial Bench)</option>
                  <option value="HALL_02">Court Hall 2 (Civil Recovery)</option>
                  <option value="HALL_01">Court Hall 1 (Chief Judge)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleCheckClash}
                disabled={checkingClash}
                style={{
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <ShieldCheck size={18} />
                {checkingClash ? 'Scanning Roster...' : '1. Scan Multi-Hall Roster for Conflicts'}
              </button>

              <button 
                onClick={handleBookSlot}
                disabled={clashResult?.has_conflict}
                style={{
                  background: clashResult?.has_conflict ? '#cbd5e1' : '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: clashResult?.has_conflict ? 'not-allowed' : 'pointer'
                }}
              >
                2. Confirm Slot & Generate WebRTC Room
              </button>
            </div>

            {clashResult && (
              <div className={`clash-alert ${clashResult.has_conflict ? 'danger' : 'success'}`}>
                {clashResult.has_conflict ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {clashResult.has_conflict ? 'ADVOCATE DOUBLE-BOOKING COLLISION DETECTED!' : 'SLOT VERIFIED: ZERO ADVOCATE CLASHES'}
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {clashResult.has_conflict 
                      ? clashResult.conflict_message 
                      : `Both counsels (Adv. Mukul MP/14297 and Adv. Priya MP/11054) are completely free across all district court benches during ${schedStartTime} - ${schedEndTime}.`}
                  </p>
                </div>
              </div>
            )}

            {bookingSuccess && (
              <div className="clash-alert success" style={{ marginTop: '1rem' }}>
                <CheckCircle2 size={24} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    HEARING SESSION CONFIRMED IN CALENDAR!
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    Session registered for {bookingSuccess.hearing_date}. In-Browser WebRTC Room: <span className="mono" style={{ fontWeight: 700 }}>{bookingSuccess.webrtc_room_id}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CASE MANAGEMENT ORDER (CMO) */}
        {activeTab === 'cmo' && (
          <div className="court-card" style={{ maxWidth: '800px', margin: '0 auto', border: '2px solid #0f172a' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 className="serif-court" style={{ fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase' }}>
                In the Commercial Court of Indore, Madhya Pradesh
              </h2>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginTop: '0.25rem' }}>
                Order Under Order XV-A, Rule 6 Code of Civil Procedure, 1908
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                CNR: {activeCase?.cnr_number || 'MPIN010012342026'}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.4rem' }}>
                1. Undisputed Facts Settled in Admissions Matrix:
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155' }}>
                <li>Execution of Master Agreement dated 15 Jan 2026 is formally admitted by both parties.</li>
                <li>Receipt of Invoices #INV-2026-089 is admitted as valid business record.</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.4rem' }}>
                2. Framed Triable Issues for Trial:
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155' }}>
                <li>Issue 1: Whether delivery consignment #DR-9921 was physically handed over in damaged condition? (Onus on Defendant)</li>
                <li>Issue 2: Whether plaintiff is entitled to interest @ 18% p.a. under MSME Act?</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.4rem' }}>
                3. Mandatory Discovery Timetable:
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                • Filing of witness affidavits: <strong>Within 15 days</strong> (Deadline: Oct 20, 2026)<br />
                • Inspection of original documents: <strong>Within 15 days</strong> (Deadline: Nov 05, 2026)<br />
                • Trial Commencement Date: <strong>Nov 25, 2026</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #cbd5e1', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <QrCode size={48} color="#0f172a" />
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Digital Judicial Seal</div>
                  <div>SHA-256: 4a8f9b...e21c</div>
                  <div>Verified by e-Mudhra DSC</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  (Hon'ble Justice Rajesh Sharma)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Presiding Judicial Officer, Commercial Bench
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
