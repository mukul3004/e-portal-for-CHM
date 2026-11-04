import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  X,
  Gavel,
  ShieldCheck,
  CheckCircle2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Copy,
  Check,
  ExternalLink,
  Users,
  FileText,
  AlertCircle,
  Clock,
  Sparkles,
  Maximize2
} from 'lucide-react';

function MpHcEmblem({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="High Court of Madhya Pradesh Official Emblem"
    >
      <circle cx="50" cy="50" r="48" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2.5 1.5" />
      <circle cx="50" cy="50" r="42" fill="#070d1e" stroke="#d97706" strokeWidth="1.5" />
      <path id="mphcUpperArcModal" d="M 16,50 A 34,34 0 1,1 84,50" fill="none" />
      <path id="mphcLowerArcModal" d="M 82,53 A 32,32 0 0,1 18,53" fill="none" />
      <text fill="#ffffff" fontSize="5.2" fontWeight="800" letterSpacing="0.08em">
        <textPath href="#mphcUpperArcModal" startOffset="50%" textAnchor="middle">
          HIGH COURT OF MADHYA PRADESH
        </textPath>
      </text>
      <text fill="#f59e0b" fontSize="4.6" fontWeight="700" letterSpacing="0.05em">
        <textPath href="#mphcLowerArcModal" startOffset="50%" textAnchor="middle">
          सत्यमेव जयते • JABALPUR
        </textPath>
      </text>
      <circle cx="50" cy="50" r="25" fill="#1e293b" stroke="#d97706" strokeWidth="1" />
      <path d="M 45 32 Q 44 27 46 25 Q 48 27 48 30 Z" fill="#ffffff" />
      <path d="M 50 31 Q 48 26 50 24 Q 52 26 52 31 Z" fill="#d97706" />
      <path d="M 55 32 Q 56 27 54 25 Q 52 27 52 30 Z" fill="#ffffff" />
      <rect x="43" y="32" width="14" height="2" rx="0.5" fill="#d97706" />
      <line x1="50" y1="34" x2="50" y2="62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="33" y1="39" x2="67" y2="39" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="34" y1="40" x2="30" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <line x1="34" y1="40" x2="38" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <path d="M 28 49 Q 34 53 40 49 Z" fill="#ffffff" stroke="#d97706" strokeWidth="0.8" />
      <line x1="66" y1="40" x2="62" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <line x1="66" y1="40" x2="70" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <path d="M 60 49 Q 66 53 72 49 Z" fill="#ffffff" stroke="#d97706" strokeWidth="0.8" />
      <path d="M 42 62 L 58 62 L 55 64 L 45 64 Z" fill="#d97706" />
    </svg>
  );
}

