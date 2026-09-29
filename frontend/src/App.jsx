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
  X 
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [backendOnline, setBackendOnline] = useState(false);
  const [currentRole, setCurrentRole] = useState('ADVOCATE_PLAINTIFF'); // JUDGE, ADVOCATE_PLAINTIFF, ADVOCATE_DEFENDANT, CLERK
  
  // Data State
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  
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

        {activeCase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Active Case:</span>
            <span className="mono" style={{ fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              {activeCase.cnr_number}
            </span>
          </div>
        )}
      </div>

      {/* 3. Main Container */}
      <div className="main-wrapper">
        
        {/* Navigation Tabs */}
        <div className="tabs-nav">
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
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Open Matrix
                        </button>
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