export default function VirtualCourtroomModal({
  session,
  currentRole,
  currentOfficer,
  onClose,
  handleUpdateSessionStatus,
  tr = (t) => t
}) {
  const [viewMode, setViewMode] = useState('live'); // 'live' (full Jitsi), 'split' (Jitsi + Exhibits), 'procedural' (4-tile grid)
  const [copiedLink, setCopiedLink] = useState(false);
  const [jitsiLoading, setJitsiLoading] = useState(true);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  // Fallback procedural mock state
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // Compute clean, unified Jitsi room identifier
  const rawRoom = session?.webrtc_room_id || session?.case?.cnr_number || `CMH-${session?.id || 'BENCH'}`;
  const cleanRoom = String(rawRoom).replace(/[^a-zA-Z0-9_-]/g, '_');
  const jitsiRoomName = `MPHC_Commercial_${cleanRoom}`;
  const directMeetingUrl = `https://meet.jit.si/${jitsiRoomName}`;

  // Formulate user display name based on current role
  let userDisplayName = currentOfficer?.name;
  if (!userDisplayName) {
    if (currentRole === 'JUDGE') userDisplayName = "Hon'ble Justice Rajesh Sharma (Presiding)";
    else if (currentRole === 'ADVOCATE') userDisplayName = "Adv. Himanshu Bawaniya (Counsel)";
    else if (currentRole === 'LITIGANT') userDisplayName = "Commercial Litigant / Party";
    else userDisplayName = "Court Officer / Observer";
  }

  // Initialize Jitsi Meet when entering 'live' or 'split' view
  useEffect(() => {
    let isMounted = true;

    if (viewMode === 'procedural') {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.warn('Jitsi dispose error:', e);
        }
        jitsiApiRef.current = null;
      }
      return;
    }

    const initJitsi = () => {
      if (!isMounted || !jitsiContainerRef.current) return;

      // Clean up any existing instance
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.warn('Jitsi dispose error:', e);
        }
        jitsiApiRef.current = null;
      }

      if (window.JitsiMeetExternalAPI) {
        try {
          const domain = 'meet.jit.si';
          const options = {
            roomName: jitsiRoomName,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            userInfo: {
              displayName: userDisplayName,
              email: currentOfficer?.email || 'portal@mphighcourt.gov.in'
            },
            configOverwrite: {
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              prejoinPageEnabled: false,
              disableDeepLinking: true,
              enableWelcomePage: false,
              enableClosePage: false,
              subject: `Commercial Courtroom • ${session?.case?.case_title || 'Order XV-A Hearing'}`
            },
            interfaceConfigOverwrite: {
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_REMOTE_DISPLAY_NAME: 'Courtroom Participant',
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'chat', 'recording',
                'raisehand', 'videoquality', 'tileview', 'videobackgroundblur'
              ]
            }
          };

          const api = new window.JitsiMeetExternalAPI(domain, options);
          jitsiApiRef.current = api;
          setJitsiLoading(false);

          api.addEventListener('videoConferenceLeft', () => {
            if (isMounted) onClose();
          });
        } catch (err) {
          console.error('Failed to instantiate Jitsi Meet API, switching to iframe fallback:', err);
          setUseIframeFallback(true);
          setJitsiLoading(false);
        }
      } else {
        // Script not available yet, fall back to iframe
        setUseIframeFallback(true);
        setJitsiLoading(false);
      }
    };

    // Check if script is loaded, or dynamically load it
    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const existingScript = document.querySelector('script[src*="meet.jit.si/external_api.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', initJitsi);
      } else {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = initJitsi;
        script.onerror = () => {
          console.warn('Failed to load Jitsi external_api.js, using iframe fallback.');
          if (isMounted) {
            setUseIframeFallback(true);
            setJitsiLoading(false);
          }
        };
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.warn('Jitsi cleanup dispose error:', e);
        }
        jitsiApiRef.current = null;
      }
    };
  }, [viewMode, jitsiRoomName, userDisplayName]);

  // Handle Copy Invitation Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(directMeetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Open second participant window for live testing
  const handleOpenSecondWindow = () => {
    window.open(directMeetingUrl, '_blank', 'width=900,height=650');
  };

  return (
    <div className="courtroom-overlay" style={{ zIndex: 9999 }}>
      <div className="courtroom-modal" style={{ height: '94vh' }}>
        {/* Top Courtroom Header */}
        <div className="courtroom-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <MpHcEmblem size={34} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, color: '#d97706', fontSize: '0.9rem' }}>
                  Commercial Courtroom Hall 04 • High Court of MP
                </span>
                <span className="courtroom-rec-pill">
                  <span className="rec-dot"></span>
                  <span>ORDER XV-A LIVE RECORDING</span>
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  background: '#047857',
                  color: '#ffffff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Video size={10} />
                  <span>Jitsi WebRTC Multi-Party</span>
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
                {session?.case?.case_title || 'Commercial Hearing'} • CNR:{' '}
                <strong className="mono" style={{ color: '#ffffff' }}>
                  {session?.case?.cnr_number || 'N/A'}
                </strong>{' '}
                • Room ID:{' '}
                <strong className="mono" style={{ color: '#f59e0b' }}>
                  {session?.webrtc_room_id || jitsiRoomName}
                </strong>
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* View Selector Buttons */}
            <div style={{
              display: 'inline-flex',
              background: '#020617',
              padding: '0.2rem',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <button
                type="button"
                onClick={() => setViewMode('live')}
                style={{
                  background: viewMode === 'live' ? '#d97706' : 'transparent',
                  color: viewMode === 'live' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Full Multi-User Live Video Conference"
              >
                <Video size={13} />
                <span>Live Video Room</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('split')}
                style={{
                  background: viewMode === 'split' ? '#d97706' : 'transparent',
                  color: viewMode === 'split' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Split Screen: Live Video + Cryptographic Evidence Desk"
              >
                <Monitor size={13} />
                <span>Video + Evidence Desk</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('procedural')}
                style={{
                  background: viewMode === 'procedural' ? '#d97706' : 'transparent',
                  color: viewMode === 'procedural' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Procedural 4-Tile Courtroom Grid"
              >
                <Users size={13} />
                <span>Quad Grid</span>
              </button>
            </div>

            {/* Copy Meeting Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="ctrl-btn"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              title="Copy meeting link to share with Plaintiff / Defendant"
            >
              {copiedLink ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            {/* Test 2-Party Call Window */}
            <button
              type="button"
              onClick={handleOpenSecondWindow}
              className="ctrl-btn"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              title="Open a second browser tab/window to test live two-way camera connection"
            >
              <ExternalLink size={14} />
              <span>Test 2-Party Call</span>
            </button>

            {/* Leave Courtroom */}
            <button
              type="button"
              onClick={onClose}
              className="ctrl-btn active-danger"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              <X size={14} />
              <span>{tr('Leave Courtroom')}</span>
            </button>
          </div>
        </div>

        {/* Main Body depending on viewMode */}
        {viewMode === 'live' && (
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#090d16' }}>
            {useIframeFallback ? (
              <iframe
                src={`${directMeetingUrl}#userInfo.displayName="${encodeURIComponent(userDisplayName)}"`}
                allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Virtual Courtroom Jitsi Conference"
              />
            ) : (
              <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#090d16' }}>
            {/* Left Column: Live Video Conference */}
            <div style={{ flex: '1.25', height: '100%', position: 'relative', borderRight: '1.5px solid #334155' }}>
              {useIframeFallback ? (
                <iframe
                  src={`${directMeetingUrl}#userInfo.displayName="${encodeURIComponent(userDisplayName)}"`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Virtual Courtroom Jitsi Conference"
                />
              ) : (
                <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
              )}
            </div>

            {/* Right Column: Order XV-A Cryptographic Evidence & Admissions Desk */}
            <div style={{ flex: '0.95', height: '100%', overflowY: 'auto', background: '#0f172a', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} />
                  <span>Order XV-A Evidence & Admissions Desk</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', background: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  SHA-256 Verified
                </span>
              </div>

              {/* Hearing Information Card */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem' }}>
                <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                  Judicial Matter Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', color: '#cbd5e1' }}>
                  <div>Presiding Bench: <strong style={{ color: '#f59e0b' }}>{session?.judge_name || "Hon'ble Justice Rajesh Sharma"}</strong></div>
                  <div>Court Hall: <strong style={{ color: '#ffffff' }}>{session?.court_hall_id || 'Hall 04 (VC)'}</strong></div>
                  <div>Scheduled Slot: <strong style={{ color: '#38bdf8' }}>{session?.start_time} - {session?.end_time}</strong></div>
                  <div>Status: <strong style={{ color: '#10b981' }}>{session?.status || 'IN_PROGRESS'}</strong></div>
                </div>
              </div>

              {/* Exhibit P-1 */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.82rem' }}>
                    Exhibit P-1: Commercial Service Agreement
                  </div>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                    Admitted
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginTop: '0.3rem' }}>
                  SHA-256: <code className="mono" style={{ color: '#f59e0b' }}>8a4e...710d</code> (Tamper-Proof)
                </div>
                <div style={{ marginTop: '0.4rem', color: '#34d399', fontWeight: 600, fontSize: '0.75rem' }}>
                  ✓ Defendant Stance: ADMITTED AS TO EXECUTION & CONTENTS
                </div>
              </div>

              {/* Exhibit P-2 */}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.82rem' }}>
                    Exhibit P-2: Invoices & Electronic GST Ledger
                  </div>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                    Contested
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginTop: '0.3rem' }}>
                  SHA-256: <code className="mono" style={{ color: '#f59e0b' }}>3f9c...44a1</code> (Sec 65B IT Act Electronic Record)
                </div>
                <div style={{ marginTop: '0.4rem', color: '#f87171', fontWeight: 600, fontSize: '0.75rem' }}>
                  ✗ Defendant Stance: DENIED AS TO VALUATION & PENAL INTEREST
                </div>
              </div>

              {/* Case Issues Under Order XV-A Rule 3 */}
              <div style={{ background: '#182030', border: '1px solid #2e3c54', borderRadius: '8px', padding: '0.75rem', marginTop: 'auto' }}>
                <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <Gavel size={14} />
                  <span>Order XV-A Framing of Contested Issues</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  Issue 1: Whether plaintiff delivered software milestones within stipulated timeline? (Burden on Plaintiff).<br />
                  Issue 2: Whether defendant is liable for liquidated damages of ₹45,00,000 under Clause 14?
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'procedural' && (
          <div className="courtroom-body">
            {/* Tile 1: Hon'ble Presiding Judge */}
            <div className="courtroom-tile judge-bench">
              <div className="tile-avatar-halo" style={{ borderColor: '#d97706', background: 'rgba(217, 119, 6, 0.15)' }}>
                ⚖️
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                  {session?.judge_name || "Hon'ble Justice Rajesh Sharma"}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                  Presiding Judicial Officer (Bench at Indore)
                </div>
              </div>
              <div className="tile-info-bar">
                <span style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Gavel size={12} color="#d97706" /> Order XV-A Judicial Authority
                </span>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>● Live HD</span>
              </div>
            </div>

            {/* Tile 2: Plaintiff Counsel */}
            <div className="courtroom-tile active-speaker">
              <div className="tile-avatar-halo" style={{ borderColor: '#0284c7' }}>
                👨‍⚖️
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                  {session?.plaintiff_counsel?.name || 'Adv. Himanshu Bawaniya'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                  Legal Counsel for Plaintiff ({session?.plaintiff_counsel?.bar_council_id || 'MP/14297/2026'})
                </div>
              </div>
              <div className="tile-info-bar">
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Averments Submitted</span>
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>🔊 Speaking</span>
              </div>
            </div>

            {/* Tile 3: Defendant Counsel */}
            <div className="courtroom-tile">
              <div className="tile-avatar-halo" style={{ borderColor: '#7c3aed' }}>
                👩‍⚖️
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                  {session?.defendant_counsel?.name || 'Adv. Priya Verma'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                  Legal Counsel for Defendant ({session?.defendant_counsel?.bar_council_id || 'MP/11054/2026'})
                </div>
              </div>
              <div className="tile-info-bar">
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Written Statement Filed</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Connected</span>
              </div>
            </div>

            {/* Tile 4: Evidence Screen */}
            <div className="courtroom-tile" style={{ padding: '1rem', background: '#121214', alignItems: 'stretch', justifyContent: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} />
                  <span>Cryptographic Evidence & Admissions Screen</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', background: '#334155', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  SHA-256 Verified
                </span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.78rem', color: '#d4d4d8' }}>
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '0.65rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                    Exhibit P-1: Commercial Service Agreement
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                    Hash: <code className="mono" style={{ color: '#f59e0b' }}>8a4e...710d</code> (Tamper-Proof)
                  </div>
                  <div style={{ marginTop: '0.35rem', color: '#10b981', fontWeight: 700, fontSize: '0.72rem' }}>
                    ✓ Defendant Stance: ADMITTED AS TO CONTENTS
                  </div>
                </div>

                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '0.65rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                    Exhibit P-2: Invoices & GST Electronic Tax Records
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                    Hash: <code className="mono" style={{ color: '#f59e0b' }}>3f9c...44a1</code> (65B IT Act Certified)
                  </div>
                  <div style={{ marginTop: '0.35rem', color: '#ef4444', fontWeight: 700, fontSize: '0.72rem' }}>
                    ✗ Defendant Stance: DENIED AS TO VALUATION
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Courtroom Action Controls Bar */}
        <div className="courtroom-controls">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Connected as: <strong style={{ color: '#f59e0b' }}>{userDisplayName}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentRole === 'JUDGE' && handleUpdateSessionStatus && (
              <>
                <button
                  type="button"
                  onClick={() => handleUpdateSessionStatus(session?.session_id, 'IN_PROGRESS')}
                  className="ctrl-btn"
                  style={{ background: '#059669', borderColor: '#047857', color: '#ffffff' }}
                >
                  <span>Mark In Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateSessionStatus(session?.session_id, 'CONCLUDED');
                    alert('Hearing Concluded. Next step: Sign Case Management Order under Order XV-A Rule 6.');
                  }}
                  className="ctrl-btn"
                  style={{ background: '#d97706', borderColor: '#b45309', color: '#ffffff' }}
                >
                  <CheckCircle2 size={15} />
                  <span>{tr('Mark Hearing Concluded')}</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ctrl-btn"
            >
              <span>{tr('Close Window')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

