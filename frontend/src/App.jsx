import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Scale, 
  Gavel, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
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
  Sparkles,
  Building,
  User,
  Landmark,
  Sun,
  Moon,
  ChevronDown,
  Briefcase,
  LogIn,
  LogOut,
  Mail,
  Shield,
  Globe,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Receipt,
  CreditCard,
  DollarSign,
  Printer,
  CheckSquare,
  Award,
  AlertCircle,
  Bell,
  BellRing,
  Share2,
  Send,
  Smartphone,
  MessageSquare,
  BarChart3,
  TrendingUp,
  CheckCheck,
  Compass
} from 'lucide-react';
import { t, tCategory, tStatus, tStance, tDeadlineStatus, tRelativeDate } from './translations';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = `${BACKEND_URL}/api/v1`;

// Official Madhya Pradesh High Court Vector Emblem (Ashoka Lion Capital + Scales of Justice)
function MpHcEmblem({ size = 70 }) {
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
      {/* Outer decorative borders */}
      <circle cx="50" cy="50" r="48" stroke="#d97706" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="45" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2.5 1.5" />
      <circle cx="50" cy="50" r="42" fill="#070d1e" stroke="#d97706" strokeWidth="1.5" />
      
      {/* Curved Text Paths for High Court Title */}
      <path id="mphcUpperArc" d="M 16,50 A 34,34 0 1,1 84,50" fill="none" />
      <path id="mphcLowerArc" d="M 82,53 A 32,32 0 0,1 18,53" fill="none" />
      
      <text fill="#ffffff" fontSize="5.2" fontWeight="800" letterSpacing="0.08em">
        <textPath href="#mphcUpperArc" startOffset="50%" textAnchor="middle">
          HIGH COURT OF MADHYA PRADESH
        </textPath>
      </text>

      <text fill="#f59e0b" fontSize="4.6" fontWeight="700" letterSpacing="0.05em">
        <textPath href="#mphcLowerArc" startOffset="50%" textAnchor="middle">
          सत्यमेव जयते • JABALPUR
        </textPath>
      </text>

      {/* Central Inner Disc */}
      <circle cx="50" cy="50" r="25" fill="#1e293b" stroke="#d97706" strokeWidth="1" />

      {/* Ashoka Pillar Lion Capital stylized silhouette */}
      <path d="M 45 32 Q 44 27 46 25 Q 48 27 48 30 Z" fill="#ffffff" />
      <path d="M 50 31 Q 48 26 50 24 Q 52 26 52 31 Z" fill="#d97706" />
      <path d="M 55 32 Q 56 27 54 25 Q 52 27 52 30 Z" fill="#ffffff" />
      <rect x="43" y="32" width="14" height="2" rx="0.5" fill="#d97706" />

      {/* Central Scales of Justice (Tarazu) */}
      <line x1="50" y1="34" x2="50" y2="62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="33" y1="39" x2="67" y2="39" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Left Pan */}
      <line x1="34" y1="40" x2="30" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <line x1="34" y1="40" x2="38" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <path d="M 28 49 Q 34 53 40 49 Z" fill="#ffffff" stroke="#d97706" strokeWidth="0.8" />

      {/* Right Pan */}
      <line x1="66" y1="40" x2="62" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <line x1="66" y1="40" x2="70" y2="49" stroke="#f59e0b" strokeWidth="0.8" />
      <path d="M 60 49 Q 66 53 72 49 Z" fill="#ffffff" stroke="#d97706" strokeWidth="0.8" />

      {/* Base Dharmachakra */}
      <circle cx="50" cy="62" r="3.5" stroke="#d97706" strokeWidth="0.9" fill="#070d1e" />
      <circle cx="50" cy="62" r="1" fill="#d97706" />
      <path d="M 42 67 L 58 67 L 55 64 L 45 64 Z" fill="#d97706" />
    </svg>
  );
}

const DEFAULT_OFFICERS = [
  // 1. Public Citizen / Open Justice Visitor (First by Default!)
  {
    id: "public-citizen",
    email: "citizen.public@mphc.gov.in",
    full_name: "Citizen Inquirer / जनसाधारण",
    role: "ROLE_CITIZEN",
    title: "Public Inquirer (Open Courts Principle)",
    organization: "Open Justice Public Node",
    jurisdiction: "All Madhya Pradesh Benches",
    category: "CITIZEN"
  },
  // Judges
  {
    id: "judge-sharma",
    email: "judge.sharma@svvv-courts.gov.in",
    full_name: "Hon'ble Justice Rajesh Sharma",
    role: "ROLE_JUDGE",
    bench_id: "BENCH_INDORE_COMM_01",
    court_hall_id: "HALL_04",
    title: "Senior Judge, Commercial Division",
    jurisdiction: "Indore (Principal Commercial Bench)",
    category: "JUDGE"
  },
  {
    id: "judge-verma",
    email: "judge.verma@svvv-courts.gov.in",
    full_name: "Hon'ble Justice Alok Verma",
    role: "ROLE_JUDGE",
    bench_id: "BENCH_JABALPUR_COMM_01",
    court_hall_id: "HALL_01",
    title: "Presiding Judge, Principal Seat",
    jurisdiction: "High Court of MP, Jabalpur",
    category: "JUDGE"
  },
  {
    id: "judge-mehta",
    email: "judge.mehta@svvv-courts.gov.in",
    full_name: "Hon'ble Justice Meenakshi Mehta",
    role: "ROLE_JUDGE",
    bench_id: "BENCH_GWALIOR_COMM_01",
    court_hall_id: "HALL_02",
    title: "Judge, Commercial Appellate Division",
    jurisdiction: "High Court Bench, Gwalior",
    category: "JUDGE"
  },
  {
    id: "judge-jain",
    email: "judge.jain@svvv-courts.gov.in",
    full_name: "Hon'ble Judge Satyendra K. Jain",
    role: "ROLE_JUDGE",
    bench_id: "BENCH_INDORE_DIST_COMM",
    court_hall_id: "HALL_03",
    title: "District Commercial Judge",
    jurisdiction: "Commercial Court, Indore",
    category: "JUDGE"
  },
  // Advocates
  {
    id: "adv-himanshu",
    email: "adv.himanshu@barcouncil.org",
    full_name: "Adv. Himanshu Bawaniya",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/14297/2026",
    title: "Senior Commercial Counsel",
    jurisdiction: "High Court Bar Association, Indore",
    category: "ADVOCATE",
    specialty: "Commercial Contracts & Tech Disputes"
  },
  {
    id: "adv-verma",
    email: "adv.verma@barcouncil.org",
    full_name: "Adv. Priya Verma",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/11054/2026",
    title: "Corporate & Arbitration Counsel",
    jurisdiction: "High Court Bar Association, Jabalpur",
    category: "ADVOCATE",
    specialty: "Arbitration & Cross-Border Contracts"
  },
  {
    id: "adv-joshi",
    email: "adv.joshi@barcouncil.org",
    full_name: "Adv. Arvind K. Joshi",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/08942/2024",
    title: "Insolvency & Company Law Specialist",
    jurisdiction: "Commercial Court Bar, Indore",
    category: "ADVOCATE",
    specialty: "IBC & Shareholder Disputes"
  },
  {
    id: "adv-saxena",
    email: "adv.saxena@barcouncil.org",
    full_name: "Adv. Rohit Saxena",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/16723/2025",
    title: "Banking & Negotiable Instruments Counsel",
    jurisdiction: "District Bar Association, Bhopal",
    category: "ADVOCATE",
    specialty: "Section 138 NI Act & Debt Recovery"
  },
  {
    id: "adv-singhania",
    email: "adv.singhania@barcouncil.org",
    full_name: "Adv. Sneha Singhania",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/19082/2026",
    title: "IP Rights & Patent Litigator",
    jurisdiction: "High Court Bar Association, Indore",
    category: "ADVOCATE",
    specialty: "Trademark, Copyright & Licensing"
  },
  {
    id: "adv-rathore",
    email: "adv.rathore@barcouncil.org",
    full_name: "Adv. Vikramaditya Rathore",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/07431/2023",
    title: "Infrastructure & Real Estate Litigator",
    jurisdiction: "High Court Bar Association, Gwalior",
    category: "ADVOCATE",
    specialty: "EPC Contracts & Real Estate RERA"
  },
  {
    id: "adv-pathak",
    email: "adv.pathak@barcouncil.org",
    full_name: "Adv. Nandita Pathak",
    role: "ROLE_ADVOCATE",
    bar_council_id: "MP/22190/2026",
    title: "Commercial Recovery Specialist",
    jurisdiction: "District Bar Association, Indore",
    category: "ADVOCATE",
    specialty: "Civil Recovery & Specific Relief"
  },
  // Clerks & Registry
  {
    id: "clerk-sunita",
    email: "clerk.indore@svvv-courts.gov.in",
    full_name: "Court Clerk Sunita Rao",
    role: "ROLE_CLERK",
    court_hall_id: "HALL_04",
    title: "Principal Registry Clerk",
    jurisdiction: "Commercial Court Hall 04 Registry",
    category: "CLERK"
  },
  {
    id: "reader-prasad",
    email: "reader.prasad@svvv-courts.gov.in",
    full_name: "Reader Rajeshwar Prasad",
    role: "ROLE_CLERK",
    court_hall_id: "HALL_01",
    title: "Commercial Bench Reader",
    jurisdiction: "Court Hall 01, Jabalpur",
    category: "CLERK"
  },
  {
    id: "registrar-sharma",
    email: "registrar.sharma@svvv-courts.gov.in",
    full_name: "Deputy Registrar Anand Sharma",
    role: "ROLE_CLERK",
    court_hall_id: "CENTRAL_REGISTRY",
    title: "Deputy Registrar (E-Filing & Scrutiny)",
    jurisdiction: "High Court Principal Registry",
    category: "CLERK"
  },
  // Commercial Litigants / Corporate Clients
  {
    id: "client-apex",
    email: "client.apex@commercial.in",
    full_name: "Rajiv Singhania",
    role: "ROLE_LITIGANT",
    title: "Director & Litigant Representative",
    organization: "Apex Infotech Ltd. (Plaintiff)",
    case_ref: "MPIN01593559452026",
    jurisdiction: "Indore Commercial Bench",
    category: "LITIGANT",
    counsel: "Adv. Himanshu Bawaniya"
  },
  {
    id: "client-horizon",
    email: "client.horizon@logistics.in",
    full_name: "Col. Harpreet Singh",
    role: "ROLE_LITIGANT",
    title: "Managing Director & Litigant Representative",
    organization: "Horizon Logistics Pvt. Ltd. (Defendant)",
    case_ref: "MPIN01593559452026",
    jurisdiction: "Indore Commercial Bench",
    category: "LITIGANT",
    counsel: "Adv. Priya Verma"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [backendOnline, setBackendOnline] = useState(false);
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('mphc_auth_session');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.role === 'ROLE_JUDGE') return 'JUDGE';
        if (s.role === 'ROLE_CLERK') return 'CLERK';
        if (s.role === 'ROLE_LITIGANT') return 'LITIGANT';
        if (s.role === 'ROLE_ADVOCATE') return 'ADVOCATE_PLAINTIFF';
      }
    } catch {}
    return 'CITIZEN'; // Public Citizen is FIRST by default!
  });
  
  // MP High Court Authentication & Role Session State
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('mphc_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showLoginPage, setShowLoginPage] = useState(false); // Open Courts: Public Citizen view is shown first!
  const [loginRoleTab, setLoginRoleTab] = useState('CITIZEN'); // Public Citizen is FIRST tab!
  const [loginEmail, setLoginEmail] = useState('citizen.public@mphc.gov.in');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Officer & Personal Identity Management States
  const [officersList, setOfficersList] = useState(DEFAULT_OFFICERS);
  const [currentOfficer, setCurrentOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem('mphc_auth_session');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.officer) return s.officer;
      }
    } catch {}
    return DEFAULT_OFFICERS[0]; // Citizen Inquirer / जनसाधारण (First by Default!)
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [officerFilterTab, setOfficerFilterTab] = useState('CITIZEN'); // Public Citizen is FIRST!
  const [showDevSimulatorBar, setShowDevSimulatorBar] = useState(false); // Hidden by default from main page!
  
  // MP High Court Portal States
  const [activeBench, setActiveBench] = useState('INDORE'); // 'INDORE', 'JABALPUR', 'GWALIOR'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('mphc_lang') || 'EN';
  });
  const [fontSizeLevel, setFontSizeLevel] = useState(() => {
    try {
      const saved = localStorage.getItem('mphc_font_size');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  }); // -1: small, 0: normal, 1: large
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mphc_theme') || 'light';
  });

  // Persist language selection in localStorage and update HTML attribute
  useEffect(() => {
    try {
      localStorage.setItem('mphc_lang', lang);
      document.documentElement.setAttribute('lang', lang.toLowerCase());
    } catch (e) {}
  }, [lang]);

  // Synchronize Font Size Level (-1: Small, 0: Normal, 1: Large) across whole document
  useEffect(() => {
    try {
      localStorage.setItem('mphc_font_size', String(fontSizeLevel));
      const root = document.documentElement;
      if (fontSizeLevel === -1) {
        root.style.fontSize = '87.5%'; // ~14px base
        root.setAttribute('data-font-size', 'small');
      } else if (fontSizeLevel === 1) {
        root.style.fontSize = '115%'; // ~18.4px base
        root.setAttribute('data-font-size', 'large');
      } else {
        root.style.fontSize = '100%'; // 16px default
        root.setAttribute('data-font-size', 'normal');
      }
    } catch (e) {
      console.error('Error saving font size preference:', e);
    }
  }, [fontSizeLevel]);

  // Translation Helper Aliases
  const tr = (key) => t(key, lang);
  const trCat = (cat) => tCategory(cat, lang);
  const trStat = (st) => tStatus(st, lang);
  const trStn = (stn) => tStance(stn, lang);
  const trDStat = (st) => tDeadlineStatus(st, lang);
  const trRel = (d) => tRelativeDate(d, lang);
  
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
  const [schedDate, setSchedDate] = useState('2026-11-03');
  const [schedStartTime, setSchedStartTime] = useState('11:30:00');
  const [schedEndTime, setSchedEndTime] = useState('11:50:00');
  const [schedHall, setSchedHall] = useState('HALL_04');
  const [clashResult, setClashResult] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [checkingClash, setCheckingClash] = useState(false);
  const [tableRosterFilter, setTableRosterFilter] = useState('ALL');

  // Live Roster Statistics
  const nextWeekCount = cases.filter(c => c.next_hearing_relative && c.next_hearing_relative.includes('Next Week')).length;
  const nextMonthCount = cases.filter(c => c.next_hearing_relative && c.next_hearing_relative.includes('Next Month')).length;
  const displayedCases = cases.filter(c => {
    if (tableRosterFilter === 'NEXT_WEEK') return c.next_hearing_relative && c.next_hearing_relative.includes('Next Week');
    if (tableRosterFilter === 'NEXT_MONTH') return c.next_hearing_relative && c.next_hearing_relative.includes('Next Month');
    return true;
  });

  // Cause List (रोज़नामचा / Board) State
  const [causeListDate, setCauseListDate] = useState('2026-10-29');
  const [causeListHall, setCauseListHall] = useState('ALL');
  const [causeListStatusFilter, setCauseListStatusFilter] = useState('ALL');
  const [causeListItems, setCauseListItems] = useState([]);
  const [loadingCauseList, setLoadingCauseList] = useState(false);

  // WebRTC Virtual Courtroom State
  const [activeCourtroomSession, setActiveCourtroomSession] = useState(null);
  const [admittanceNotice, setAdmittanceNotice] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [courtroomViewMode, setCourtroomViewMode] = useState('grid');
  const [courtroomActiveTab, setCourtroomActiveTab] = useState('exhibits');

  // e-Challan & Cyber Treasury State
  const [challanList, setChallanList] = useState([]);
  const [loadingChallans, setLoadingChallans] = useState(false);
  const [claimValInput, setClaimValInput] = useState('4500000');
  const [feeBreakdown, setFeeBreakdown] = useState(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [challanPayerName, setChallanPayerName] = useState('Adv. Himanshu Bawaniya');
  const [challanPayerEmail, setChallanPayerEmail] = useState('adv.himanshu@barcouncil.org');
  const [challanHead, setChallanHead] = useState('0030-02-103-01: Commercial Court Ad-Valorem Fee');
  const [challanAmount, setChallanAmount] = useState('90000');
  const [challanCnr, setChallanCnr] = useState('');
  const [payingChallanId, setPayingChallanId] = useState(null);
  const [challanSuccessReceipt, setChallanSuccessReceipt] = useState(null);
  const [verifyChallanQuery, setVerifyChallanQuery] = useState('');
  const [verifiedChallanData, setVerifiedChallanData] = useState(null);
  const [verifyingChallan, setVerifyingChallan] = useState(false);
  const [verifyChallanError, setVerifyChallanError] = useState(null);

  // Multi-Channel Notification State (Order V CPC)
  const [notifications, setNotifications] = useState([]);
  const [notifSummary, setNotifSummary] = useState({ unread_count: 0, total_count: 0, channel_breakdown: { in_app: 0, sms: 0, whatsapp: 0 } });
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifFilterChannel, setNotifFilterChannel] = useState('ALL');
  const [dispatchingNotifs, setDispatchingNotifs] = useState(false);
  const [notifSuccessBanner, setNotifSuccessBanner] = useState(null);

  // Section 89 CPC Mediation Referral State
  const [adrReferralNotice, setAdrReferralNotice] = useState(null);

  // Statutory e-Summons (Order V CPC) Modal State
  const [summonsModalOpen, setSummonsModalOpen] = useState(false);
  const [summonsCase, setSummonsCase] = useState(null);

  // Viva Demo Tour State
  const [vivaTourActive, setVivaTourActive] = useState(false);
  const [vivaTourStep, setVivaTourStep] = useState(1);

  // Fetch Multi-Channel Notifications
  const fetchNotifications = async () => {
    try {
      const roleParam = currentRole === 'JUDGE' ? 'JUDGE' : (currentRole === 'CLERK' ? 'CLERK' : (currentRole === 'LITIGANT' ? 'LITIGANT' : 'ADVOCATE'));
      const emailParam = currentOfficer?.email || '';
      const res = await fetch(`${API_BASE}/notifications/?recipient_role=${roleParam}&recipient_email=${encodeURIComponent(emailParam)}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
      const sumRes = await fetch(`${API_BASE}/notifications/summary?recipient_role=${roleParam}&recipient_email=${encodeURIComponent(emailParam)}`);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setNotifSummary(sumData);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Dispatch Today's Hearing Alerts to Judges, Advocates & Litigants
  const handleDispatchHearingAlerts = async () => {
    setDispatchingNotifs(true);
    try {
      const res = await fetch(`${API_BASE}/notifications/dispatch-hearing-alerts`, {
        method: 'POST'
      });
      if (res.ok) {
        const result = await res.json();
        setNotifSuccessBanner(`⚡ Dispatched ${result.dispatched_count} multi-channel hearing alerts (${result.channels.in_app} In-App, ${result.channels.whatsapp} WhatsApp, ${result.channels.sms} SMS) across Court Halls!`);
        await fetchNotifications();
        setTimeout(() => setNotifSuccessBanner(null), 7000);
      }
    } catch (err) {
      console.error('Error dispatching hearing alerts:', err);
    } finally {
      setDispatchingNotifs(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllNotifsRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'POST' });
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Mark single notification read
  const handleMarkOneNotifRead = async (id) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setNotifSummary(prev => ({ ...prev, unread_count: Math.max(0, prev.unread_count - 1) }));
    } catch (err) {
      console.error(err);
    }
  };

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
  const loadCaseDossier = async (identifier, switchTab = true) => {
    if (!identifier) return;
    setLoadingDossier(true);
    setDossierError(null);
    if (switchTab) {
      setActiveTab('search');
    }
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

  // Switch Login Role Tab & Prefill Default Credentials
  const handleSwitchLoginRoleTab = (roleKey) => {
    setLoginRoleTab(roleKey);
    setLoginError(null);
    if (roleKey === 'CITIZEN') {
      setLoginEmail('citizen.public@mphc.gov.in');
      setLoginPassword('');
    } else if (roleKey === 'JUDGE') {
      setLoginEmail('judge.sharma@svvv-courts.gov.in');
      setLoginPassword('Judge@2026');
    } else if (roleKey === 'ADVOCATE') {
      setLoginEmail('adv.himanshu@barcouncil.org');
      setLoginPassword('Advocate@2026');
    } else if (roleKey === 'CLERK') {
      setLoginEmail('clerk.indore@svvv-courts.gov.in');
      setLoginPassword('Clerk@2026');
    } else if (roleKey === 'LITIGANT') {
      setLoginEmail('client.apex@commercial.in');
      setLoginPassword('Client@2026');
    }
  };

  // Get or refresh JWT Bearer Token
  const getAuthToken = async () => {
    if (authSession?.token) return authSession.token;
    try {
      const email = (currentRole === 'CITIZEN' || currentOfficer?.category === 'CITIZEN')
        ? 'judge.sharma@svvv-courts.gov.in'
        : (currentOfficer?.email || 'adv.himanshu@barcouncil.org');
      const pass = (currentRole === 'JUDGE' || currentOfficer?.category === 'JUDGE' || currentRole === 'CITIZEN' || currentOfficer?.category === 'CITIZEN')
        ? 'Judge@2026'
        : (currentRole === 'CLERK' || currentOfficer?.category === 'CLERK'
          ? 'Clerk@2026'
          : (currentRole === 'LITIGANT' || currentOfficer?.category === 'LITIGANT' ? 'Client@2026' : 'Advocate@2026'));
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (res.ok) {
        const d = await res.json();
        return d.access_token;
      }
    } catch (e) {
      console.error('Error fetching token:', e);
    }
    return null;
  };

  // Login Submission via API
  const handleLoginSubmit = async (e, customEmail = null, customPass = null, customRole = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const emailToUse = (customEmail || loginEmail || '').trim();
    const passToUse = (customPass || loginPassword || '').trim();
    if (!emailToUse || !passToUse) {
      setLoginError('Please enter both Email and Password to authenticate.');
      return;
    }

    setIsAuthenticating(true);
    setLoginError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, password: passToUse })
      });
      if (res.ok) {
        const data = await res.json();
        // data: { access_token, token_type, role, user_id, full_name }
        const matchedOfficer = officersList.find(o => o.email.toLowerCase() === emailToUse.toLowerCase()) || {
          email: emailToUse,
          full_name: data.full_name,
          role: data.role,
          category: data.role === 'ROLE_JUDGE' ? 'JUDGE' : (data.role === 'ROLE_CLERK' ? 'CLERK' : (data.role === 'ROLE_LITIGANT' ? 'LITIGANT' : 'ADVOCATE'))
        };
        const session = {
          token: data.access_token,
          role: data.role,
          full_name: data.full_name,
          email: emailToUse,
          user_id: data.user_id,
          officer: matchedOfficer
        };
        setAuthSession(session);
        try {
          localStorage.setItem('mphc_auth_session', JSON.stringify(session));
        } catch (e) {
          console.error(e);
        }
        setCurrentOfficer(matchedOfficer);

        // Adjust role & landing tab
        if (data.role === 'ROLE_JUDGE') {
          setCurrentRole('JUDGE');
          setActiveTab('matrix');
        } else if (data.role === 'ROLE_CLERK') {
          setCurrentRole('CLERK');
          setActiveTab('cases');
        } else if (data.role === 'ROLE_LITIGANT') {
          setCurrentRole('LITIGANT');
          setActiveTab('search');
          loadCaseDossier('MPIN01593559452026', false);
        } else {
          // Advocate
          if (customRole) {
            setCurrentRole(customRole);
          } else if (emailToUse === 'adv.verma@barcouncil.org') {
            setCurrentRole('ADVOCATE_DEFENDANT');
          } else {
            setCurrentRole('ADVOCATE_PLAINTIFF');
          }
          setActiveTab('matrix');
        }

        setShowLoginPage(false);
      } else {
        const err = await res.json().catch(() => ({}));
        setLoginError(err.detail || 'Authentication failed. Please verify role and credentials.');
      }
    } catch (err) {
      console.error('Login failure:', err);
      setLoginError('Could not connect to MP High Court authentication gateway (:8000).');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout and return to Login Gateway
  const handleLogout = () => {
    setAuthSession(null);
    try {
      localStorage.removeItem('mphc_auth_session');
    } catch (e) {}
    setShowLoginPage(true);
  };

  // Fetch Cases from API
  const loadCases = async () => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/cases/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setCases(data);
        if (data.length > 0 && !activeCase) {
          setActiveCase(data[0]);
          loadMatrix(data[0].id, token);
          loadCaseDossier(data[0].cnr_number, false);
        }
      }
    } catch (err) {
      console.error('Error loading cases:', err);
    }
  };

  // Check Backend Health
  const checkHealthAndLoad = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/health`);
      setBackendOnline(res.ok);
    } catch (e) {
      setBackendOnline(false);
    }
  };

  // Fetch Judicial Officers & Legal Counsels Directory
  const loadOfficers = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/officers`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map(dbUser => {
            const def = DEFAULT_OFFICERS.find(d => d.email === dbUser.email) || {};
            return {
              ...def,
              ...dbUser,
              category: dbUser.role === 'ROLE_JUDGE' ? 'JUDGE' : (dbUser.role === 'ROLE_CLERK' ? 'CLERK' : (dbUser.role === 'ROLE_LITIGANT' ? 'LITIGANT' : 'ADVOCATE'))
            };
          });
          setOfficersList(merged);
        }
      }
    } catch (err) {
      console.log('Using default officers roster:', err);
    }
  };

  // Select Official Identity / Persona
  const handleSelectOfficer = (officer, preferredStance = null) => {
    setCurrentOfficer(officer);
    const cat = officer.category || (officer.role === 'ROLE_JUDGE' ? 'JUDGE' : (officer.role === 'ROLE_CLERK' ? 'CLERK' : (officer.role === 'ROLE_LITIGANT' ? 'LITIGANT' : 'ADVOCATE')));
    if (cat === 'JUDGE') {
      setCurrentRole('JUDGE');
    } else if (cat === 'CLERK') {
      setCurrentRole('CLERK');
    } else if (cat === 'LITIGANT') {
      setCurrentRole('LITIGANT');
    } else if (cat === 'CITIZEN' || officer.role === 'ROLE_CITIZEN') {
      setCurrentRole('CITIZEN');
      setActiveTab('search');
    } else {
      // Advocate
      if (preferredStance) {
        setCurrentRole(preferredStance);
      } else if (officer.email === 'adv.verma@barcouncil.org') {
        setCurrentRole('ADVOCATE_DEFENDANT');
      } else {
        setCurrentRole(currentRole === 'ADVOCATE_DEFENDANT' ? 'ADVOCATE_DEFENDANT' : 'ADVOCATE_PLAINTIFF');
      }
    }
  };

  useEffect(() => {
    checkHealthAndLoad();
    loadCases();
    loadOfficers();
    fetchNotifications();
    const interval = setInterval(() => {
      checkHealthAndLoad();
      fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [currentRole, currentOfficer]);

  // Synchronize Theme (Light / Dark)
  useEffect(() => {
    try {
      localStorage.setItem('mphc_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    } catch (e) {
      console.error('Error saving theme preference:', e);
    }
  }, [theme]);

  // Fetch Admissions Matrix for active case
  const loadMatrix = async (caseId, passedToken = null) => {
    setLoadingMatrix(true);
    try {
      const token = passedToken || await getAuthToken();
      const res = await fetch(`${API_BASE}/admissions/${caseId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
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
      const token = await getAuthToken();
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
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/admissions/${activeCase.id}/lock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadMatrix(activeCase.id, token);
        alert('Order XV-A Fact Matrix locked successfully by Hon\'ble Presiding Judge! Undisputed facts are permanently frozen.');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to lock matrix: ${err.detail || 'Unauthorized'}`);
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
        body: JSON.stringify({ email: 'adv.himanshu@barcouncil.org', password: 'Advocate@2026' })
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
      console.error('Booking error:', e);
      alert('Network error connecting to scheduling engine.');
    }
  };

  // Cause List Fetcher
  const fetchDailyCauseList = async (dateStr = causeListDate, hallId = causeListHall) => {
    setLoadingCauseList(true);
    try {
      let url = `${API_BASE}/schedule/cause-list?`;
      if (dateStr) url += `hearing_date=${dateStr}&`;
      if (hallId && hallId !== 'ALL') url += `court_hall_id=${encodeURIComponent(hallId)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCauseListItems(data.items || []);
      }
    } catch (e) {
      console.error('Error fetching cause list:', e);
    } finally {
      setLoadingCauseList(false);
    }
  };

  // Update Session Status (e.g. IN_PROGRESS, CONCLUDED, ADJOURNED)
  const handleUpdateSessionStatus = async (sessionId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/schedule/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchDailyCauseList();
        if (activeCourtroomSession && activeCourtroomSession.session_id === sessionId) {
          setActiveCourtroomSession(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error('Error updating session status:', e);
    }
  };

  // Evaluates whether a virtual meeting / courtroom session is joinable right now under Order XV-A CPC
  const checkSessionJoinStatus = (session) => {
    if (!session) {
      return {
        is_joinable: false,
        join_status: 'INVALID',
        join_label: 'Unavailable',
        join_message: 'Hearing session details are not available.'
      };
    }

    // Interactive Demo / Guided Tour simulation
    if (session.id === 'DEMO-TOUR-SESSION' || session.is_demo) {
      return {
        is_joinable: true,
        join_status: 'IN_PROGRESS',
        join_label: tr('Join Virtual Hearing'),
        join_message: 'Simulated walkthrough hearing session.'
      };
    }

    // Concluded proceedings
    if (session.status === 'CONCLUDED') {
      return {
        is_joinable: false,
        join_status: 'CONCLUDED',
        join_label: tr('Hearing Concluded'),
        join_message: 'This judicial hearing has concluded under Order XV-A Rule 6 CPC. The virtual courtroom record is closed.'
      };
    }

    // Adjourned proceedings
    if (session.status === 'ADJOURNED') {
      return {
        is_joinable: false,
        join_status: 'ADJOURNED',
        join_label: tr('Adjourned'),
        join_message: 'This hearing has been adjourned to a future date by the Court.'
      };
    }

    // Actively marked IN_PROGRESS by the Judge / Court Master
    if (session.status === 'IN_PROGRESS') {
      return {
        is_joinable: true,
        join_status: 'IN_PROGRESS',
        join_label: tr('Join Live Hearing'),
        join_message: 'Court is actively in session. You may enter the virtual hearing.'
      };
    }

    // If backend already calculated joinability on this item
    if (typeof session.is_joinable === 'boolean') {
      return {
        is_joinable: session.is_joinable,
        join_status: session.join_status || (session.is_joinable ? 'LIVE_NOW' : 'UPCOMING'),
        join_label: session.join_label || (session.is_joinable ? tr('Join Virtual Hearing') : tr('Locked • Scheduled')),
        join_message: session.join_message || (session.is_joinable ? 'Scheduled hearing is active.' : 'Virtual courtroom is locked until scheduled time.')
      };
    }

    // Dynamic date & time calculation
    const hearingDateStr = session.hearing_date; // YYYY-MM-DD
    const startTimeStr = session.start_time; // HH:MM or HH:MM:SS
    const endTimeStr = session.end_time; // HH:MM or HH:MM:SS

    if (!hearingDateStr || !startTimeStr) {
      return {
        is_joinable: false,
        join_status: 'SCHEDULED',
        join_label: tr('Locked • Scheduled'),
        join_message: 'Hearing is scheduled but exact time is unconfirmed.'
      };
    }

    const now = new Date();
    const [y, m, d] = hearingDateStr.split('-').map(Number);
    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = (endTimeStr || '23:59').split(':').map(Number);

    const startDt = new Date(y, m - 1, d, startH, startM, 0);
    const endDt = new Date(y, m - 1, d, endH, endM, 0);
    const earlyAdmittance = new Date(startDt.getTime() - 15 * 60 * 1000); // 15 mins before
    const graceEnd = new Date(endDt.getTime() + 30 * 60 * 1000); // 30 mins after

    const isFuture = (new Date(y, m - 1, d)).setHours(0,0,0,0) > (new Date(now.getFullYear(), now.getMonth(), now.getDate())).setHours(0,0,0,0);
    const isPast = (new Date(y, m - 1, d)).setHours(0,0,0,0) < (new Date(now.getFullYear(), now.getMonth(), now.getDate())).setHours(0,0,0,0);

    if (isFuture) {
      const dateFormatted = `${d.toString().padStart(2, '0')} ${startDt.toLocaleString('en-US', { month: 'short' })}`;
      return {
        is_joinable: false,
        join_status: 'UPCOMING',
        join_label: `${tr('Locked • Scheduled')} (${dateFormatted})`,
        join_message: `Virtual courtroom is locked. Scheduled for ${dateFormatted} at ${startTimeStr.slice(0, 5)}. Under Order XV-A CPC, participants may only join at the scheduled time.`
      };
    }

    if (isPast) {
      return {
        is_joinable: false,
        join_status: 'EXPIRED',
        join_label: tr('Slot Ended'),
        join_message: `The scheduled hearing date (${hearingDateStr}) has passed. Virtual courtroom access is closed.`
      };
    }

    // It's today!
    if (now < earlyAdmittance) {
      const minsRemaining = Math.max(1, Math.round((earlyAdmittance - now) / 60000));
      return {
        is_joinable: false,
        join_status: 'TOO_EARLY',
        join_label: `Opens ${startTimeStr.slice(0, 5)}`,
        join_message: `Virtual courtroom opens 15 minutes prior to scheduled start. Scheduled for ${startTimeStr.slice(0, 5)} (opens in ~${minsRemaining} min). Under Order XV-A CPC rules, participants may only join at the scheduled time.`
      };
    }

    if (now > graceEnd) {
      return {
        is_joinable: false,
        join_status: 'SLOT_PASSED',
        join_label: tr('Slot Ended'),
        join_message: `The scheduled time slot (${startTimeStr.slice(0, 5)} - ${endTimeStr.slice(0, 5)}) has ended. Access to this virtual courtroom is closed.`
      };
    }

    // In active window
    return {
      is_joinable: true,
      join_status: 'LIVE_NOW',
      join_label: tr('Join Virtual Hearing'),
      join_message: 'Scheduled hearing window is active. You may join the virtual hearing.'
    };
  };

  // Open WebRTC Virtual Courtroom with strict Order XV-A admittance enforcement
  const handleOpenCourtroom = (session) => {
    if (!session) return;

    const joinEval = checkSessionJoinStatus(session);
    if (!joinEval.is_joinable) {
      setAdmittanceNotice({
        session,
        ...joinEval
      });
      return;
    }

    // Extra server verification check if session_id is available
    if (session.session_id) {
      fetch(`${API_BASE}/schedule/sessions/${session.session_id}/verify-join`)
        .then(res => res.json())
        .then(data => {
          if (data && data.is_joinable === false) {
            setAdmittanceNotice({
              session,
              ...data
            });
            setActiveCourtroomSession(null);
          }
        })
        .catch(e => console.warn('Server join verification fallback:', e));
    }

    setActiveCourtroomSession(session);
    setIsMicMuted(false);
    setIsVideoOff(false);
    setIsSharingScreen(false);
    setCourtroomViewMode('grid');
  };

  // Calculate Statutory Court Fees
  const handleCalculateFee = async (val = claimValInput) => {
    setCalculatingFee(true);
    try {
      const res = await fetch(`${API_BASE}/echallan/calculate-fee?claim_valuation=${val}`);
      if (res.ok) {
        const data = await res.json();
        setFeeBreakdown(data);
        setChallanAmount(String(data.total_payable_fee));
      }
    } catch (e) {
      console.error('Fee calculation error:', e);
    } finally {
      setCalculatingFee(false);
    }
  };

  // Fetch e-Challans
  const fetchChallans = async () => {
    setLoadingChallans(true);
    try {
      const res = await fetch(`${API_BASE}/echallan/list?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setChallanList(data);
      }
    } catch (e) {
      console.error('Error fetching challans:', e);
    } finally {
      setLoadingChallans(false);
    }
  };

  // Create e-Challan
  const handleCreateChallan = async () => {
    if (!challanPayerName || !challanAmount) {
      alert('Please enter payer name and fee amount.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/echallan/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer_name: challanPayerName,
          payer_email: challanPayerEmail || (currentOfficer?.email || 'litigant@svvv.courts.gov.in'),
          payer_role: currentRole || 'ADVOCATE',
          head_of_account: challanHead,
          amount: parseFloat(challanAmount),
          cnr_number: challanCnr || (activeCase?.cnr_number || null),
          bench_id: activeBench === 'INDORE' ? 'BENCH_INDORE_COMM_01' : (activeBench === 'JABALPUR' ? 'BENCH_JABALPUR_COMM_01' : 'BENCH_GWALIOR_COMM_01'),
          court_hall_id: 'HALL_04'
        })
      });
      if (res.ok) {
        const data = await res.json();
        fetchChallans();
        setChallanSuccessReceipt(data);
        alert(`Official e-Challan Generated: ${data.challan_number}`);
      }
    } catch (e) {
      console.error('Error creating challan:', e);
    }
  };

  // Pay e-Challan
  const handlePayChallan = async (challanId) => {
    setPayingChallanId(challanId);
    try {
      const res = await fetch(`${API_BASE}/echallan/${challanId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_mode: 'SBI_EPAY', bank_name: 'State Bank of India' })
      });
      if (res.ok) {
        const data = await res.json();
        setChallanSuccessReceipt(data);
        fetchChallans();
        alert(`Payment Confirmed by Cyber Treasury MP! Transaction Ref: ${data.transaction_ref}\nReceipt SHA-256: ${data.receipt_sha256}`);
      }
    } catch (e) {
      console.error('Payment error:', e);
    } finally {
      setPayingChallanId(null);
    }
  };

  // Verify e-Challan
  const handleVerifyChallan = async () => {
    if (!verifyChallanQuery.trim()) return;
    setVerifyingChallan(true);
    setVerifyChallanError(null);
    setVerifiedChallanData(null);
    try {
      const res = await fetch(`${API_BASE}/echallan/verify/${encodeURIComponent(verifyChallanQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setVerifiedChallanData(data);
      } else {
        setVerifyChallanError('No matching Cyber Treasury record found for this Challan Number or SHA-256 hash.');
      }
    } catch (e) {
      setVerifyChallanError('Unable to connect to Cyber Treasury verification service.');
    } finally {
      setVerifyingChallan(false);
    }
  };

  // Load initial Cause List & Challan data
  useEffect(() => {
    fetchDailyCauseList();
    fetchChallans();
    handleCalculateFee('4500000');
  }, []);

  // If user is not authenticated or clicked "Logout / Switch Portal", render MP High Court Login Gateway
  if (showLoginPage) {
    return (
      <div className={`mphc-portal-app ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`} data-theme={theme}>
        {/* Top Utility Accessibility Bar on Login Gateway (Always in English) */}
        <div className="mphc-top-bar">
          <div className="mphc-top-left">
            <span className="emblem-flag">
              🇮🇳 भारत सरकार / Govt. of India
            </span>
            <span className="sep">|</span>
            <span>High Court of Madhya Pradesh • मध्य प्रदेश उच्च न्यायालय</span>
            <span className="sep">|</span>
            <span style={{ color: '#f59e0b' }}>NJDG Partner</span>
          </div>

          <div className="mphc-top-right">
            {/* Theme Switcher */}
            <div className="theme-toggle-group" title="Toggle Light / Dark Theme">
              <button 
                type="button" 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                title="Switch to Light Theme"
              >
                <Sun size={12} />
                <span>Light</span>
              </button>
              <button 
                type="button" 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Switch to Dark Theme"
              >
                <Moon size={12} />
                <span>Dark</span>
              </button>
            </div>
            <span className="sep">|</span>

            {/* Font Resizing Controls */}
            <div className="font-size-ctrls" title="Adjust text size">
              <button 
                type="button" 
                className={`font-btn ${fontSizeLevel === -1 ? 'active' : ''}`}
                onClick={() => setFontSizeLevel(-1)}
                title="Decrease Font Size (A-)"
                aria-label="Decrease Font Size"
              >
                A-
              </button>
              <button 
                type="button" 
                className={`font-btn ${fontSizeLevel === 0 ? 'active' : ''}`}
                onClick={() => setFontSizeLevel(0)}
                title="Reset Font Size (A)"
                aria-label="Reset Font Size"
              >
                A
              </button>
              <button 
                type="button" 
                className={`font-btn ${fontSizeLevel === 1 ? 'active' : ''}`}
                onClick={() => setFontSizeLevel(1)}
                title="Increase Font Size (A+)"
                aria-label="Increase Font Size"
              >
                A+
              </button>
            </div>
            <span className="sep">|</span>

            {/* Bilingual Switcher */}
            <div className="lang-toggle-group">
              <button 
                type="button" 
                className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
                onClick={() => setLang('EN')}
              >
                English
              </button>
              <button 
                type="button" 
                className={`lang-btn ${lang === 'HI' ? 'active' : ''}`}
                onClick={() => setLang('HI')}
              >
                हिन्दी
              </button>
            </div>
            <span className="sep">|</span>

            {/* Backend Online Badge */}
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              background: backendOnline ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)',
              border: `1px solid ${backendOnline ? '#059669' : '#dc2626'}`,
              color: backendOnline ? '#34d399' : '#f87171',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              <span style={{ 
                width: '7px', 
                height: '7px', 
                borderRadius: '50%', 
                backgroundColor: backendOnline ? '#10b981' : '#ef4444' 
              }}></span>
              {backendOnline ? 'FastAPI 0.110 Online (:8000)' : 'Backend Offline'}
            </span>
          </div>
        </div>

        {/* Login Page Hero Strip & Authentication Card */}
        <div className="mphc-login-page">
          <div className="login-hero-strip">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <MpHcEmblem size={75} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {tr('मध्य प्रदेश उच्च न्यायालय • जबलपुर / इन्दौर / ग्वालियर')}
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em', margin: '0.2rem 0' }}>
                  {tr('HIGH COURT OF MADHYA PRADESH')}
                </h1>
                <div style={{ fontSize: '0.85rem', color: '#e4e4e7', fontWeight: 600 }}>
                  {lang === 'HI' 
                    ? 'वाणिज्यिक प्रभाग वाद प्रबंधन ई-पोर्टल (आदेश XV-A सिविल प्रक्रिया संहिता, १९०८)'
                    : 'Commercial Division Case Management e-Portal (Order XV-A Code of Civil Procedure, 1908)'}
                </div>
              </div>
            </div>
          </div>

          <div className="login-content-wrapper">
            <div className="login-portal-card">
              {/* Card Header */}
              <div className="login-portal-header">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.4)', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  <ShieldCheck size={14} />
                  {tr('Role-Based Authentication Gateway')}
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--theme-text-primary)' }}>
                  {tr('Official Judicial & Legal Single Sign-On')}
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--theme-text-secondary)', margin: 0, maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {lang === 'EN' 
                    ? 'Role-specific gateway: Hon\'ble Judges, Bar Advocates, Registry Clerks, and Commercial Litigants access strictly authorized case files and tools.'
                    : 'पद-आधारित सुरक्षित प्रवेश: माननीय न्यायाधीश, बार अधिवक्ता, रजिस्ट्री वाचक एवं वाणिज्यिक वादकारी केवल अपने अधिकार क्षेत्र की जानकारी देख सकते हैं।'}
                </p>
              </div>

              {/* 5 Role Selector Tabs - Public Citizen FIRST */}
              <div className="login-role-selector-grid">
                <button 
                  type="button"
                  className={`role-select-tab-btn ${loginRoleTab === 'CITIZEN' ? 'active' : ''}`}
                  onClick={() => handleSwitchLoginRoleTab('CITIZEN')}
                >
                  <div className="role-tab-icon" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#0d9488' }}>
                    <Globe size={22} />
                  </div>
                  <div className="role-tab-text">
                    <div className="role-tab-title">{lang === 'HI' ? 'जनसाधारण नागरिक' : 'Public Citizen'}</div>
                    <div className="role-tab-subtitle">{tr('Open Justice & Public Dockets')}</div>
                  </div>
                </button>

                <button 
                  type="button"
                  className={`role-select-tab-btn ${loginRoleTab === 'JUDGE' ? 'active' : ''}`}
                  onClick={() => handleSwitchLoginRoleTab('JUDGE')}
                >
                  <div className="role-tab-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>
                    <Gavel size={22} />
                  </div>
                  <div className="role-tab-text">
                    <div className="role-tab-title">{lang === 'HI' ? 'माननीय न्यायाधीश' : "Hon'ble Judge"}</div>
                    <div className="role-tab-subtitle">{tr('Issue Framing & Order XV-A Lock')}</div>
                  </div>
                </button>

                <button 
                  type="button"
                  className={`role-select-tab-btn ${loginRoleTab === 'ADVOCATE' ? 'active' : ''}`}
                  onClick={() => handleSwitchLoginRoleTab('ADVOCATE')}
                >
                  <div className="role-tab-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
                    <Scale size={22} />
                  </div>
                  <div className="role-tab-text">
                    <div className="role-tab-title">{tr('Bar Advocate')}</div>
                    <div className="role-tab-subtitle">{tr('E-Pleadings & Admissions Matrix')}</div>
                  </div>
                </button>

                <button 
                  type="button"
                  className={`role-select-tab-btn ${loginRoleTab === 'CLERK' ? 'active' : ''}`}
                  onClick={() => handleSwitchLoginRoleTab('CLERK')}
                >
                  <div className="role-tab-icon" style={{ background: 'rgba(5, 150, 105, 0.15)', color: '#059669' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div className="role-tab-text">
                    <div className="role-tab-title">{tr('Court Clerk / Reader')}</div>
                    <div className="role-tab-subtitle">{tr('Hall 04 Display & Cause Lists')}</div>
                  </div>
                </button>

                <button 
                  type="button"
                  className={`role-select-tab-btn ${loginRoleTab === 'LITIGANT' ? 'active' : ''}`}
                  onClick={() => handleSwitchLoginRoleTab('LITIGANT')}
                >
                  <div className="role-tab-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed' }}>
                    <Briefcase size={22} />
                  </div>
                  <div className="role-tab-text">
                    <div className="role-tab-title">{tr('Commercial Litigant')}</div>
                    <div className="role-tab-subtitle">{tr('Dispute Tracking & Certified CMO')}</div>
                  </div>
                </button>
              </div>

              {/* 2-Column Grid: Form + Quick Demo Profiles */}
              <div className="login-card-body-grid">
                {/* Left Column: Official Authentication Form */}
                <div className="login-form-pane">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--theme-border)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--theme-text-primary)', textTransform: 'uppercase' }}>
                      {loginRoleTab === 'CITIZEN' && (lang === 'HI' ? '🌐 खुली अदालत जनसाधारण पोर्टल' : '🌐 Open Courts Public Citizen Portal')}
                      {loginRoleTab === 'JUDGE' && (lang === 'HI' ? '⚖️ न्यायिक अधिकारी प्रवेश' : '⚖️ Judicial Officer Access')}
                      {loginRoleTab === 'ADVOCATE' && (lang === 'HI' ? '🏛️ नामांकित बार अधिवक्ता प्रवेश' : '🏛️ Enrolled Bar Advocate Access')}
                      {loginRoleTab === 'CLERK' && (lang === 'HI' ? '🛡️ न्यायालय कक्ष रजिस्ट्री वाचक' : '🛡️ Court Hall Registry Reader')}
                      {loginRoleTab === 'LITIGANT' && (lang === 'HI' ? '👤 वाणिज्यिक कॉर्पोरेट वादकारी' : '👤 Commercial Corporate Litigant')}
                    </span>
                    <span className={`personal-badge-role role-badge-${loginRoleTab.toLowerCase()}`}>
                      {tr(loginRoleTab === 'JUDGE' ? 'Judge' : (loginRoleTab === 'CLERK' ? 'Clerk' : (loginRoleTab === 'LITIGANT' ? 'Litigant' : (loginRoleTab === 'CITIZEN' ? 'Citizen' : 'Advocate'))))}
                    </span>
                  </div>

                  {loginRoleTab === 'CITIZEN' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.35rem 0' }}>
                      <div style={{ background: 'rgba(20, 184, 166, 0.08)', border: '1.5px solid rgba(20, 184, 166, 0.35)', borderRadius: '10px', padding: '1.15rem', color: 'var(--theme-text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                          <div style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#0d9488', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={16} />
                          </div>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                            {tr('Open Courts Principle (Article 145(4) of Constitution)')}
                          </h4>
                        </div>
                        <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.82rem', lineHeight: 1.55, color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' 
                            ? 'भारत के संविधान एवं ई-कोर्ट्स राष्ट्रीय पहल चरण III के तहत, न्याय आम जनता के लिए खुला है। नागरिक, पत्रकार, शोधकर्ता या छात्र के रूप में, सार्वजनिक वाद अभिलेख देखने के लिए आपको किसी पासवर्ड की आवश्यकता नहीं है।'
                            : 'Under the Constitution of India and e-Courts National Initiative Phase III, justice is open to the public. As a citizen, journalist, researcher, or student, you do not require login credentials or a password to view public case records.'}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0d9488', fontWeight: 600 }}>
                            <CheckCircle2 size={13} />
                            <span>{lang === 'HI' ? 'सार्वभौमिक १६-अंकीय सीएनआर खोज' : 'Universal 16-Digit CNR Lookup'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0d9488', fontWeight: 600 }}>
                            <CheckCircle2 size={13} />
                            <span>{lang === 'HI' ? 'न्यायालय कक्ष ०४ लाइव ई-बोर्ड' : 'Court Hall 04 Live e-Board'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0d9488', fontWeight: 600 }}>
                            <CheckCircle2 size={13} />
                            <span>{lang === 'HI' ? 'आदेश XV-A तथ्य मैट्रिक्स ऑडिट' : 'Order XV-A Fact Matrix Audit'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0d9488', fontWeight: 600 }}>
                            <CheckCircle2 size={13} />
                            <span>{lang === 'HI' ? 'प्रमाणित सीएमओ डिक्री' : 'Certified CMO Decrees'}</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="login-submit-btn"
                        style={{
                          background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
                          fontSize: '0.92rem',
                          padding: '0.85rem'
                        }}
                        onClick={() => {
                          const cit = officersList.find(o => o.category === 'CITIZEN' || o.role === 'ROLE_CITIZEN') || DEFAULT_OFFICERS[0];
                          setCurrentOfficer(cit);
                          setCurrentRole('CITIZEN');
                          setActiveTab('search');
                          setShowLoginPage(false);
                          loadCaseDossier('MPIN01593559452026', false);
                        }}
                      >
                        <Globe size={18} />
                        <span>{tr('Enter Public Citizen Portal (जनसाधारण पोर्टल) ➔')}</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {loginError && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                          <span>{loginError}</span>
                        </div>
                      )}

                      <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="login-form-group">
                          <label>
                            <span>{loginRoleTab === 'LITIGANT' ? tr('Litigant Representative Email') : (loginRoleTab === 'JUDGE' ? tr('Official Judicial Email') : tr('High Court / Bar Email'))}</span>
                          </label>
                          <div className="login-input-wrapper">
                            <Mail size={16} className="login-input-icon" />
                            <input 
                              type="email" 
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder={lang === 'HI' ? 'उदा. officer@svvv-courts.gov.in' : 'e.g., officer@svvv-courts.gov.in'}
                              required
                            />
                          </div>
                        </div>

                        <div className="login-form-group">
                          <label>
                            <span>{tr('Password / DSC Token PIN')}</span>
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ background: 'none', border: 'none', color: '#b45309', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                              {showPassword ? tr('Hide PIN') : tr('Show PIN')}
                            </button>
                          </label>
                          <div className="login-input-wrapper">
                            <Lock size={16} className="login-input-icon" />
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder={lang === 'HI' ? 'पासवर्ड दर्ज करें...' : 'Enter password...'}
                              required
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--theme-text-secondary)' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle2 size={13} color="#22c55e" />
                            <span>{tr('2048-bit RSA DSC Verified')}</span>
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>IT Act 2000 § 65B</span>
                        </div>

                        <button 
                          type="submit" 
                          className="login-submit-btn"
                          disabled={isAuthenticating}
                        >
                          {isAuthenticating ? (
                            <>
                              <RefreshCw size={16} className="spin-icon" />
                              <span>{lang === 'HI' ? 'टोकन एवं सील का सत्यापन हो रहा है...' : 'Verifying Token & Cryptographic Seal...'}</span>
                            </>
                          ) : (
                            <>
                              <LogIn size={16} />
                              <span>
                                {lang === 'HI' 
                                  ? 'लॉग इन करें: ' + (loginRoleTab === 'JUDGE' ? 'न्यायिक पीठ' : (loginRoleTab === 'CLERK' ? 'रजिस्ट्री वाचक पटल' : (loginRoleTab === 'LITIGANT' ? 'वादकारी डैशबोर्ड' : 'अधिवक्ता पोर्टल')))
                                  : 'Log In to ' + (loginRoleTab === 'JUDGE' ? 'Judicial Bench' : (loginRoleTab === 'CLERK' ? 'Registry Workspace' : (loginRoleTab === 'LITIGANT' ? 'Litigant Dashboard' : 'Advocate Portal')))}
                              </span>
                            </>
                          )}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const cit = officersList.find(o => o.category === 'CITIZEN' || o.role === 'ROLE_CITIZEN') || DEFAULT_OFFICERS[0];
                              setCurrentOfficer(cit);
                              setCurrentRole('CITIZEN');
                              setActiveTab('search');
                              setShowLoginPage(false);
                              loadCaseDossier('MPIN01593559452026', false);
                            }}
                            style={{ background: 'none', border: 'none', color: '#b45309', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {tr('Continue as Public Case Inquirer / Guest ➔')}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>

                {/* Right Column: 1-Click Quick Demo Sign-In */}
                <div className="quick-credentials-pane">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <Sparkles size={14} />
                    <span>{tr('Instant 1-Click Demo Logins')}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary)', margin: 0 }}>
                    {tr('Click any role below to log in instantly and test their filtered view:')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {/* 1. Public Citizen (FIRST!) */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      style={{ borderLeft: '3px solid #0d9488', background: 'rgba(20, 184, 166, 0.06)' }}
                      onClick={() => {
                        const cit = officersList.find(o => o.category === 'CITIZEN' || o.role === 'ROLE_CITIZEN') || DEFAULT_OFFICERS[0];
                        setCurrentOfficer(cit);
                        setCurrentRole('CITIZEN');
                        setActiveTab('search');
                        setShowLoginPage(false);
                        loadCaseDossier('MPIN01593559452026', false);
                      }}
                    >
                      <div className="personal-avatar-box personal-avatar-citizen" style={{ width: '32px', height: '32px' }}>
                        <Globe size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706' }}>
                          {lang === 'HI' ? 'जनसाधारण नागरिक (खुली अदालत)' : 'Public Citizen / जनसाधारण (Open Courts)'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'खुली न्याय प्रणाली • किसी क्रेडेंशियल की आवश्यकता नहीं' : 'Open Justice • No Credentials Required'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d9488' }}>🌐 {tr('Citizen')}</span>
                    </button>

                    {/* 2. Judge */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      onClick={() => handleLoginSubmit(null, 'judge.sharma@svvv-courts.gov.in', 'Judge@2026', 'JUDGE')}
                    >
                      <div className="personal-avatar-box personal-avatar-judge" style={{ width: '32px', height: '32px' }}>
                        <Gavel size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706' }}>
                          {lang === 'HI' ? 'माननीय न्यायमूर्ति राजेश शर्मा' : "Hon'ble Justice Rajesh Sharma"}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'वरिष्ठ न्यायाधीश • इन्दौर वाणिज्यिक प्रभाग' : 'Senior Judge • Indore Commercial Division'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b' }}>⚖️ {tr('Judge')}</span>
                    </button>

                    {/* 3. Advocate Plaintiff */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      onClick={() => handleLoginSubmit(null, 'adv.himanshu@barcouncil.org', 'Advocate@2026', 'ADVOCATE_PLAINTIFF')}
                    >
                      <div className="personal-avatar-box personal-avatar-advocate" style={{ width: '32px', height: '32px' }}>
                        <Scale size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>
                          {lang === 'HI' ? 'अधिवक्ता हिमांशु बावनिया' : 'Adv. Himanshu Bawaniya'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'वादी विधिक अधिवक्ता • एपेक्स इन्फोटेक' : 'Plaintiff Legal Counsel • Apex Infotech'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7' }}>🏛️ {tr('Advocate')}</span>
                    </button>

                    {/* 4. Advocate Defendant */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      onClick={() => handleLoginSubmit(null, 'adv.verma@barcouncil.org', 'Advocate@2026', 'ADVOCATE_DEFENDANT')}
                    >
                      <div className="personal-avatar-box personal-avatar-advocate" style={{ width: '32px', height: '32px' }}>
                        <Scale size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7c3aed' }}>
                          {lang === 'HI' ? 'अधिवक्ता प्रिया वर्मा' : 'Adv. Priya Verma'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'प्रतिवादी विधिक अधिवक्ता • हॉराइजन लॉजिस्टिक्स' : 'Defendant Legal Counsel • Horizon Logistics'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed' }}>🏛️ {tr('Advocate')}</span>
                    </button>

                    {/* 5. Court Clerk */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      onClick={() => handleLoginSubmit(null, 'clerk.indore@svvv-courts.gov.in', 'Clerk@2026', 'CLERK')}
                    >
                      <div className="personal-avatar-box personal-avatar-clerk" style={{ width: '32px', height: '32px' }}>
                        <ShieldCheck size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>
                          {lang === 'HI' ? 'न्यायालय वाचक सुनीता राव' : 'Court Clerk Sunita Rao'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'न्यायालय कक्ष ०४ रजिस्ट्री वाचक' : 'Court Hall 04 Registry Reader'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669' }}>🛡️ {tr('Clerk')}</span>
                    </button>

                    {/* 6. Client Apex Infotech */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      onClick={() => handleLoginSubmit(null, 'client.apex@commercial.in', 'Client@2026', 'LITIGANT')}
                    >
                      <div className="personal-avatar-box personal-avatar-litigant" style={{ width: '32px', height: '32px' }}>
                        <Briefcase size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6d28d9' }}>
                          {lang === 'HI' ? 'राजीव सिंघानिया (वादकारी)' : 'Rajiv Singhania (Client)'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'निदेशक, एपेक्स इन्फोटेक लिमिटेड (वादी)' : 'Director, Apex Infotech Ltd. (Plaintiff)'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6' }}>👤 {tr('Litigant')}</span>
                    </button>

                    {/* 7. Client Horizon Logistics */}
                    <button 
                      type="button" 
                      className="quick-demo-btn"
                      onClick={() => handleLoginSubmit(null, 'client.horizon@logistics.in', 'Client@2026', 'LITIGANT')}
                    >
                      <div className="personal-avatar-box personal-avatar-litigant" style={{ width: '32px', height: '32px' }}>
                        <Briefcase size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6d28d9' }}>
                          {lang === 'HI' ? 'कर्नल हरप्रीत सिंह (वादकारी)' : 'Col. Harpreet Singh (Client)'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-secondary)' }}>
                          {lang === 'HI' ? 'निदेशक, हॉराइजन लॉजिस्टिक्स (प्रतिवादी)' : 'Director, Horizon Logistics (Defendant)'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6' }}>👤 {tr('Litigant')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ padding: '0.85rem 1.75rem', background: 'var(--theme-card-bg)', borderTop: '1px solid var(--theme-border)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--theme-text-secondary)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>🔒 {tr('Protected under Information Technology Act, 2000 & MP High Court e-Filing Rules')}</span>
                <span className="mono">{tr('Govt. of MP • SVVV Judicial Tech Partner')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mphc-portal-app ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`} data-theme={theme}>
      {/* 1. Top Utility Accessibility Bar (Always in English) */}
      <div className="mphc-top-bar">
        <div className="mphc-top-left">
          <span className="emblem-flag">
            🇮🇳 भारत सरकार / Govt. of India
          </span>
          <span className="sep">|</span>
          <span>High Court of Madhya Pradesh • मध्य प्रदेश उच्च न्यायालय</span>
          <span className="sep">|</span>
          <span style={{ color: '#f59e0b' }}>NJDG Partner</span>
        </div>

        <div className="mphc-top-right">
          <button 
            type="button" 
            className="mphc-skip-link"
            onClick={() => {
              const el = document.querySelector('.tabs-nav');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Skip to Content
          </button>
          <span className="sep">|</span>

          {/* Theme Switcher (Light / Dark) */}
          <div className="theme-toggle-group" title="Toggle Light / Dark Theme">
            <button 
              type="button" 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Switch to Light Theme"
            >
              <Sun size={12} />
              <span>Light</span>
            </button>
            <button 
              type="button" 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Switch to Dark Theme"
            >
              <Moon size={12} />
              <span>Dark</span>
            </button>
          </div>
          <span className="sep">|</span>

          {/* Font Resizing Controls */}
          <div className="font-size-ctrls" title="Adjust text size">
            <button 
              type="button" 
              className={`font-btn ${fontSizeLevel === -1 ? 'active' : ''}`}
              onClick={() => setFontSizeLevel(-1)}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              type="button" 
              className={`font-btn ${fontSizeLevel === 0 ? 'active' : ''}`}
              onClick={() => setFontSizeLevel(0)}
              title="Reset Font Size"
            >
              A
            </button>
            <button 
              type="button" 
              className={`font-btn ${fontSizeLevel === 1 ? 'active' : ''}`}
              onClick={() => setFontSizeLevel(1)}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
          <span className="sep">|</span>

          {/* Bilingual Switcher */}
          <div className="lang-toggle-group">
            <button 
              type="button" 
              className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
              onClick={() => setLang('EN')}
            >
              English
            </button>
            <button 
              type="button" 
              className={`lang-btn ${lang === 'HI' ? 'active' : ''}`}
              onClick={() => setLang('HI')}
            >
              हिन्दी
            </button>
          </div>
          <span className="sep">|</span>

          {/* Multi-Channel Notification Bell & Dropdown */}
          <div className="notif-bell-container">
            <button 
              type="button" 
              className="mphc-notif-btn"
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                fetchNotifications();
              }}
              title="Today's Hearing Schedule Alerts (Judges, Advocates, Litigants)"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: notifDropdownOpen ? 'rgba(217, 119, 6, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                border: notifDropdownOpen ? '1px solid #d97706' : '1px solid rgba(255, 255, 255, 0.2)',
                color: notifSummary.unread_count > 0 ? '#f59e0b' : '#ffffff',
                borderRadius: '6px',
                padding: '0.22rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Bell size={12} />
              <span>{tr("Alerts")}</span>
              {notifSummary.unread_count > 0 && (
                <span className="notif-badge-pill">
                  {notifSummary.unread_count}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="notif-dropdown-menu">
                <div className="notif-dropdown-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', color: '#ffffff' }}>
                      <Bell size={14} color="#d97706" />
                      <span>{tr("Multi-Channel Hearing Alerts (Order V CPC)")}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      SMS Gateway • WhatsApp API • In-App Cause Notices
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button 
                      type="button" 
                      onClick={handleDispatchHearingAlerts}
                      disabled={dispatchingNotifs}
                      style={{
                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title="Scan today's scheduled hearings and dispatch notifications across all channels"
                    >
                      <Send size={11} />
                      <span>{dispatchingNotifs ? 'Dispatching...' : tr("Dispatch Today's Hearing Alerts")}</span>
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={handleMarkAllNotifsRead}
                      style={{
                        background: '#334155',
                        color: '#cbd5e1',
                        border: '1px solid #3f3f46',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {tr("Mark All Read")}
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="notif-filter-tabs">
                  <button 
                    className={`notif-filter-tab ${notifFilterChannel === 'ALL' ? 'active' : ''}`}
                    onClick={() => setNotifFilterChannel('ALL')}
                  >
                    {tr("All Channels")} ({notifications.length})
                  </button>
                  <button 
                    className={`notif-filter-tab ${notifFilterChannel === 'WHATSAPP' ? 'active' : ''}`}
                    onClick={() => setNotifFilterChannel('WHATSAPP')}
                  >
                    💬 WhatsApp ({notifications.filter(n => n.channel === 'WHATSAPP').length})
                  </button>
                  <button 
                    className={`notif-filter-tab ${notifFilterChannel === 'SMS' ? 'active' : ''}`}
                    onClick={() => setNotifFilterChannel('SMS')}
                  >
                    📱 SMS ({notifications.filter(n => n.channel === 'SMS').length})
                  </button>
                  <button 
                    className={`notif-filter-tab ${notifFilterChannel === 'IN_APP' ? 'active' : ''}`}
                    onClick={() => setNotifFilterChannel('IN_APP')}
                  >
                    🔔 In-App ({notifications.filter(n => n.channel === 'IN_APP').length})
                  </button>
                </div>

                {/* Notifications List */}
                <div className="notif-list-container">
                  {notifications
                    .filter(n => notifFilterChannel === 'ALL' || n.channel === notifFilterChannel)
                    .length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a', fontSize: '0.8rem' }}>
                        No notifications in this channel. Click "Dispatch Today's Hearing Alerts" to generate live notices for Court Hall hearings!
                      </div>
                    ) : (
                      notifications
                        .filter(n => notifFilterChannel === 'ALL' || n.channel === notifFilterChannel)
                        .map(n => (
                          <div key={n.id} className={`notif-item-card ${!n.is_read ? 'unread' : ''}`}>
                            <div style={{ flexShrink: 0, marginTop: '2px' }}>
                              {n.channel === 'WHATSAPP' && (
                                <span className="notif-channel-badge channel-whatsapp">
                                  <MessageSquare size={10} /> WA
                                </span>
                              )}
                              {n.channel === 'SMS' && (
                                <span className="notif-channel-badge channel-sms">
                                  <Smartphone size={10} /> SMS
                                </span>
                              )}
                              {n.channel === 'IN_APP' && (
                                <span className="notif-channel-badge channel-inapp">
                                  <Bell size={10} /> APP
                                </span>
                              )}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f4f4f5' }}>
                                  {n.title}
                                </span>
                                <span style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>
                                  {n.hearing_time || new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                                {n.message}
                              </p>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                  To: <strong style={{ color: '#fde68a' }}>{n.recipient_name}</strong> ({n.recipient_role})
                                </span>

                                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                  {n.webrtc_room_id && (
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        handleOpenCourtroom({
                                          id: n.case_id || 'DEMO-SESSION',
                                          court_hall_id: n.court_hall_id || 'HALL_04',
                                          webrtc_room_id: n.webrtc_room_id,
                                          hearing_date: causeListDate,
                                          start_time: n.hearing_time || '10:30',
                                          end_time: '11:15',
                                          case: { cnr_number: n.cnr_number, case_title: n.title }
                                        });
                                        setNotifDropdownOpen(false);
                                      }}
                                      style={{
                                        background: 'rgba(16, 185, 129, 0.2)',
                                        color: '#34d399',
                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                        borderRadius: '4px',
                                        padding: '0.15rem 0.4rem',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                      }}
                                    >
                                      <Video size={10} /> Join Hearing
                                    </button>
                                  )}

                                  {!n.is_read && (
                                    <button 
                                      type="button" 
                                      onClick={() => handleMarkOneNotifRead(n.id)}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#94a3b8',
                                        fontSize: '0.65rem',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                      }}
                                    >
                                      Mark Read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                </div>
              </div>
            )}
          </div>
          <span className="sep">|</span>

          {/* 🎬 Viva Demo Tour Button */}
          <button
            type="button"
            onClick={() => {
              setVivaTourActive(true);
              setVivaTourStep(1);
              setActiveTab('causelist');
              fetchDailyCauseList();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.22rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
            }}
            title="Interactive viva presentation tour for external examiners"
          >
            <Compass size={12} />
            <span>{tr("🎬 Viva Demo Tour")}</span>
          </button>
          <span className="sep">|</span>

          {/* Backend Online Badge */}
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: backendOnline ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)',
            border: `1px solid ${backendOnline ? '#059669' : '#dc2626'}`,
            color: backendOnline ? '#34d399' : '#f87171',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700
          }}>
            <span style={{ 
              width: '7px', 
              height: '7px', 
              borderRadius: '50%', 
              backgroundColor: backendOnline ? '#10b981' : '#ef4444' 
            }}></span>
            {backendOnline ? 'FastAPI 0.110 Online (:8000)' : 'Backend Offline'}
          </span>
          <span className="sep">|</span>

          {/* User Session & Logout Button */}
          {currentRole === 'CITIZEN' ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#fde68a', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                <Globe size={13} color="#d97706" />
                <span>Public Citizen</span>
              </span>
              <span className="personal-badge-role role-badge-citizen" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                Open Justice
              </span>
              <button 
                type="button" 
                onClick={() => setShowLoginPage(true)}
                title="Log in as Hon'ble Judge, Bar Advocate, or Court Clerk"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'rgba(217, 119, 6, 0.25)',
                  border: '1px solid rgba(217, 119, 6, 0.5)',
                  color: '#fde68a',
                  borderRadius: '6px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <LogIn size={11} />
                <span>Official Login</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#f4f4f5', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <User size={12} color="#d97706" />
                <span>{currentOfficer?.full_name?.split(' ')[0] || 'User'}</span>
              </span>
              <span className={`personal-badge-role role-badge-${currentOfficer?.category?.toLowerCase() || (currentRole === 'JUDGE' ? 'judge' : (currentRole === 'CLERK' ? 'clerk' : (currentRole === 'LITIGANT' ? 'litigant' : (currentRole === 'CITIZEN' ? 'citizen' : 'advocate'))))}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                {currentRole === 'JUDGE' ? 'Judge' : (currentRole === 'CLERK' ? 'Clerk' : (currentRole === 'LITIGANT' ? 'Litigant' : (currentRole === 'CITIZEN' ? 'Citizen' : 'Advocate')))}
              </span>
              <button 
                type="button" 
                onClick={handleLogout}
                title="Log out and return to MP High Court Login Gateway"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  color: '#fca5a5',
                  borderRadius: '6px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <LogOut size={11} />
                <span>Logout / Switch Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Official MP High Court Masthead */}
      <header className="mphc-header">
        <div className="mphc-masthead-inner">
          <div className="mphc-identity-col">
            <div className="mphc-emblem-box">
              <MpHcEmblem size={70} />
            </div>
            <div className="mphc-text-titles">
              <div className="mphc-hindi-headline">
                {tr('मध्य प्रदेश उच्च न्यायालय • जबलपुर / इन्दौर / ग्वालियर')}
              </div>
              <h1 className="mphc-english-headline">
                {tr('HIGH COURT OF MADHYA PRADESH')}
              </h1>
              <div className="mphc-sub-division">
                <span style={{ color: '#ffffff', fontWeight: 700 }}>
                  {tr('Commercial Division (Order XV-A CPC Case Management e-Portal)')}
                </span>
                <span style={{ color: '#71717a' }}>•</span>
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                  {activeBench === 'INDORE' && tr('Active Jurisdiction: Bench at Indore (Malwa Region)')}
                  {activeBench === 'JABALPUR' && tr('Active Jurisdiction: Principal Seat at Jabalpur')}
                  {activeBench === 'GWALIOR' && tr('Active Jurisdiction: Bench at Gwalior (Chambal Region)')}
                </span>
              </div>
            </div>
          </div>

          <div className="mphc-meta-col">
            {/* Top Row: Official Personal Block anchored at top-right corner */}
            <div className="mphc-personal-block">
              <button 
                type="button"
                className="personal-block-btn"
                onClick={() => setProfileModalOpen(true)}
                title={lang === 'HI' ? 'आधिकारिक पहचान, डीएससी टोकन देखें एवं अधिकारी बदलें' : 'Click to view Official Identity, DSC Token & Switch Officer'}
              >
                <div className={`personal-avatar-box personal-avatar-${currentOfficer.category?.toLowerCase() || (currentRole === 'JUDGE' ? 'judge' : (currentRole === 'CLERK' ? 'clerk' : (currentRole === 'LITIGANT' ? 'litigant' : (currentRole === 'CITIZEN' ? 'citizen' : 'advocate'))))}`}>
                  {currentRole === 'JUDGE' || currentOfficer.category === 'JUDGE' ? (
                    <Gavel size={16} />
                  ) : (currentRole === 'CLERK' || currentOfficer.category === 'CLERK' ? (
                    <ShieldCheck size={16} />
                  ) : (currentRole === 'LITIGANT' || currentOfficer.category === 'LITIGANT' ? (
                    <Briefcase size={16} />
                  ) : (currentRole === 'CITIZEN' || currentOfficer.category === 'CITIZEN' ? (
                    <Globe size={16} />
                  ) : (
                    <Scale size={16} />
                  ))))}
                  <span className="personal-status-indicator" title={lang === 'HI' ? 'सत्यापन टोकन सक्रिय' : 'Authentication Token Active'}></span>
                </div>
                <div className="personal-details">
                  <div className="personal-name-row">
                    <span className="personal-name">{currentOfficer.full_name}</span>
                    <span className={`personal-badge-role role-badge-${currentOfficer.category?.toLowerCase() || (currentRole === 'JUDGE' ? 'judge' : (currentRole === 'CLERK' ? 'clerk' : (currentRole === 'LITIGANT' ? 'litigant' : (currentRole === 'CITIZEN' ? 'citizen' : 'advocate'))))}`}>
                      {currentRole === 'JUDGE' ? tr('Judicial Officer') : (currentRole === 'CLERK' ? tr('Court Registry') : (currentRole === 'LITIGANT' ? tr('Commercial Client') : (currentRole === 'CITIZEN' ? tr('Public Citizen') : (currentRole === 'ADVOCATE_DEFENDANT' ? tr('Def. Counsel') : tr('Plff. Counsel')))))}
                    </span>
                  </div>
                  <div className="personal-subtext">
                    <span className="personal-id-tag">{currentOfficer.organization || currentOfficer.bar_council_id || currentOfficer.bench_id || currentOfficer.court_hall_id || tr('Indore Bar')}</span>
                    <span className="personal-dsc-tag">{currentRole === 'CITIZEN' ? tr('● Open Justice') : (currentRole === 'LITIGANT' ? tr('● Verified Litigant') : tr('● DSC Active'))}</span>
                    <ChevronDown size={12} className="chevron-icon" />
                  </div>
                </div>
              </button>
            </div>

            {/* Bottom Row: Bench Selector Ribbon & Statutory Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
              <div className="mphc-benches-ribbon" title={lang === 'HI' ? 'उच्च न्यायालय खंडपीठ बदलें' : 'Switch High Court Bench Jurisdiction'}>
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 700, paddingLeft: '0.2rem' }}>
                  {tr('Bench:')}
                </span>
                <button 
                  type="button" 
                  className={`bench-pill ${activeBench === 'JABALPUR' ? 'active' : ''}`}
                  onClick={() => setActiveBench('JABALPUR')}
                >
                  {tr('Jabalpur')}
                </button>
                <button 
                  type="button" 
                  className={`bench-pill ${activeBench === 'INDORE' ? 'active' : ''}`}
                  onClick={() => setActiveBench('INDORE')}
                >
                  {tr('Indore')}
                </button>
                <button 
                  type="button" 
                  className={`bench-pill ${activeBench === 'GWALIOR' ? 'active' : ''}`}
                  onClick={() => setActiveBench('GWALIOR')}
                >
                  {tr('Gwalior')}
                </button>
              </div>

              <span className="court-badge" style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', whiteSpace: 'nowrap' }}>
                {tr('Order XV-A CPC')}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#71717a', whiteSpace: 'nowrap' }}>
                {tr('SVVV (MP-14)')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Official MP High Court Notification Strip */}
      <div className="mphc-notice-strip">
        <span className="notice-tag">
          <Sparkles size={12} />
          {tr('COURT DIRECTIVE')}
        </span>
        <span className="notice-text">
          {tr('Commercial Courts Act, 2015 & Order XV-A CPC Practice Directions: Pre-Trial Case Management Hearing (CMH) is statutory for all commercial claims > ₹3,00,000. All statements of admission/denial must be uploaded prior to first hearing.')}
        </span>
      </div>

      {/* 4. Official Judicial Action & Docket Quick Bar (Replaces old debug persona strip) */}
      <div className="role-bar judicial-action-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--theme-text-secondary)' }}>
            <Landmark size={15} color="#b45309" />
            <span>{tr('Commercial Division')}</span>
            <span style={{ color: 'var(--theme-border)' }}>•</span>
            <span style={{ color: 'var(--theme-text-muted)', fontWeight: 600 }}>{tr('Order XV-A CPC Pre-Trial Node')}</span>
          </div>

          {activeCase ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--theme-orange-tint)', border: '1px solid var(--theme-orange-border)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>{tr('Active Docket:')}</span>
              <button 
                onClick={() => loadCaseDossier(activeCase.cnr_number)}
                title={lang === 'HI' ? 'संपूर्ण डोसीयर देखने हेतु क्लिक करें' : 'Click to view full dossier'}
                className="mono" 
                style={{ fontWeight: 700, color: 'var(--theme-text-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}
              >
                {activeCase.cnr_number}
              </button>
              <span style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                ({activeCase.case_title})
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--theme-text-muted)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              <span>{tr('Indore Commercial Bench • Court Hall 04 Live Roster')}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Global Quick Search Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                loadCaseDossier(searchQuery.trim());
              }
            }}
            style={{ display: 'flex', alignItems: 'center', background: 'var(--theme-card)', borderRadius: '8px', padding: '0.3rem 0.65rem', border: '1px solid var(--theme-border)' }}
          >
            <Search size={14} color="#64748b" style={{ marginRight: '0.4rem' }} />
            <input 
              type="text" 
              placeholder={tr('Search CNR or Case...')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.8rem', width: '160px', color: 'var(--theme-text-primary)' }}
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

          {/* Quick Officer Switcher Button */}
          <button 
            type="button"
            onClick={() => setProfileModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--theme-card)',
              border: '1px solid var(--theme-border)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--theme-text-primary)',
              cursor: 'pointer'
            }}
            title={lang === 'HI' ? 'व्यक्तिगत प्रोफ़ाइल खोलें एवं न्यायिक पद बदलें' : 'Open Personal Profile & Switch Judicial Persona'}
          >
            <UserCheck size={14} color="#d97706" />
            <span>{tr('Switch Identity')}</span>
          </button>
        </div>
      </div>

      {/* Official Personal Profile & Judicial Identity Modal */}
      {profileModalOpen && (
        <div className="personal-modal-overlay" onClick={() => setProfileModalOpen(false)}>
          <div className="personal-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="personal-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <MpHcEmblem size={38} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {tr('Commercial Division • Official Personal Block')}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'Cinzel, serif' }}>
                    {tr('Authenticated Officer Identity & Role Management')}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setProfileModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '0.4rem' }}
                title={lang === 'HI' ? 'बंद करें' : 'Close'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="personal-modal-body">
              {/* 1. Active Authenticated Officer Dossier */}
              <div className="personal-card-section" style={{ borderLeft: '4px solid #d97706' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className={`personal-avatar-box personal-avatar-${currentOfficer.category?.toLowerCase() || (currentRole === 'JUDGE' ? 'judge' : (currentRole === 'CLERK' ? 'clerk' : (currentRole === 'CITIZEN' ? 'citizen' : (currentRole === 'LITIGANT' ? 'litigant' : 'advocate'))))}`} style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                      {currentRole === 'JUDGE' || currentOfficer.category === 'JUDGE' ? (
                        <Gavel size={26} />
                      ) : (currentRole === 'CLERK' || currentOfficer.category === 'CLERK' ? (
                        <ShieldCheck size={26} />
                      ) : (currentRole === 'CITIZEN' || currentOfficer.category === 'CITIZEN' ? (
                        <Globe size={26} />
                      ) : (currentRole === 'LITIGANT' || currentOfficer.category === 'LITIGANT' ? (
                        <Briefcase size={26} />
                      ) : (
                        <Scale size={26} />
                      ))))}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                          {currentOfficer.full_name}
                        </h4>
                        <span className={`personal-badge-role role-badge-${currentOfficer.category?.toLowerCase() || (currentRole === 'JUDGE' ? 'judge' : (currentRole === 'CLERK' ? 'clerk' : (currentRole === 'CITIZEN' ? 'citizen' : (currentRole === 'LITIGANT' ? 'litigant' : 'advocate'))))}`} style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
                          {currentRole === 'JUDGE' ? tr("Hon'ble Presiding Judge") : (currentRole === 'CLERK' ? tr('Court Registry Officer') : (currentRole === 'CITIZEN' ? tr('Public Citizen') : (currentRole === 'LITIGANT' ? tr('Commercial Client') : (currentRole === 'ADVOCATE_DEFENDANT' ? tr('Defendant Legal Counsel') : tr('Plaintiff Legal Counsel')))))}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>Email: <strong className="mono" style={{ color: 'var(--theme-text-primary)' }}>{currentOfficer.email}</strong></span>
                        <span>{currentRole === 'CITIZEN' ? (lang === 'HI' ? 'केंद्र' : 'Node') : 'ID'}: <strong className="mono" style={{ color: 'var(--theme-text-primary)' }}>{currentOfficer.organization || currentOfficer.bar_council_id || currentOfficer.bench_id || currentOfficer.court_hall_id}</strong></span>
                        <span>{currentRole === 'CITIZEN' ? (lang === 'HI' ? 'क्षेत्राधिकार' : 'Jurisdiction') : (lang === 'HI' ? 'कक्ष' : 'Hall')}: <strong>{currentOfficer.jurisdiction || currentOfficer.court_hall_id || (lang === 'HI' ? 'न्यायालय कक्ष ०४' : 'Court Hall 04')}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: currentRole === 'CITIZEN' ? '#f0fdfa' : '#ecfdf5', border: `1px solid ${currentRole === 'CITIZEN' ? '#99f6e4' : '#a7f3d0'}`, padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: currentRole === 'CITIZEN' ? '#0f766e' : '#065f46' }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                      {currentRole === 'CITIZEN' ? <Globe size={14} color="#0d9488" /> : <CheckCircle2 size={14} color="#059669" />}
                      <span>{currentRole === 'CITIZEN' ? tr('Open Justice Access (Article 145(4))') : tr('Class 3 DSC Cryptographic e-Sign Token')}</span>
                    </div>
                    <div>{currentRole === 'CITIZEN' ? (lang === 'HI' ? 'नागरिक सार्वजनिक अन्वेषक मोड • किसी क्रेडेंशियल की आवश्यकता नहीं' : 'Citizen Public Inquirer Mode • No Credentials Required') : tr('Valid till Dec 2028 • SHA-256 Seal Active')}</div>
                  </div>
                </div>

                {/* Stance Switcher for Advocate Role */}
                {(currentOfficer.role === 'ROLE_ADVOCATE' || currentOfficer.category === 'ADVOCATE') && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {tr('Active Stance in Pre-Trial Admissions & Denials Matrix:')}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        type="button"
                        onClick={() => setCurrentRole('ADVOCATE_PLAINTIFF')}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: currentRole === 'ADVOCATE_PLAINTIFF' ? '#0284c7' : 'var(--theme-card)',
                          color: currentRole === 'ADVOCATE_PLAINTIFF' ? '#ffffff' : 'var(--theme-text-secondary)',
                          border: '1px solid ' + (currentRole === 'ADVOCATE_PLAINTIFF' ? '#0284c7' : 'var(--theme-border)')
                        }}
                      >
                        {tr('Act as Plaintiff Counsel')}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCurrentRole('ADVOCATE_DEFENDANT')}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: currentRole === 'ADVOCATE_DEFENDANT' ? '#7c3aed' : 'var(--theme-card)',
                          color: currentRole === 'ADVOCATE_DEFENDANT' ? '#ffffff' : 'var(--theme-text-secondary)',
                          border: '1px solid ' + (currentRole === 'ADVOCATE_DEFENDANT' ? '#7c3aed' : 'var(--theme-border)')
                        }}
                      >
                        {tr('Act as Defendant Counsel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Active Case Context: 1-Click Role Adoption */}
              {(activeCase || dossier) && (
                <div className="personal-card-section" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Briefcase size={15} />
                      <span>{tr('Active Matter Counsel & Bench (1-Click Role Adoption)')}</span>
                    </div>
                    <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#78350f' }}>
                      {(dossier?.cnr_number || activeCase?.cnr_number)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#78350f', marginBottom: '0.75rem' }}>
                    {lang === 'HI' ? 'इस वाद से जुड़े पीठासीन न्यायाधीश अथवा अधिवक्ता की भूमिका तत्काल अपनाएं:' : 'Quickly adopt the specific Presiding Judge or Counsel assigned to:'} <strong>{(dossier?.case_title || activeCase?.case_title)}</strong>:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.6rem' }}>
                    {/* Presiding Judge of this case */}
                    <button
                      type="button"
                      onClick={() => {
                        const judgeName = dossier?.judge?.full_name || "Hon'ble Justice Rajesh Sharma";
                        const officer = officersList.find(o => o.full_name === judgeName || o.category === 'JUDGE') || DEFAULT_OFFICERS.find(o => o.category === 'JUDGE');
                        handleSelectOfficer(officer);
                        setProfileModalOpen(false);
                      }}
                      className="officer-item-card"
                      style={{ borderLeft: '3px solid #f59e0b' }}
                    >
                      <div className="personal-avatar-box personal-avatar-judge" style={{ width: '32px', height: '32px' }}>
                        <Gavel size={15} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>{tr('Presiding Judge')}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {dossier?.judge?.full_name || "Hon'ble Justice Rajesh Sharma"}
                        </div>
                      </div>
                    </button>

                    {/* Plaintiff Counsel of this case */}
                    <button
                      type="button"
                      onClick={() => {
                        const counselName = dossier?.plaintiff_counsel?.full_name || "Adv. Himanshu Bawaniya";
                        const officer = officersList.find(o => o.full_name === counselName) || DEFAULT_OFFICERS.find(o => o.id === 'adv-himanshu') || DEFAULT_OFFICERS.find(o => o.category === 'ADVOCATE');
                        handleSelectOfficer(officer, 'ADVOCATE_PLAINTIFF');
                        setProfileModalOpen(false);
                      }}
                      className="officer-item-card"
                      style={{ borderLeft: '3px solid #0284c7' }}
                    >
                      <div className="personal-avatar-box personal-avatar-advocate" style={{ width: '32px', height: '32px' }}>
                        <Scale size={15} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>{tr('Plaintiff Counsel')}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {dossier?.plaintiff_counsel?.full_name || "Adv. Himanshu Bawaniya"}
                        </div>
                      </div>
                    </button>

                    {/* Defendant Counsel of this case */}
                    <button
                      type="button"
                      onClick={() => {
                        const counselName = dossier?.defendant_counsel?.full_name || "Adv. Priya Verma";
                        const officer = officersList.find(o => o.full_name === counselName) || DEFAULT_OFFICERS.find(o => o.id === 'adv-verma') || DEFAULT_OFFICERS.find(o => o.category === 'ADVOCATE');
                        handleSelectOfficer(officer, 'ADVOCATE_DEFENDANT');
                        setProfileModalOpen(false);
                      }}
                      className="officer-item-card"
                      style={{ borderLeft: '3px solid #7c3aed' }}
                    >
                      <div className="personal-avatar-box personal-avatar-advocate" style={{ width: '32px', height: '32px' }}>
                        <Scale size={15} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', color: '#6d28d9', fontWeight: 700, textTransform: 'uppercase' }}>{tr('Defendant Counsel')}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {dossier?.defendant_counsel?.full_name || "Adv. Priya Verma"}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Directory of All Registered Officers */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>
                      {lang === 'HI' ? `उच्च न्यायालय न्यायिक एवं विधिक निर्देशिका (${officersList.length} सक्रिय प्रोफ़ाइल)` : `High Court Judicial & Legal Directory (${officersList.length} Active Profiles)`}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                      {tr('Switch seamlessly between any designated Judge, Counsel, or Court Clerk:')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {['CITIZEN', 'ALL', 'JUDGE', 'ADVOCATE', 'CLERK', 'LITIGANT'].map(tabKey => (
                      <button
                        key={tabKey}
                        type="button"
                        onClick={() => setOfficerFilterTab(tabKey)}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid ' + (officerFilterTab === tabKey ? '#d97706' : 'var(--theme-border)'),
                          background: officerFilterTab === tabKey ? '#d97706' : 'var(--theme-card)',
                          color: officerFilterTab === tabKey ? '#ffffff' : 'var(--theme-text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {tabKey === 'CITIZEN' ? `🌐 ${lang === 'HI' ? 'जनसाधारण नागरिक' : 'Public Citizen'}` : (tabKey === 'ALL' ? (lang === 'HI' ? `सभी (${officersList.length})` : `All (${officersList.length})`) : (tabKey === 'JUDGE' ? `⚖️ ${tr('Judges')}` : (tabKey === 'ADVOCATE' ? `🏛️ ${tr('Advocates')}` : (tabKey === 'CLERK' ? `🛡️ ${tr('Clerks')}` : `👤 ${tr('Clients')}`))))}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="officer-grid">
                  {officersList
                    .filter(o => officerFilterTab === 'ALL' || o.category === officerFilterTab || (officerFilterTab === 'JUDGE' && o.role === 'ROLE_JUDGE') || (officerFilterTab === 'CLERK' && o.role === 'ROLE_CLERK') || (officerFilterTab === 'ADVOCATE' && o.role === 'ROLE_ADVOCATE') || (officerFilterTab === 'LITIGANT' && o.role === 'ROLE_LITIGANT') || (officerFilterTab === 'CITIZEN' && (o.category === 'CITIZEN' || o.role === 'ROLE_CITIZEN')))
                    .map((officer) => {
                      const isCurrent = currentOfficer.email === officer.email;
                      const cat = officer.category || (officer.role === 'ROLE_JUDGE' ? 'JUDGE' : (officer.role === 'ROLE_CLERK' ? 'CLERK' : (officer.role === 'ROLE_LITIGANT' ? 'LITIGANT' : (officer.role === 'ROLE_CITIZEN' ? 'CITIZEN' : 'ADVOCATE'))));
                      return (
                        <div 
                          key={officer.id || officer.email}
                          onClick={() => {
                            handleSelectOfficer(officer);
                            setProfileModalOpen(false);
                          }}
                          className={`officer-item-card ${isCurrent ? 'active' : ''}`}
                        >
                          <div className={`personal-avatar-box personal-avatar-${cat.toLowerCase()}`} style={{ width: '36px', height: '36px' }}>
                            {cat === 'JUDGE' ? <Gavel size={16} /> : (cat === 'CLERK' ? <ShieldCheck size={16} /> : (cat === 'LITIGANT' ? <Briefcase size={16} /> : (cat === 'CITIZEN' ? <Globe size={16} /> : <Scale size={16} />)))}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--theme-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {officer.full_name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                              <span className="mono" style={{ fontWeight: 600 }}>{officer.organization || officer.bar_council_id || officer.bench_id || officer.court_hall_id || tr('Indore Bar')}</span>
                              {isCurrent && (
                                <span style={{ color: '#059669', fontWeight: 800 }}>{tr('• Active')}</span>
                              )}
                            </div>
                            {(officer.specialty || officer.counsel) && (
                              <div style={{ fontSize: '0.68rem', color: cat === 'LITIGANT' ? '#7c3aed' : '#0284c7', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {cat === 'LITIGANT' ? `${lang === 'HI' ? 'अधिवक्ता' : 'Counsel'}: ${officer.counsel}` : officer.specialty}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Container */}
      <div className="main-wrapper">
        
        {/* High Court e-Display Board & Live Cause List Status */}
        <div className="mphc-display-board">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <span className="live-ticker-dot"></span>
            <div className="display-board-title">
              <Landmark size={16} />
              <span>{tr('e-Display Board • Court Hall 04')}</span>
            </div>
            <span style={{ color: '#52525b' }}>|</span>
            <div className="display-board-text">
              <span>{lang === 'HI' ? 'वर्तमान विचाराधीन प्रकरण: ' : 'Item in Progress: '}<strong style={{ color: '#ffffff' }}>{lang === 'HI' ? '#०३ (स्वीकृति एवं वाद विषय निर्धारण)' : '#03 (Admissions & Framing Timetable)'}</strong></span>
              <span style={{ color: '#71717a' }}>•</span>
              <span>{tr('Presiding:')} <strong style={{ color: '#f59e0b' }}>{lang === 'HI' ? 'माननीय न्यायमूर्ति राजेश शर्मा' : "Hon'ble Justice Rajesh Sharma"}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {currentRole === 'CLERK' && (
              <button 
                type="button" 
                onClick={() => alert(tr('Court Clerk Action: Case Item #03 marked completed. Calling Item #04 (Apex Infotech vs Horizon Logistics) to Hall 04 podium. Digital cause board synchronized.'))}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.28rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginRight: '0.4rem'
                }}
                title={lang === 'HI' ? 'लाइव न्यायालय कतार आगे बढ़ाएं' : 'Advance live courtroom queue on display board'}
              >
                <span>{tr('🔔 Call Next Matter (#03 ➔ #04)')}</span>
              </button>
            )}

            <span style={{ fontSize: '0.75rem', color: '#a1a1aa', marginRight: '0.3rem' }}>
              {tr('Cause List Roster:')}
            </span>
            <button 
              className={`roster-filter-btn ${tableRosterFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => { setTableRosterFilter('ALL'); setActiveTab('cases'); }}
            >
              {lang === 'HI' ? `सभी वाद (${cases.length})` : `All Dockets (${cases.length})`}
            </button>
            <button 
              className={`roster-filter-btn ${tableRosterFilter === 'NEXT_WEEK' ? 'active' : ''}`}
              onClick={() => { setTableRosterFilter('NEXT_WEEK'); setActiveTab('cases'); }}
            >
              {lang === 'HI' ? `⚡ अगला सप्ताह (${nextWeekCount})` : `⚡ Next Week (${nextWeekCount})`}
            </button>
            <button 
              className={`roster-filter-btn ${tableRosterFilter === 'NEXT_MONTH' ? 'active' : ''}`}
              onClick={() => { setTableRosterFilter('NEXT_MONTH'); setActiveTab('cases'); }}
            >
              {lang === 'HI' ? `📅 अगला माह (${nextMonthCount})` : `📅 Next Month (${nextMonthCount})`}
            </button>
          </div>
        </div>

        {/* Public Citizen Hero Banner (Rendered for General Public / Open Courts) */}
        {currentRole === 'CITIZEN' && (
          <div className="citizen-hero-banner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.25)', border: '1px solid #d97706', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  <Globe size={12} />
                  {tr('Open Courts Citizen Portal • Art. 145(4) Constitution of India')}
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: '#ffffff' }}>
                  {tr('High Court of Madhya Pradesh — Public Transparency Node')}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '840px', lineHeight: 1.5 }}>
                  {tr('Under the Open Courts Principle (Article 145(4)) and e-Courts Phase III, normal citizens have full public transparency to inspect case status by 16-digit CNR, track live courtroom proceedings in Court Hall 04, inspect pre-trial crystallized facts (Order XV-A CPC), and download certified electronic copies of Case Management Orders.')}
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setShowLoginPage(true)}
                style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                }}
              >
                <Lock size={13} />
                <span>{tr('Judicial / Advocate Login')}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <span className="citizen-feature-pill">{tr('🔍 16-Digit CNR & Party Lookup')}</span>
              <span className="citizen-feature-pill">{tr('📋 Court Hall 04 Live e-Display Board')}</span>
              <span className="citizen-feature-pill">{tr('⚖️ Order XV-A Fact Matrix (Civic Transparency)')}</span>
              <span className="citizen-feature-pill">{tr('📄 Certified Public CMO (Section 65B)')}</span>
              <span className="citizen-feature-pill" style={{ color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.4)' }}>{tr('🛡️ Cryptographically Sealed Dockets')}</span>
            </div>
          </div>
        )}

        {/* Commercial Litigant Hero Banner (Rendered for Litigant / Corporate Client) */}
        {currentRole === 'LITIGANT' && (
          <div className="client-hero-banner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.25)', border: '1px solid #d97706', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  <Briefcase size={12} />
                  {tr('Commercial Litigant Portal • Live Dispute Tracker')}
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#ffffff' }}>
                  {currentOfficer?.email === 'client.horizon@logistics.in' 
                    ? (lang === 'HI' ? 'हॉराइजन लॉजिस्टिक्स प्रा. लि. (प्रतिवादी प्रकरण)' : 'Horizon Logistics Pvt. Ltd. (Defendant Matter)')
                    : (lang === 'HI' ? 'एपेक्स इन्फोटेक लि. बनाम हॉराइजन लॉजिस्टिक्स प्रा. लि.' : 'Apex Infotech Ltd. vs. Horizon Logistics Pvt. Ltd.')}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  CNR: <strong className="mono" style={{ color: '#fde68a' }}>MPIN01593559452026</strong> • {lang === 'HI' ? 'दावा मूल्यांकन:' : 'Claim Valuation:'} <strong style={{ color: '#34d399' }}>₹45,00,000.00</strong> • {lang === 'HI' ? 'चरण:' : 'Stage:'} <span style={{ color: '#f59e0b', fontWeight: 700 }}>{lang === 'HI' ? 'आदेश XV-A के तहत विचारण-पूर्व सीएमएच' : 'Pre-Trial CMH under Order XV-A'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className="client-stat-badge">
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{tr('Presiding Bench')}</div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.85rem' }}>{lang === 'HI' ? 'माननीय न्यायमूर्ति राजेश शर्मा' : "Hon'ble Justice Rajesh Sharma"}</div>
                  <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>{lang === 'HI' ? 'न्यायालय कक्ष ०४, इन्दौर खंडपीठ' : 'Court Hall 04, Indore Bench'}</div>
                </div>
                <div className="client-stat-badge">
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{tr('Next Hearing Date')}</div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.85rem' }}>{lang === 'HI' ? '०३ नवं २०२६ • १०:३० पूर्वान्ह' : '03 Nov 2026 • 10:30 AM'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#34d399' }}>{tr('⚡ Scheduled in 7 Days')}</div>
                </div>
                <div className="client-stat-badge">
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{tr('Authorized Legal Counsel')}</div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.85rem' }}>
                    {currentOfficer?.email === 'client.horizon@logistics.in' ? (lang === 'HI' ? 'अधिवक्ता प्रिया वर्मा' : 'Adv. Priya Verma') : (lang === 'HI' ? 'अधिवक्ता हिमांशु बावनिया' : 'Adv. Himanshu Bawaniya')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{tr('Indore High Court Bar')}</div>
                </div>
              </div>
            </div>

            <div className="statutory-restriction-callout">
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>{tr('Statutory Representation Notice (Order XV-A CPC):')}</strong> {lang === 'HI' 
                  ? 'वाणिज्यिक कॉर्पोरेट वादकारी के रूप में, आपके पास कार्यवाही की लाइव निगरानी करने, स्वीकृतियों/अस्वीकृतियों का निरीक्षण करने और प्रमाणित सीएमओ डिक्री डाउनलोड करने की पूर्ण पारदर्शिता है। औपचारिक साक्ष्य और डिजिटल याचिकाएं आपके अधिकृत बार अधिवक्ता द्वारा प्रस्तुत की जाती हैं।'
                  : 'As a commercial corporate litigant, you have complete real-time transparency to monitor proceedings, inspect admissions/denials, and download certified CMO decrees. Formal evidentiary submissions and digital filings are registered on your behalf by your designated Bar Advocate on Record.'}
              </div>
            </div>
          </div>
        )}

        {/* Multi-Channel Notification Dispatch Success Alert Banner */}
        {notifSuccessBanner && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: '1.5px solid #22c55e',
            color: '#86efac',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <CheckCheck size={18} color="#22c55e" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                {notifSuccessBanner}
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => setNotifSuccessBanner(null)}
              style={{ background: 'none', border: 'none', color: '#86efac', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Viva Demo Tour Guided Controller */}
        {vivaTourActive && (
          <div className="viva-tour-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '280px' }}>
              <div className="viva-step-pill">
                Step {vivaTourStep} of 7
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', fontWeight: 800, color: '#f59e0b', fontSize: '1rem' }}>
                  {vivaTourStep === 1 && "1. High Court Daily Cause List (रोज़नामचा & Board)"}
                  {vivaTourStep === 2 && "2. Pre-Trial Hearing Scheduler & Advocate Conflict Shield"}
                  {vivaTourStep === 3 && "3. WebRTC Virtual Courtroom & Digital Evidence Desk"}
                  {vivaTourStep === 4 && "4. Admissions & Denials Matrix (Order XV-A Rule 2 CPC)"}
                  {vivaTourStep === 5 && "5. Section 89 CPC Pre-Trial Mediation & ADR Referral Engine"}
                  {vivaTourStep === 6 && "6. MP Cyber Treasury e-Challan Judicial Fee Gateway"}
                  {vivaTourStep === 7 && "7. Judicial Analytics & NJDG Pre-Trial Velocity Suite"}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {vivaTourStep === 1 && "Live daily docket of cases listed before Hon'ble Judges across Court Halls 1 to 4 with status filters and quick hearing join links."}
                  {vivaTourStep === 2 && "Autonomous conflict detection scans counsel rosters across all district court benches to prevent double-booking collisions."}
                  {vivaTourStep === 3 && "Full WebRTC 4-tile video hearing with Judge bench, Plaintiff counsel, Defendant counsel, and active evidence desk."}
                  {vivaTourStep === 4 && "Pleadings fact checklist where parties mark evidentiary stances online to permanently crystallize undisputed facts."}
                  {vivaTourStep === 5 && "Consensus AI identifies matters with >50% admissions and generates statutory Section 89 ADR referrals to High Court Mediation Centre."}
                  {vivaTourStep === 6 && "Official ad-valorem fee calculator, Cyber Treasury MP simulation, and SHA-256 verifiable tamper-proof receipts."}
                  {vivaTourStep === 7 && "NJDG performance comparison: Order XV-A completes pre-trial CMH in 28.4 days vs 365+ days in conventional civil trials."}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {vivaTourStep < 7 ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextStep = vivaTourStep + 1;
                    setVivaTourStep(nextStep);
                    if (nextStep === 1) { setActiveTab('causelist'); fetchDailyCauseList(); }
                    else if (nextStep === 2) { setActiveTab('scheduler'); }
                    else if (nextStep === 3) {
                      setActiveCourtroomSession({
                        id: 'DEMO-TOUR-SESSION',
                        court_hall_id: 'HALL_04',
                        webrtc_room_id: 'ROOM-MPHC-CMH-2026',
                        case: { cnr_number: 'MPIN01593559452026', case_title: 'Apex Infotech Ltd. vs. Horizon Logistics Pvt. Ltd.' }
                      });
                    }
                    else if (nextStep === 4) { setActiveTab('matrix'); }
                    else if (nextStep === 5) { setActiveTab('matrix'); }
                    else if (nextStep === 6) { setActiveTab('echallan'); fetchChallans(); }
                    else if (nextStep === 7) { setActiveTab('analytics'); }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
                  }}
                >
                  <span>{tr("Next Tour Step")}</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setVivaTourActive(false)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  ✓ Tour Completed! Close
                </button>
              )}

              <button
                type="button"
                onClick={() => setVivaTourActive(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#94a3b8',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {tr("Close Tour")}
              </button>
            </div>
          </div>
        )}

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
            {currentRole === 'CITIZEN'
              ? tr('Public Case Search & Complete Dossier')
              : (currentRole === 'LITIGANT' 
                ? tr('My Case Dossier & Live Tracking')
                : tr('Universal Case Search & Complete Dossier'))}
          </button>

          {/* Daily Cause List (रोज़नामचा / Board) Tab */}
          <button 
            className={`tab-btn ${activeTab === 'causelist' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('causelist');
              fetchDailyCauseList();
            }}
          >
            <Calendar size={18} />
            <span>{tr('Daily Cause List (रोज़नामचा / Board)')}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <FileText size={18} />
            {currentRole === 'CITIZEN'
              ? tr('Fact Matrix (Civic Transparency)')
              : (currentRole === 'LITIGANT'
                ? tr('Admissions & Denials Audit')
                : tr('Admissions & Denials Matrix (Order XV-A)'))}
          </button>
          
          {/* Case Dockets & e-Filing Tab (Hidden for Litigants & Citizens) */}
          {currentRole !== 'LITIGANT' && currentRole !== 'CITIZEN' && (
            <button 
              className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
              onClick={() => setActiveTab('cases')}
            >
              <Scale size={18} />
              {currentRole === 'JUDGE' 
                ? tr('Bench Dockets & Cause List')
                : (currentRole === 'CLERK' 
                  ? tr('Registry Scrutiny & Cause Lists')
                  : tr('Case Dockets & e-Filing'))}
            </button>
          )}

          <button 
            className={`tab-btn ${activeTab === 'scheduler' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduler')}
          >
            <Clock size={18} />
            {currentRole === 'CITIZEN'
              ? tr('Court Hall 04 Live Calendar & Cause List')
              : (currentRole === 'LITIGANT'
                ? tr('Court Hall 04 Live Calendar')
                : tr('Smart Clash-Free Scheduler'))}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cmo' ? 'active' : ''}`}
            onClick={() => setActiveTab('cmo')}
          >
            <Gavel size={18} />
            {currentRole === 'CITIZEN'
              ? tr('Certified Case Management Order (Public Copy)')
              : (currentRole === 'LITIGANT'
                ? tr('Certified Case Management Order (CMO)')
                : tr('Case Management Order (CMO)'))}
          </button>

          {/* e-Challan & Cyber Treasury Court Fees Tab */}
          <button 
            className={`tab-btn ${activeTab === 'echallan' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('echallan');
              fetchChallans();
              if (!feeBreakdown) handleCalculateFee('4500000');
            }}
          >
            <Receipt size={18} />
            <span>{tr('e-Challan & Court Fees (ई-चालान)')}</span>
          </button>

          {/* Judicial Analytics & NJDG Dashboard Tab */}
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>{tr('Judicial Analytics & NJDG (न्यायिक विश्लेषण)')}</span>
          </button>
        </div>

        {/* TAB 0: UNIVERSAL CASE SEARCH & COMPLETE DOSSIER */}
        {activeTab === 'search' && (
          <div>
            {/* Search Hero Component */}
            <div className="search-hero">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.18)', border: '1px solid rgba(217, 119, 6, 0.45)', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Sparkles size={13} />
                    {tr('Official e-Courts Case Dossier Lookup')}
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
                    {tr('Search Case Number & Full Judicial History')}
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', maxWidth: '750px' }}>
                    {tr('Retrieve complete real-time docket details, presiding bench, counsel assignments, chronological lifecycle milestones, past/scheduled hearings, pleadings with cryptographic SHA-256 seals, Order XV-A admissions, and signed Case Management Orders.')}
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
                    {tr('Refresh Record')}
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
                    placeholder={tr('Enter 16-digit CNR (e.g. MPIN01791316742026), Case Title, or Party Name...')}
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
                  {tr('Search Dossier')}
                </button>
              </form>

              {/* Quick Case Selection Chips */}
              <div className="quick-search-chips">
                <span style={{ fontWeight: 600, color: '#cbd5e1' }}>{tr('Quick Selection (Diverse Categories):')}</span>
                {(() => {
                  const seen = new Set();
                  const sampleCases = [];
                  for (const item of cases) {
                    if (!seen.has(item.case_type)) {
                      seen.add(item.case_type);
                      sampleCases.push(item);
                    }
                    if (sampleCases.length >= 6) break;
                  }
                  if (sampleCases.length < 6) {
                    for (const item of cases) {
                      if (!sampleCases.some(s => s.id === item.id)) {
                        sampleCases.push(item);
                        if (sampleCases.length >= 6) break;
                      }
                    }
                  }
                  return sampleCases.map((c) => (
                    <button 
                      key={c.id} 
                      type="button"
                      onClick={() => {
                        setSearchQuery(c.cnr_number);
                        loadCaseDossier(c.cnr_number, true);
                      }}
                      className="quick-search-chip"
                      style={{
                        borderColor: dossier?.cnr_number === c.cnr_number ? '#d97706' : 'rgba(255,255,255,0.15)',
                        background: dossier?.cnr_number === c.cnr_number ? 'rgba(217, 119, 6, 0.3)' : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.cnr_number}</span> - {(c.case_title || '').split(' vs.')[0]}
                      {c.next_hearing_formatted && (
                        <span style={{ fontSize: '0.7rem', color: '#f59e0b', marginLeft: '0.35rem', fontWeight: 700 }}>
                          • {trRel(c.next_hearing_formatted)}
                        </span>
                      )}
                    </button>
                  ));
                })()}
              </div>
            </div>

            {/* Live Autocomplete / Matching Results Grid */}
            {searchResults.length > 0 && (
              <div className="court-card" style={{ marginBottom: '1.5rem', background: '#f8fafc', borderColor: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    {tr('Matching Judicial Records Found')} ({searchResults.length}):
                  </span>
                  <button 
                    onClick={() => setSearchResults([])} 
                    style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer' }}
                  >
                    {tr('Dismiss')}
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
                        <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#b45309' }}>
                          {res.cnr_number}
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                          {res.next_hearing_relative && (
                            <span className={`hearing-pill-badge ${res.next_hearing_relative.includes('Next Week') ? 'pill-next-week' : (res.next_hearing_relative.includes('Next Month') ? 'pill-next-month' : 'pill-standard')}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                              {trRel(res.next_hearing_relative)}
                            </span>
                          )}
                          <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                            {trStat(res.status)}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--theme-text-primary)', marginBottom: '0.35rem' }}>
                        {res.case_title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span>{tr('Valuation:')} ₹ {parseFloat(res.claim_valuation).toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>{tr('Hall:')} {res.court_hall_id}</span>
                        {res.next_hearing_formatted && (
                          <>
                            <span>•</span>
                            <span style={{ color: '#b45309', fontWeight: 700 }}>
                              {tr('📅 Next Hearing:')} {res.next_hearing_formatted} ({res.next_hearing_purpose ? tr(res.next_hearing_purpose) : tr('Order XV-A CMH')})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loadingDossier && (
              <div className="court-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <RefreshCw size={32} color="#d97706" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--theme-text-primary)', marginBottom: '0.35rem' }}>
                  {tr('Compiling Judicial Case Dossier...')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--theme-text-muted)', margin: 0 }}>
                  {tr('Querying e-Courts ledger for hearings, cryptographic pleadings, admissions, and sealed CMO records.')}
                </p>
              </div>
            )}

            {/* Error Message */}
            {dossierError && !loadingDossier && (
              <div className="court-card" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertTriangle size={24} color="#dc2626" />
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 700 }}>{tr('Record Not Found')}</h4>
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
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{tr('Copied to clipboard!')}</span>
                        )}

                        <span className="badge" style={{
                          background: dossier.status === 'CMO_ISSUED_TRIAL_ACTIVE' ? '#ecfdf5' : '#fffbeb',
                          color: dossier.status === 'CMO_ISSUED_TRIAL_ACTIVE' ? '#065f46' : '#92400e',
                          borderColor: dossier.status === 'CMO_ISSUED_TRIAL_ACTIVE' ? '#a7f3d0' : '#fde68a',
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}>
                          <CheckCircle2 size={12} />
                          {trStat(dossier.status)}
                        </span>

                        <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>
                          <Scale size={12} />
                          {trCat(dossier.case_type)}
                        </span>
                      </div>

                      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--theme-text-primary)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                        {dossier.case_title}
                      </h1>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--theme-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={15} color="#a1a1aa" />
                          {tr('Filing Date:')} <strong style={{ color: 'var(--theme-text-primary)' }}>{new Date(dossier.filing_date).toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Building size={15} color="#a1a1aa" />
                          {tr('Assigned Hall:')} <strong style={{ color: 'var(--theme-text-primary)' }}>{dossier.court_hall_id || (lang === 'HI' ? 'इन्दौर न्यायालय कक्ष ०४' : 'Indore Court Hall 04')}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          {tr('Claim Valuation:')} <strong style={{ color: 'var(--theme-text-primary)', fontSize: '0.95rem' }}>₹ {parseFloat(dossier.claim_valuation).toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Header Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => window.print()}
                        style={{
                          background: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)',
                          color: 'var(--theme-text-primary)',
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
                        {tr('Print Dossier')}
                      </button>

                      <button 
                        onClick={() => {
                          setActiveCase(dossier);
                          loadMatrix(dossier.id);
                          setActiveTab('matrix');
                        }}
                        style={{
                          background: '#070d1e',
                          border: '1px solid #d97706',
                          color: 'white',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 2px 6px rgba(217, 119, 6, 0.25)'
                        }}
                      >
                        <FileText size={14} />
                        {tr('Open Admissions Matrix')}
                      </button>

                      <button 
                        onClick={() => {
                          setSummonsCase(dossier);
                          setSummonsModalOpen(true);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)'
                        }}
                        title="Issue and preview official statutory e-Summons under Order V Rules 1 & 9 CPC"
                      >
                        <FileCheck size={14} />
                        <span>{tr("Generate Statutory e-Summons (Order V Rule 9 CPC)")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Next Hearing Card in Masthead */}
                  {dossier.next_hearing_formatted && dossier.next_hearing_formatted !== 'Disposed / Concluded' && (
                    <div className="dossier-next-hearing-banner" style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                        <div className="next-hearing-icon-box">
                          <Calendar size={26} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#b45309' }}>
                              {tr('⚡ Next Scheduled Court Hearing (Live Cause List)')}
                            </span>
                            <span className={`hearing-pill-badge ${dossier.next_hearing_relative?.includes('Next Week') ? 'pill-next-week' : (dossier.next_hearing_relative?.includes('Next Month') ? 'pill-next-month' : 'pill-standard')}`}>
                              {trRel(dossier.next_hearing_relative || 'Next Week')}
                            </span>
                          </div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--theme-text-primary)', display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <span>{dossier.next_hearing_formatted}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
                              • {tr('Slot:')} {dossier.next_hearing_time || '10:30 - 11:15 AM'}
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>
                              • {dossier.next_hearing_hall || dossier.court_hall_id || (lang === 'HI' ? 'इन्दौर न्यायालय कक्ष ०४' : 'Indore Court Hall 04')}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.825rem', color: 'var(--theme-text-secondary)', marginTop: '0.25rem' }}>
                            <strong style={{ color: 'var(--theme-text-primary)' }}>{tr('Purpose of Hearing:')}</strong> {dossier.next_hearing_purpose ? tr(dossier.next_hearing_purpose) : tr('Order XV-A Pre-Trial Case Management Hearing')}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button 
                          onClick={() => {
                            if (dossier.next_hearing_date) setSchedDate(dossier.next_hearing_date);
                            setActiveTab('scheduler');
                          }}
                          className="hearing-action-btn"
                        >
                          <Calendar size={14} />
                          {tr('Clash Check & Reschedule')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. Stakeholders & Bench Row */}
                  <div className="stakeholders-row">
                    {/* Judge */}
                    <div className="stakeholder-card">
                      <div className="stakeholder-header">
                        <div className="stakeholder-avatar" style={{ background: '#070d1e', color: '#d97706', border: '1px solid #334155' }}>
                          <Gavel size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.05em' }}>
                            {tr('Presiding Judicial Officer')}
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                            {dossier.judge?.full_name || (lang === 'HI' ? "माननीय न्यायमूर्ति राजेश शर्मा" : "Hon'ble Justice Rajesh Sharma")}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>{tr('Bench:')} <strong style={{ color: 'var(--theme-text-primary)' }}>{dossier.judge?.bench_id || "BENCH_INDORE_COMM_01"}</strong></div>
                        <div>{tr('Email:')} <span className="mono">{dossier.judge?.email || "judge.sharma@svvv-courts.gov.in"}</span></div>
                        <div>{tr('Court:')} {tr('Indore Commercial Bench, Hall 4')}</div>
                      </div>
                    </div>

                    {/* Plaintiff Counsel */}
                    <div className="stakeholder-card">
                      <div className="stakeholder-header">
                        <div className="stakeholder-avatar" style={{ background: 'var(--theme-orange-tint)', color: '#b45309', border: '1px solid var(--theme-orange-border)' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.05em' }}>
                            {tr('Plaintiff Legal Counsel')}
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                            {dossier.plaintiff_counsel?.full_name || (lang === 'HI' ? "अधिवक्ता हिमांशु बावनिया" : "Adv. Himanshu Bawaniya")}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>{tr('Bar Registration:')} <strong style={{ color: 'var(--theme-text-primary)' }}>{dossier.plaintiff_counsel?.bar_council_id || "MP/14297/2026"}</strong></div>
                        <div>{tr('Email:')} <span className="mono">{dossier.plaintiff_counsel?.email || "adv.himanshu@barcouncil.org"}</span></div>
                        <div>{tr('Client:')} <strong style={{ color: 'var(--theme-text-primary)' }}>{dossier.case_title ? dossier.case_title.split(" vs.")[0] : (lang === 'HI' ? "वादी" : "Plaintiff")}</strong></div>
                      </div>
                    </div>

                    {/* Defendant Counsel */}
                    <div className="stakeholder-card">
                      <div className="stakeholder-header">
                        <div className="stakeholder-avatar" style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-muted)', letterSpacing: '0.05em' }}>
                            {tr('Defendant Legal Counsel')}
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                            {dossier.defendant_counsel?.full_name || (lang === 'HI' ? "अधिवक्ता प्रिया वर्मा" : "Adv. Priya Verma")}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>{tr('Bar Registration:')} <strong style={{ color: 'var(--theme-text-secondary)' }}>{dossier.defendant_counsel?.bar_council_id || "MP/11054/2026"}</strong></div>
                        <div>{tr('Email:')} <span className="mono">{dossier.defendant_counsel?.email || "adv.verma@barcouncil.org"}</span></div>
                        <div>{tr('Client:')} <strong style={{ color: 'var(--theme-text-primary)' }}>{dossier.case_title && dossier.case_title.includes(" vs.") ? dossier.case_title.split(" vs.")[1].trim() : (lang === 'HI' ? "प्रतिवादी" : "Defendant")}</strong></div>
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
                      {tr('Complete Dossier (All Sections)')}
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'timeline' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('timeline')}
                    >
                      <History size={14} />
                      {tr('Chronological Timeline')} ({dossier.timeline?.length || 0})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'hearings' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('hearings')}
                    >
                      <Calendar size={14} />
                      {tr('Hearings & Proceedings')} ({dossier.hearings?.length || 0})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'pleadings' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('pleadings')}
                    >
                      <FileCheck size={14} />
                      {tr('Pleadings & Exhibits')} ({dossier.pleadings?.length || 0})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'matrix' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('matrix')}
                    >
                      <FileText size={14} />
                      {tr('Order XV-A Matrix')} ({dossier.checklist?.items?.length || 0} {tr('Averments')})
                    </button>
                    <button 
                      className={`dossier-subnav-btn ${dossierSubTab === 'cmo' ? 'active' : ''}`}
                      onClick={() => setDossierSubTab('cmo')}
                    >
                      <Gavel size={14} />
                      {tr('Case Management Order (CMO)')}
                    </button>
                  </div>
                </div>

                {/* SECTION A: CHRONOLOGICAL LIFECYCLE TIMELINE */}
                {(dossierSubTab === 'all' || dossierSubTab === 'timeline') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--theme-text-primary)' }}>
                        <History size={18} color="#d97706" />
                        {tr('Comprehensive Case Journey & Milestone History')}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>
                        {tr('Real-time audit log under High Court e-Governance Framework')}
                      </span>
                    </div>

                    <div className="timeline-track">
                      {dossier.timeline && dossier.timeline.map((step, idx) => (
                        <div key={idx} className="timeline-node">
                          <div className={`timeline-bullet ${step.status === 'COMPLETED' ? 'completed' : (step.status === 'ACTIVE' ? 'active' : 'pending')}`} />
                          <div className="timeline-content-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'gap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--theme-card)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                  {step.date}
                                </span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  [{tr(step.stage)}]
                                </span>
                              </div>
                              <span className={`badge ${step.status === 'COMPLETED' ? 'badge-undisputed' : (step.status === 'ACTIVE' ? 'badge-contested' : 'badge-pending')}`}>
                                {trStat(step.status)}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--theme-text-primary)', margin: '0 0 0.35rem 0' }}>
                              {tr(step.title)}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--theme-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                              {tr(step.description)}
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
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--theme-text-primary)' }}>
                          <Calendar size={18} color="#d97706" />
                          {tr('Past & Scheduled Courtroom Hearings (CMH Sessions)')}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>
                          {tr('Clash-free hearing calendar with WebRTC secure virtual courtroom integration.')}
                        </p>
                      </div>
                      <span className="badge badge-pending">
                        {tr('Total Sessions:')} {dossier.hearings?.length || 0}
                      </span>
                    </div>

                    {dossier.hearings && dossier.hearings.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                        {dossier.hearings.map((h, i) => (
                          <div key={h.id || i} style={{
                            background: h.is_upcoming ? 'var(--theme-orange-tint)' : 'var(--theme-card)',
                            border: h.is_upcoming ? '1.5px solid var(--theme-orange-border)' : '1px solid var(--theme-border)',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            borderLeft: h.status === 'CONCLUDED' ? '4px solid #10b981' : (h.is_upcoming ? '5px solid #d97706' : '4px solid #b45309'),
                            boxShadow: h.is_upcoming ? '0 4px 14px rgba(217, 119, 6, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)'
                          }}>
                            {h.is_upcoming && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ffedd5', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                                <Sparkles size={12} />
                                {tr('NEXT UPCOMING JUDICIAL PROCEEDING')}
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--theme-text-primary)' }}>
                                {tr('Hearing')} #{i + 1} • {h.hearing_date}
                              </span>
                              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                {h.relative_badge && (
                                  <span className={`hearing-pill-badge ${h.relative_badge.includes('Next Week') ? 'pill-next-week' : (h.relative_badge.includes('Next Month') ? 'pill-next-month' : 'pill-standard')}`} style={{ fontSize: '0.7rem' }}>
                                    {trRel(h.relative_badge)}
                                  </span>
                                )}
                                <span className={`badge ${h.status === 'CONCLUDED' ? 'badge-undisputed' : 'badge-pending'}`}>
                                  {trStat(h.status)}
                                </span>
                              </div>
                            </div>

                            <div style={{ fontSize: '0.85rem', color: 'var(--theme-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Scale size={14} color="#64748b" />
                                <span>{tr('Purpose:')} <strong>{h.purpose ? tr(h.purpose) : tr('Order XV-A Pre-Trial Hearing')}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Clock size={14} color="#64748b" />
                                <span>{tr('Time Slot:')} <strong>{h.start_time} - {h.end_time}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Building size={14} color="#64748b" />
                                <span>{tr('Court Hall:')} <strong>{h.court_hall_id}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Lock size={14} color="#64748b" />
                                <span>{tr('WebRTC Room:')} <code className="mono" style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>{h.webrtc_room_id}</code></span>
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setActiveTab('scheduler');
                              }}
                              style={{
                                width: '100%',
                                background: h.status === 'CONCLUDED' ? 'var(--theme-card)' : '#d97706',
                                color: h.status === 'CONCLUDED' ? 'var(--theme-text-secondary)' : '#ffffff',
                                border: '1px solid var(--theme-border)',
                                padding: '0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                boxShadow: h.status === 'CONCLUDED' ? 'none' : '0 2px 6px rgba(217, 119, 6, 0.3)'
                              }}
                            >
                              <ExternalLink size={13} />
                              {h.status === 'CONCLUDED' ? tr('View Concluded Proceedings') : tr('Launch Virtual Courtroom')}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>{tr('No hearings recorded yet. Use the Smart Clash-Free Scheduler to allot a session.')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION C: PLEADINGS & EXHIBITS */}
                {(dossierSubTab === 'all' || dossierSubTab === 'pleadings') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--theme-text-primary)' }}>
                          <FileCheck size={18} color="#d97706" />
                          {tr('Electronic Pleadings & Annexed Exhibits')}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>
                          {tr('Tamper-evident legal discovery verified via SHA-256 digital seals.')}
                        </p>
                      </div>
                      <span className="badge badge-undisputed">
                        {tr('Scrutiny Verified')}
                      </span>
                    </div>

                    {dossier.pleadings && dossier.pleadings.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {dossier.pleadings.map((p, idx) => (
                          <div key={p.id || idx} style={{
                            background: 'var(--theme-card)',
                            border: '1px solid var(--theme-border)',
                            borderRadius: '8px',
                            padding: '1.25rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--theme-text-primary)' }}>
                                  {tr(p.pleading_type.replace(/_/g, ' '))}
                                </span>
                                <span className="badge badge-undisputed" style={{ fontSize: '0.7rem' }}>
                                  {p.is_scrutinized ? tr('Scrutiny Passed') : tr('Pending Scrutiny')}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>
                                {tr('Filed on:')} {new Date(p.submitted_at).toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            <div style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)', borderRadius: '6px', padding: '0.65rem 0.85rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>
                                <span>{tr('Cryptographic SHA-256 Hash:')} </span>
                                <code className="mono" style={{ color: 'var(--theme-text-primary)', fontWeight: 600 }}>{p.sha256_checksum}</code>
                              </div>
                              <a 
                                href={p.file_storage_url} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                              >
                                <Eye size={13} />
                                {tr('View PDF Document')}
                              </a>
                            </div>

                            {/* Exhibits */}
                            {p.exhibits && p.exhibits.length > 0 && (
                              <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#3f3f46', marginBottom: '0.4rem' }}>
                                  {tr('Annexed Reliance Exhibits')} ({p.exhibits.length}):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                  {p.exhibits.map((ex) => (
                                    <div key={ex.id} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: '#ffffff',
                                      border: '1px solid #e4e4e7',
                                      borderRadius: '6px',
                                      padding: '0.4rem 0.75rem',
                                      fontSize: '0.8rem'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="mono" style={{ fontWeight: 700, color: '#b45309', background: '#fffbeb', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
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
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>{tr('No electronic pleadings filed yet.')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION D: ORDER XV-A ADMISSIONS MATRIX */}
                {(dossierSubTab === 'all' || dossierSubTab === 'matrix') && (
                  <div className="court-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#070d1e' }}>
                          <FileText size={18} color="#d97706" />
                          {tr('Order XV-A Admissions & Denials Matrix')}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#71717a' }}>
                          {tr('Pre-trial statutory evaluation of factual averments to eliminate uncontested issues.')}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{tr('Readiness Score')}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
                            {dossier.checklist ? Math.round((dossier.checklist.readiness_score || 0) * 100) : 0}%
                          </div>
                        </div>
                        <span className={`badge ${dossier.checklist?.is_locked ? 'badge-undisputed' : 'badge-contested'}`}>
                          {dossier.checklist?.is_locked ? tr('Matrix Locked') : tr('Admissions Open')}
                        </span>
                      </div>
                    </div>

                    {dossier.checklist?.items && dossier.checklist.items.length > 0 ? (
                      <table className="court-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}>#</th>
                            <th>{tr('Factual Averment')}</th>
                            <th style={{ width: '130px' }}>{tr('Plaintiff Stance')}</th>
                            <th style={{ width: '130px' }}>{tr('Defendant Stance')}</th>
                            <th>{tr('Statutory Justification / Denial Note')}</th>
                            <th style={{ width: '140px' }}>{tr('Resolution')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dossier.checklist.items.map((it) => (
                            <tr key={it.id}>
                              <td className="mono" style={{ fontWeight: 700, color: '#71717a' }}>
                                #{it.statement_index}
                              </td>
                              <td style={{ fontWeight: 500, color: '#070d1e' }}>
                                {it.factual_statement}
                              </td>
                              <td>
                                <span className={`badge ${it.plaintiff_stance?.includes('ADMIT') ? 'badge-undisputed' : (it.plaintiff_stance === 'DENY' ? 'badge-contested' : 'badge-pending')}`}>
                                  {trStn(it.plaintiff_stance)}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${it.defendant_stance?.includes('ADMIT') ? 'badge-undisputed' : (it.defendant_stance === 'DENY' ? 'badge-contested' : 'badge-pending')}`}>
                                  {trStn(it.defendant_stance)}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.8rem', color: it.statutory_denial_reason ? '#dc2626' : '#a1a1aa' }}>
                                {it.statutory_denial_reason || tr('— None —')}
                              </td>
                              <td>
                                <span className={`badge ${it.resolution_status === 'UNDISPUTED_FACT' ? 'badge-undisputed' : (it.resolution_status === 'CONTESTED_ISSUE' ? 'badge-contested' : 'badge-pending')}`}>
                                  {trStn(it.resolution_status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#71717a' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>{tr('No admissions checklist items found.')}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION E: CASE MANAGEMENT ORDER (CMO) */}
                {(dossierSubTab === 'all' || dossierSubTab === 'cmo') && (
                  <div className="court-card" style={{ border: '2px solid #070d1e', background: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e4e4e7', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                          {tr('Form 4 • Commercial Courts Act, 2015')}
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--theme-text-primary)' }}>
                          {tr('Case Management Order (CMO) Under Order XV-A Rule 5')}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${dossier.cmo?.is_digitally_signed ? 'badge-undisputed' : 'badge-pending'}`}>
                          <ShieldCheck size={14} />
                          {dossier.cmo?.is_digitally_signed ? tr('Digitally Signed & Sealed') : tr('Draft / Awaiting Seal')}
                        </span>
                      </div>
                    </div>

                    {dossier.cmo ? (
                      <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}>
                            {tr('1. Certified Undisputed Factual Averments:')}
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--theme-text-secondary)', background: 'var(--theme-card)', padding: '0.75rem 1rem', borderRadius: '6px', whiteSpace: 'pre-line', lineHeight: 1.6, border: '1px solid var(--theme-border)' }}>
                            {dossier.cmo.undisputed_facts_summary}
                          </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}>
                            {tr('2. Framed Triable Issues For Trial:')}
                          </h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--theme-text-primary)', background: 'var(--theme-orange-tint)', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '4px solid #d97706' }}>
                            {(() => {
                              try {
                                let raw = dossier.cmo.framed_issues_json;
                                if (raw && typeof raw === "string" && raw.startsWith("[") && raw.includes("'")) {
                                  raw = raw.replace(/'/g, "\"");
                                }
                                const issues = JSON.parse(raw);
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
                          <div style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>{tr('Plaintiff Witness Quota')}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                              {tr('Max')} {dossier.cmo.witness_quota_plaintiff} {tr('Witnesses')}
                            </div>
                          </div>

                          <div style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>{tr('Defendant Witness Quota')}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                              {tr('Max')} {dossier.cmo.witness_quota_defendant} {tr('Witnesses')}
                            </div>
                          </div>
                        </div>

                        {/* Deadlines */}
                        {dossier.cmo.deadlines && dossier.cmo.deadlines.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}>
                              {tr('3. Binding Discovery & Trial Timetable:')}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {dossier.cmo.deadlines.map((dl, idx) => (
                                <div key={dl.id || idx} style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: 'var(--theme-card)',
                                  border: '1px solid var(--theme-border)',
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem'
                                }}>
                                  <span style={{ fontWeight: 600, color: 'var(--theme-text-primary)' }}>
                                    • {tr(dl.task_description)}
                                  </span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className="mono" style={{ color: '#b45309', fontWeight: 700 }}>
                                      {tr('Deadline:')} {dl.due_date}
                                    </span>
                                    <span className={`badge ${dl.status === 'COMPLETED' ? 'badge-undisputed' : 'badge-pending'}`}>
                                      {trDStat(dl.status)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Official Seal Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed var(--theme-border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <QrCode size={48} color={theme === 'dark' ? '#f4f4f5' : '#070d1e'} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>
                              <div style={{ fontWeight: 700, color: 'var(--theme-text-primary)' }}>{tr('National Judicial Digital Seal')}</div>
                              <div>{tr('QR Verification:')} <span className="mono">{dossier.cmo.qr_verification_code || 'ECOURTS-CMO-IN-MP-IND'}</span></div>
                              <div>{tr('Digest:')} <span className="mono">{dossier.cmo.sha256_digest ? dossier.cmo.sha256_digest.substring(0, 20) + '...' : 'Verified'}</span></div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                              ({dossier.judge?.full_name || (lang === 'HI' ? "माननीय न्यायमूर्ति राजेश शर्मा" : "Hon'ble Justice Rajesh Sharma")})
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>
                              {tr('Presiding Judicial Officer, Commercial Bench')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>
                          {tr('Case Management Order is pending issuance following conclusion of the virtual CMH session.')}
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
                <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#b45309' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
                    {tr('Fact Checklist')}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                    {matrix?.items?.length || 0} {tr('Averments')}
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
                    {tr('Undisputed Facts')}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                    {matrix?.items?.filter(i => i.resolution_status === 'UNDISPUTED_FACT').length || 0}
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#92400e' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
                    {tr('Contested Issues (Trial)')}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400e' }}>
                    {matrix?.items?.filter(i => i.resolution_status === 'CONTESTED_ISSUE').length || 0}
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: '#070d1e', color: '#d97706' }}>
                  <Clock size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#71717a', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>{tr('Pre-Trial Readiness')}</span>
                    <span style={{ color: '#b45309', fontWeight: 800 }}>{Math.round((matrix?.readiness_score != null && matrix.readiness_score <= 1) ? matrix.readiness_score * 100 : (matrix?.readiness_score || 0))}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.round((matrix?.readiness_score != null && matrix.readiness_score <= 1) ? matrix.readiness_score * 100 : (matrix?.readiness_score || 0))}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Civic Legal Education Guidance */}
            {currentRole === 'CITIZEN' && (
              <div className="statutory-restriction-callout" style={{ marginBottom: '1rem', background: 'rgba(20, 184, 166, 0.08)', borderColor: 'rgba(20, 184, 166, 0.4)' }}>
                <Globe size={18} style={{ flexShrink: 0, color: '#0d9488' }} />
                <span><strong style={{ color: '#0f766e' }}>{tr('Civic Legal Transparency (Order XV-A CPC):')}</strong> {tr('You are inspecting the factual matrix of this commercial dispute. In Indian Commercial Courts, parties must explicitly admit or deny factual averments prior to trial. Undisputed facts are permanently crystallized by the Judge without requiring lengthy witness hearings, saving public judicial time. As a member of the public, this view is read-only.')}</span>
              </div>
            )}

            {/* Section 89 CPC Mediation Referral Status Banner */}
            {adrReferralNotice && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.25rem',
                color: 'var(--theme-text-primary)',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                          Decree Under Section 89 CPC
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                          Referral No: {adrReferralNotice.referralNumber}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 800 }}>
                        {adrReferralNotice.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--theme-text-secondary)', lineHeight: 1.5 }}>
                        {adrReferralNotice.message}
                      </p>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                        ✓ 100% Court Fee Refund Certificate authorized under Section 16 of the Court Fees Act, 1870.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAdrReferralNotice(null)}
                    style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Section 89 CPC Mediation Referral Recommendation Engine */}
            {(() => {
              const undisputedCount = matrix?.items?.filter(i => i.resolution_status === 'UNDISPUTED_FACT').length || 0;
              const totalItems = matrix?.items?.length || 1;
              const consensusScore = Math.round((undisputedCount / totalItems) * 100);

              if (consensusScore >= 40 || matrix?.readiness_score >= 0.4) {
                return (
                  <div className="section89-card">
                    <div style={{ background: '#fffbeb', border: '1.5px solid #d97706', borderRadius: '10px', padding: '0.65rem', color: '#b45309', flexShrink: 0 }}>
                      <Award size={26} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <span style={{ background: '#b45309', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                          Section 89 CPC Pre-Trial ADR Engine
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800 }}>
                          High Consensus Rate ({consensusScore}% Facts Agreed)
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                        {tr("Section 89 CPC Pre-Trial Mediation Recommended")}
                      </h4>

                      <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.825rem', color: 'var(--theme-text-secondary)', lineHeight: 1.5 }}>
                        Under Order X Rule 1A and Section 89 of the Code of Civil Procedure, 1908, when factual averments show substantial pre-trial consensus, the Court actively encourages settlement before trial expenses escalate. If settled through High Court Mediation or Lok Adalat, parties are entitled to a <strong>100% full refund of all paid court fees (₹90,000.00)</strong> under Section 16 of the Court Fees Act, 1870.
                      </p>

                      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setAdrReferralNotice({
                              referralNumber: `MPHC/IND/ADR/${new Date().getFullYear()}/0482`,
                              title: 'Matter Referred to High Court Mediation Centre (Indore Bench)',
                              message: `By Judicial Order under Section 89 CPC, Case ${activeCase?.cnr_number || 'MPIN01593559452026'} is referred to Senior Accredited Mediator Shri S. K. Jain, District Judge (Retd.). First conciliation session scheduled for 05 Nov 2026 at 11:00 AM at High Court Mediation Annex, Indore.`
                            });
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem 0.95rem',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)'
                          }}
                        >
                          <Gavel size={14} />
                          <span>{tr("High Court Mediation Centre Referral")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAdrReferralNotice({
                              referralNumber: `MP-LOK-ADALAT/${new Date().getFullYear()}/7109`,
                              title: 'Matter Referred to National Lok Adalat (Compounded Decree)',
                              message: `Case ${activeCase?.cnr_number || 'MPIN01593559452026'} is listed before the Indore High Court Lok Adalat Bench. Settlement award will have the finality of a Civil Court Decree without right of appeal under Section 21 Legal Services Authorities Act, 1987.`
                            });
                          }}
                          style={{
                            background: 'var(--theme-card)',
                            border: '1.5px solid #10b981',
                            color: '#10b981',
                            borderRadius: '8px',
                            padding: '0.5rem 0.95rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Scale size={14} />
                          <span>{tr("Refer to National Lok Adalat")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="court-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--theme-text-primary)', margin: '0 0 0.25rem 0' }}>
                    {currentRole === 'CITIZEN'
                      ? tr('Order XV-A Fact Crystallization Public Audit')
                      : (currentRole === 'LITIGANT' ? tr('Admissions & Evidentiary Audit Workspace (Order XV-A Rule 2)') : tr('Pre-Trial Fact Crystallization Workspace (Order XV-A Rule 2)'))}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--theme-text-muted)', margin: 0 }}>
                    {currentRole === 'CITIZEN'
                      ? tr('Transparent public view of admitted vs contested claims. Undisputed statements are resolved without witness delays.')
                      : (currentRole === 'LITIGANT' 
                        ? tr('Audit verified statements of fact admitted or contested by legal counsels. Undisputed facts avoid costly trial delays.')
                        : tr('Both counsels mark evidentiary stances online. Mutual admissions lock permanently as undisputed facts.'))}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {currentRole === 'JUDGE' && (
                    <button 
                      onClick={handleLockMatrix}
                      disabled={matrix?.is_locked}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: matrix?.is_locked ? 'var(--theme-text-muted)' : (theme === 'dark' ? '#1e293b' : '#070d1e'),
                        color: 'white',
                        border: '1px solid #d97706',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: matrix?.is_locked ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                      }}
                    >
                      <Lock size={16} />
                      {matrix?.is_locked ? tr('Matrix Locked by Court') : tr('Lock & Finalize Matrix')}
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
                    {tr('Refresh')}
                  </button>
                </div>
              </div>

              <table className="court-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>{tr('Factual Averment & Reliance Exhibits')}</th>
                    <th style={{ width: '180px' }}>{tr('Plaintiff Stance')}</th>
                    <th style={{ width: '180px' }}>{tr('Defendant Stance')}</th>
                    <th style={{ width: '160px' }}>{tr('Evidentiary Status')}</th>
                    <th style={{ width: '180px' }}>
                      {currentRole === 'CITIZEN' ? tr('Civic Transparency') : (currentRole === 'LITIGANT' ? tr('Evidentiary Representation') : (currentRole === 'JUDGE' ? tr('Judicial Oversight') : (currentRole === 'CLERK' ? tr('Registry Audit') : tr(`Actions (${currentRole.replace('ADVOCATE_', '')})`))))}
                    </th>
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
                            {tr('Denial Justification:')} {item.statutory_denial_reason}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${item.plaintiff_stance === 'DENY' ? 'badge-contested' : (item.plaintiff_stance === 'PENDING' ? 'badge-pending' : 'badge-undisputed')}`}>
                          {trStn(item.plaintiff_stance)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${item.defendant_stance === 'DENY' ? 'badge-contested' : (item.defendant_stance === 'PENDING' ? 'badge-pending' : 'badge-undisputed')}`}>
                          {trStn(item.defendant_stance)}
                        </span>
                      </td>
                      <td>
                        {item.resolution_status === 'UNDISPUTED_FACT' && (
                          <span className="badge badge-undisputed">
                            <CheckCircle2 size={13} />
                            {tr('UNDISPUTED FACT')}
                          </span>
                        )}
                        {item.resolution_status === 'CONTESTED_ISSUE' && (
                          <span className="badge badge-contested">
                            <AlertTriangle size={13} />
                            {tr('CONTESTED ISSUE')}
                          </span>
                        )}
                        {item.resolution_status === 'PENDING' && (
                          <span className="badge badge-pending">
                            <Clock size={13} />
                            {tr('PENDING OVERLAP')}
                          </span>
                        )}
                      </td>
                      <td>
                        {matrix?.is_locked ? (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Lock size={12} />
                            {tr('Locked Under Rule 3(2)')}
                          </span>
                        ) : currentRole === 'CITIZEN' ? (
                          <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Globe size={12} />
                            <span>{tr('Public Record')}</span>
                          </span>
                        ) : currentRole === 'LITIGANT' ? (
                          <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Shield size={12} />
                            <span>{tr('Counsel Represented')}</span>
                          </span>
                        ) : currentRole === 'JUDGE' ? (
                          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Gavel size={12} />
                            <span>{tr('Judicial Review')}</span>
                          </span>
                        ) : currentRole === 'CLERK' ? (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <ShieldCheck size={12} />
                            <span>{tr('Registry Audit')}</span>
                          </span>
                        ) : (
                          <div className="stance-btn-group">
                            <button 
                              className="stance-btn"
                              title={tr('Admit Contents')}
                              onClick={() => handleStanceChange(item.id, 'ADMIT_CONTENTS')}
                            >
                              <Check size={14} style={{ color: '#059669', display: 'inline', marginRight: '2px' }} />
                              {tr('Admit')}
                            </button>
                            <button 
                              className="stance-btn"
                              title={tr('Deny Allegation')}
                              onClick={() => handleStanceChange(item.id, 'DENY')}
                            >
                              <X size={14} style={{ color: '#dc2626', display: 'inline', marginRight: '2px' }} />
                              {tr('Deny')}
                            </button>
                          </div>
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
            {currentRole === 'JUDGE' ? (
              <div className="court-card">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', color: '#d97706', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  <Gavel size={13} />
                  {tr('Judicial Bench Administration')}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#070d1e' }}>
                  {tr('Commercial Division Docket Roster')}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.25rem' }}>
                  {tr("As Hon'ble Presiding Judge (Court Hall 04, Indore Bench), review commercial matters pending pre-trial fact crystallization and Case Management Hearings (CMH) under Order XV-A CPC.")}
                </p>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div><strong>{tr('Court Assignment:')}</strong> {tr('Court Hall 04 (Indore Principal Commercial Bench)')}</div>
                  <div><strong>{tr('Pre-Trial Readiness Threshold:')}</strong> {tr('80% factual crystallisation required before framing trial issues.')}</div>
                  <div><strong>{tr('Order XV-A Rule 1 Mandate:')}</strong> {tr('First Case Management Hearing must be held within four weeks of pleadings completion.')}</div>
                </div>
              </div>
            ) : currentRole === 'CLERK' ? (
              <div className="court-card">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(5, 150, 105, 0.15)', border: '1px solid #059669', color: '#047857', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  <ShieldCheck size={13} />
                  {tr('Registry Scrutiny Desk')}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#070d1e' }}>
                  {tr('Docket Scrutiny & Cause Board')}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.25rem' }}>
                  {tr('Verify court fees compliance, assign 16-digit CNR numbers, and synchronize daily cause list displays for Court Hall 04.')}
                </p>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#065f46' }}>
                  <div><strong>{tr('Daily Cause List Status:')}</strong> {tr('Active & Synchronized with CIS 3.2')}</div>
                  <div><strong>{tr('Pending Scrutinies:')}</strong> {tr('3 Matters awaiting court fee stamps')}</div>
                  <div><strong>{tr('Registry Contact:')}</strong> {tr('Court Hall 04 Reader Desk')}</div>
                </div>
              </div>
            ) : (
              <div className="court-card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#070d1e' }}>
                  <Plus size={18} color="#d97706" />
                  {tr('New Case e-Filing (CNR Intake)')}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.25rem' }}>
                  {tr('Order XV-A statutory filing under Commercial Courts Act, 2015.')}
                </p>

                <form onSubmit={handleCreateCase}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      {tr('Case Title / Parties')}
                    </label>
                    <input 
                      type="text" 
                      placeholder={tr('e.g., Bharat Telecom vs. Global Cloud Corp')}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      {tr('Claim Valuation (INR)')}
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
                      {tr('Court Hall Assignment')}
                    </label>
                    <select 
                      value={newHall}
                      onChange={(e) => setNewHall(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="HALL_04">{tr('Court Hall 4 (Commercial Bench)')}</option>
                      <option value="HALL_02">{tr('Court Hall 2 (Civil Recovery)')}</option>
                      <option value="HALL_01">{tr('Court Hall 1 (Chief Commercial Judge)')}</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                    }}
                  >
                    {tr('Generate 16-Digit CNR & File Case')}
                  </button>
                </form>
              </div>
            )}

            <div className="court-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#070d1e' }}>
                    {tr('Active Commercial Court Dockets')} ({displayedCases.length})
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#71717a', margin: '0.2rem 0 0 0' }}>
                    {tr('Select any case below to switch the active Admissions Matrix and scheduling view.')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    onClick={() => setTableRosterFilter('ALL')}
                    className={`roster-filter-btn ${tableRosterFilter === 'ALL' ? 'active' : ''}`}
                    style={{ background: tableRosterFilter === 'ALL' ? '#070d1e' : '#f4f4f5', color: tableRosterFilter === 'ALL' ? '#ffffff' : '#3f3f46', borderColor: '#d4d4d8' }}
                  >
                    {tr('All')} ({cases.length})
                  </button>
                  <button 
                    onClick={() => setTableRosterFilter('NEXT_WEEK')}
                    className={`roster-filter-btn ${tableRosterFilter === 'NEXT_WEEK' ? 'active' : ''}`}
                    style={{ background: tableRosterFilter === 'NEXT_WEEK' ? '#d97706' : '#fffbeb', color: tableRosterFilter === 'NEXT_WEEK' ? '#ffffff' : '#92400e', borderColor: '#fde68a' }}
                  >
                    ⚡ {tr('Next Week')} ({nextWeekCount})
                  </button>
                  <button 
                    onClick={() => setTableRosterFilter('NEXT_MONTH')}
                    className={`roster-filter-btn ${tableRosterFilter === 'NEXT_MONTH' ? 'active' : ''}`}
                    style={{ background: tableRosterFilter === 'NEXT_MONTH' ? '#1e293b' : '#f4f4f5', color: tableRosterFilter === 'NEXT_MONTH' ? '#ffffff' : '#1e293b', borderColor: '#d4d4d8' }}
                  >
                    📅 {tr('Next Month')} ({nextMonthCount})
                  </button>
                </div>
              </div>

              <table className="court-table">
                <thead>
                  <tr>
                    <th>{tr('16-Digit CNR')}</th>
                    <th>{tr('Case Title')}</th>
                    <th>{tr('Valuation')}</th>
                    <th>{tr('Status')}</th>
                    <th>{tr('Next Hearing & Purpose')}</th>
                    <th>{tr('Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCases.map((c) => (
                    <tr key={c.id} style={{ background: activeCase?.id === c.id ? '#fffbeb' : 'transparent' }}>
                      <td className="mono" style={{ fontWeight: 700, color: '#b45309' }}>
                        {c.cnr_number}
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {c.case_title}
                      </td>
                      <td className="mono">
                        ₹ {parseFloat(c.claim_valuation).toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="badge badge-pending">{trStat(c.status)}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#070d1e' }}>{c.next_hearing_formatted ? trRel(c.next_hearing_formatted) : tr('Pending')}</strong>
                            {c.next_hearing_relative && (
                              <span className={`hearing-pill-badge ${c.next_hearing_relative.includes('Next Week') ? 'pill-next-week' : (c.next_hearing_relative.includes('Next Month') ? 'pill-next-month' : 'pill-standard')}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                                {trRel(c.next_hearing_relative)}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{c.next_hearing_purpose ? tr(c.next_hearing_purpose) : tr('Order XV-A CMH')}</span>
                        </div>
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
                              background: '#070d1e',
                              color: 'white',
                              border: 'none',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {tr('Open Matrix')}
                          </button>
                          <button 
                            onClick={() => loadCaseDossier(c.cnr_number)}
                            style={{
                              background: '#d97706',
                              color: 'white',
                              border: 'none',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
                            }}
                          >
                            <Search size={12} />
                            {tr('Full Dossier')}
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#070d1e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} color="#d97706" />
                {tr('Cross-Courtroom Advocate Schedule Clash Detection Engine')}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#71717a' }}>
                {tr('Statutory anti-collision algorithm: scans all court halls to eliminate advocate double-booking adjournments.')}
              </p>
            </div>

            {/* Quick Live Hearing Presets */}
            <div style={{ marginBottom: '1.25rem', background: 'var(--theme-card)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--theme-border)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--theme-text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                {tr('⚡ Quick Presets (Schedule for Live Demonstration):')}
              </span>
              <div className="quick-preset-bar">
                <button 
                  type="button" 
                  className={`quick-preset-btn ${schedDate === '2026-10-28' ? 'active' : ''}`}
                  onClick={() => setSchedDate('2026-10-28')}
                >
                  <Calendar size={13} />
                  {tr('Next Week: 28 Oct (Wed)')}
                </button>
                <button 
                  type="button" 
                  className={`quick-preset-btn ${schedDate === '2026-11-03' ? 'active' : ''}`}
                  onClick={() => setSchedDate('2026-11-03')}
                >
                  <Calendar size={13} />
                  {tr('Next Week: 03 Nov (Tue)')}
                </button>
                <button 
                  type="button" 
                  className={`quick-preset-btn ${schedDate === '2026-11-10' ? 'active' : ''}`}
                  onClick={() => setSchedDate('2026-11-10')}
                >
                  <Calendar size={13} />
                  {tr('In 2 Weeks: 10 Nov (Tue)')}
                </button>
                <button 
                  type="button" 
                  className={`quick-preset-btn ${schedDate === '2026-11-24' ? 'active' : ''}`}
                  onClick={() => setSchedDate('2026-11-24')}
                >
                  <Calendar size={13} />
                  {tr('Next Month: 24 Nov (Tue)')}
                </button>
                <button 
                  type="button" 
                  className={`quick-preset-btn ${schedDate === '2026-12-01' ? 'active' : ''}`}
                  onClick={() => setSchedDate('2026-12-01')}
                >
                  <Calendar size={13} />
                  {tr('Next Month: 01 Dec (Tue)')}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)', marginBottom: '0.35rem' }}>
                  {tr('Target Hearing Date')}
                </label>
                <input 
                  type="date" 
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid var(--theme-border)', borderRadius: '6px', background: 'var(--theme-card)', color: 'var(--theme-text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)', marginBottom: '0.35rem' }}>
                  {tr('Start Time (Slot)')}
                </label>
                <input 
                  type="time" 
                  value={schedStartTime}
                  onChange={(e) => setSchedStartTime(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid var(--theme-border)', borderRadius: '6px', background: 'var(--theme-card)', color: 'var(--theme-text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)', marginBottom: '0.35rem' }}>
                  {tr('End Time')}
                </label>
                <input 
                  type="time" 
                  value={schedEndTime}
                  onChange={(e) => setSchedEndTime(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid var(--theme-border)', borderRadius: '6px', background: 'var(--theme-card)', color: 'var(--theme-text-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-secondary)', marginBottom: '0.35rem' }}>
                  {tr('Court Hall')}
                </label>
                <select 
                  value={schedHall}
                  onChange={(e) => setSchedHall(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px solid var(--theme-border)', borderRadius: '6px', background: 'var(--theme-card)', color: 'var(--theme-text-primary)' }}
                >
                  <option value="HALL_04">{tr('Court Hall 4 (Commercial Bench)')}</option>
                  <option value="HALL_02">{tr('Court Hall 2 (Civil Recovery)')}</option>
                  <option value="HALL_01">{tr('Court Hall 1 (Chief Judge)')}</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleCheckClash}
                disabled={checkingClash}
                style={{
                  background: '#070d1e',
                  color: 'white',
                  border: '1px solid #334155',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <ShieldCheck size={18} />
                {checkingClash ? tr('Scanning Roster...') : tr('1. Scan Multi-Hall Roster for Conflicts')}
              </button>

              <button 
                onClick={handleBookSlot}
                disabled={clashResult?.has_conflict}
                style={{
                  background: clashResult?.has_conflict ? '#d4d4d8' : '#d97706',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: clashResult?.has_conflict ? 'not-allowed' : 'pointer',
                  boxShadow: clashResult?.has_conflict ? 'none' : '0 4px 14px rgba(217, 119, 6, 0.35)'
                }}
              >
                {tr('2. Confirm Slot & Generate WebRTC Room')}
              </button>
            </div>

            {clashResult && (
              <div className={`clash-alert ${clashResult.has_conflict ? 'danger' : 'success'}`}>
                {clashResult.has_conflict ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {clashResult.has_conflict ? tr('ADVOCATE DOUBLE-BOOKING COLLISION DETECTED!') : tr('SLOT VERIFIED: ZERO ADVOCATE CLASHES')}
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {clashResult.has_conflict 
                      ? clashResult.conflict_message 
                      : (lang === 'HI' ? `दोनों अधिवक्ता (अधिवक्ता हिमांशु MP/14297 एवं अधिवक्ता प्रिया MP/11054) ${schedStartTime} से ${schedEndTime} तक सभी न्यायालय खंडपीठों में पूरी तरह उपलब्ध हैं।` : `Both counsels (Adv. Himanshu MP/14297 and Adv. Priya MP/11054) are completely free across all district court benches during ${schedStartTime} - ${schedEndTime}.`)}
                  </p>
                </div>
              </div>
            )}

            {bookingSuccess && (
              <div className="clash-alert success" style={{ marginTop: '1rem' }}>
                <CheckCircle2 size={24} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {tr('HEARING SESSION CONFIRMED IN CALENDAR!')}
                  </div>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {tr('Session registered for')} {bookingSuccess.hearing_date}. {tr('In-Browser WebRTC Room:')} <span className="mono" style={{ fontWeight: 700 }}>{bookingSuccess.webrtc_room_id}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CASE MANAGEMENT ORDER (CMO) */}
        {activeTab === 'cmo' && (
          <div className="court-card" style={{ maxWidth: '800px', margin: '0 auto', border: '2px solid var(--theme-border)', boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08)' }}>
            {/* Role-Specific Action Bar */}
            {currentRole === 'JUDGE' ? (
              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Gavel size={18} color="#b45309" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9a3412' }}>{tr('Judicial Case Management Order Execution')}</div>
                    <div style={{ fontSize: '0.74rem', color: '#7c2d12' }}>{tr('Affix official Class-3 DSC cryptographic signature to finalize discovery timetable and framed issues.')}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      background: '#1e293b',
                      color: '#f4f4f5',
                      border: '1px solid #3f3f46',
                      borderRadius: '6px',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Printer size={14} />
                    <span>Print Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Judicial Order Signed! e-Mudhra Token 2048-bit RSA Certificate appended. Case Management Order is now legally binding under Order XV-A Rule 6 CPC.')}
                    style={{
                      background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)'
                    }}
                  >
                    <ShieldCheck size={14} />
                    <span>{tr('Sign CMO with Judicial DSC')}</span>
                  </button>
                </div>
              </div>
            ) : currentRole === 'CITIZEN' ? (
              <div style={{ background: 'rgba(20, 184, 166, 0.08)', border: '1.5px solid rgba(20, 184, 166, 0.4)', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={18} color="#0d9488" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f766e' }}>{tr('Open Justice Certified Case Management Order (Public Copy)')}</div>
                    <div style={{ fontSize: '0.74rem', color: '#115e59' }}>{tr('Section 65B Indian Evidence Act compliant official decree copy for public inspection & civic transparency.')}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Certified Public Copy Downloaded: MPIN01593559452026_CMO_Public_Certified.pdf (Digitally Sealed by High Court of Madhya Pradesh)')}
                  style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.35)'
                  }}
                >
                  <Download size={14} />
                  <span>{tr('Download Certified Public Copy (PDF)')}</span>
                </button>
              </div>
            ) : currentRole === 'LITIGANT' ? (
              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={18} color="#7c3aed" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#5b21b6' }}>{tr('Certified Decree / CMO Electronic Record')}</div>
                    <div style={{ fontSize: '0.74rem', color: '#6d28d9' }}>{tr('Admissible as authentic electronic evidence under Section 65B Indian Evidence Act, 1872.')}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Certified Copy Downloaded: MPIN01593559452026_CMO_Certified.pdf (Digitally Sealed by High Court of Madhya Pradesh)')}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)'
                  }}
                >
                  <Download size={14} />
                  <span>{tr('Download Certified True Copy (PDF)')}</span>
                </button>
              </div>
            ) : currentRole === 'CLERK' ? (
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>{tr('Court Registry Sealing Desk')}</div>
                    <div style={{ fontSize: '0.74rem', color: '#047857' }}>{tr('Affix official court watermark seal and dispatch certified copies to counsels and parties.')}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Registry Seal Affixed: Certified copy transmitted to counsel on record.')}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.35)'
                  }}
                >
                  <FileCheck size={14} />
                  <span>{tr('Seal & Dispatch Certified Order')}</span>
                </button>
              </div>
            ) : (
              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scale size={18} color="#0284c7" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#075985' }}>{tr('Advocate Timetable & Compliance Tracker')}</div>
                    <div style={{ fontSize: '0.74rem', color: '#0369a1' }}>{tr('Export mandatory discovery dates and witness affidavit deadlines to advocate legal diary.')}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Compliance Deadlines Exported to Legal Diary & Calendar Sync (.ics)')}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Download size={14} />
                  <span>{tr('Export Compliance Deadlines (.ICS)')}</span>
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--theme-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 className="serif-court" style={{ fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-primary)' }}>
                {tr('In the Commercial Court of Indore, Madhya Pradesh')}
              </h2>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#b45309', marginTop: '0.25rem' }}>
                {tr('Order Under Order XV-A, Rule 6 Code of Civil Procedure, 1908')}
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--theme-text-secondary)', marginTop: '0.2rem' }}>
                CNR: {activeCase?.cnr_number || 'MPIN010012342026'}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}>
                {tr('1. Undisputed Facts Settled in Admissions Matrix:')}
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--theme-text-secondary)' }}>
                <li>{tr('Execution of Master Agreement dated 15 Jan 2026 is formally admitted by both parties.')}</li>
                <li>{tr('Receipt of Invoices #INV-2026-089 is admitted as valid business record.')}</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--theme-text-primary)', marginBottom: '0.4rem' }}>
                {tr('2. Framed Triable Issues for Trial:')}
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--theme-text-secondary)' }}>
                <li>{tr('Issue 1: Whether delivery consignment #DR-9921 was physically handed over in damaged condition? (Onus on Defendant)')}</li>
                <li>{tr('Issue 2: Whether plaintiff is entitled to interest @ 18% p.a. under MSME Act?')}</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#070d1e', marginBottom: '0.4rem' }}>
                {tr('3. Mandatory Discovery Timetable:')}
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#1e293b', background: '#fffbeb', borderLeft: '4px solid #d97706', padding: '0.75rem', borderRadius: '6px' }}>
                • {tr('Filing of witness affidavits:')} <strong>{tr('Within 15 days')}</strong> ({tr('Deadline:')} Oct 20, 2026)<br />
                • {tr('Inspection of original documents:')} <strong>{tr('Within 15 days')}</strong> ({tr('Deadline:')} Nov 05, 2026)<br />
                • {tr('Trial Commencement Date:')} <strong>Nov 25, 2026</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #d4d4d8', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <QrCode size={48} color="#070d1e" />
                <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                  <div style={{ fontWeight: 700, color: '#070d1e' }}>{tr('Digital Judicial Seal')}</div>
                  <div>SHA-256: 4a8f9b...e21c</div>
                  <div>{tr('Verified by e-Mudhra DSC')}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#070d1e' }}>
                  ({lang === 'HI' ? "माननीय न्यायमूर्ति राजेश शर्मा" : "Hon'ble Justice Rajesh Sharma"})
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {tr('Presiding Judicial Officer, Commercial Bench')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DAILY CAUSE LIST (ROZNAMCHA / BOARD) */}
        {activeTab === 'causelist' && (
          <div className="cause-list-container">
            {/* Header Banner & Filters */}
            <div className="cause-list-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid #d97706', color: '#b45309', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Calendar size={13} />
                    <span>{tr('High Court of Madhya Pradesh • Daily Hearing Board')}</span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--theme-text-primary)' }}>
                    {tr('Commercial Court Cause List & Hearing Board')}
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--theme-text-secondary)', margin: 0 }}>
                    {tr('Statutory daily hearing list published under Order XV-A Rule 1 CPC for Indore, Jabalpur, and Gwalior Benches.')}
                  </p>
                  <div style={{ marginTop: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: '6px', padding: '0.3rem 0.65rem', fontSize: '0.74rem', color: '#b45309' }}>
                    <ShieldCheck size={13} style={{ flexShrink: 0 }} />
                    <span><strong>{tr('Order XV-A Strict Admittance Rule:')}</strong> {tr('Virtual Courtrooms open strictly at scheduled hearing times (15 mins prior admittance). Unscheduled early entry is restricted for all participants.')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fetchDailyCauseList(causeListDate, causeListHall)}
                  className="ctrl-btn"
                  style={{ alignSelf: 'center' }}
                >
                  <RefreshCw size={14} className={loadingCauseList ? 'spin' : ''} />
                  <span>{loadingCauseList ? tr('Refreshing...') : tr('Refresh Board')}</span>
                </button>
              </div>

              {/* Filters */}
              <div className="cause-list-filters">
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    {tr('Select Hearing Date')}
                  </label>
                  <input
                    type="date"
                    value={causeListDate}
                    onChange={(e) => {
                      setCauseListDate(e.target.value);
                      fetchDailyCauseList(e.target.value, causeListHall);
                    }}
                    style={{
                      background: 'var(--theme-card-bg)',
                      border: '1px solid var(--theme-border)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      color: 'var(--theme-text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    {tr('Filter by Court Hall')}
                  </label>
                  <select
                    value={causeListHall}
                    onChange={(e) => {
                      setCauseListHall(e.target.value);
                      fetchDailyCauseList(causeListDate, e.target.value);
                    }}
                    style={{
                      background: 'var(--theme-card-bg)',
                      border: '1px solid var(--theme-border)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      color: 'var(--theme-text-primary)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="ALL">{tr('All Court Halls')}</option>
                    <option value="HALL_01">HALL_01 (Jabalpur Principal Seat)</option>
                    <option value="HALL_02">HALL_02 (Gwalior Commercial Bench)</option>
                    <option value="HALL_03">HALL_03 (Indore District Commercial)</option>
                    <option value="HALL_04">HALL_04 (Indore Commercial Court)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    {tr('Session Status')}
                  </label>
                  <select
                    value={causeListStatusFilter}
                    onChange={(e) => setCauseListStatusFilter(e.target.value)}
                    style={{
                      background: 'var(--theme-card-bg)',
                      border: '1px solid var(--theme-border)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      color: 'var(--theme-text-primary)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="ALL">All Statuses ({causeListItems.length})</option>
                    <option value="SCHEDULED">Scheduled Only</option>
                    <option value="IN_PROGRESS">In Progress (Live)</option>
                    <option value="CONCLUDED">Concluded</option>
                  </select>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignSelf: 'flex-end', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCauseListDate('2026-10-29');
                      fetchDailyCauseList('2026-10-29', causeListHall);
                    }}
                    className={`tag-btn ${causeListDate === '2026-10-29' ? 'active' : ''}`}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.35rem 0.65rem',
                      background: causeListDate === '2026-10-29' ? '#d97706' : undefined,
                      color: causeListDate === '2026-10-29' ? '#ffffff' : undefined,
                      fontWeight: causeListDate === '2026-10-29' ? 700 : undefined
                    }}
                  >
                    Today: 29 Oct (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCauseListDate('2026-10-30');
                      fetchDailyCauseList('2026-10-30', causeListHall);
                    }}
                    className={`tag-btn ${causeListDate === '2026-10-30' ? 'active' : ''}`}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.35rem 0.65rem',
                      background: causeListDate === '2026-10-30' ? '#d97706' : undefined,
                      color: causeListDate === '2026-10-30' ? '#ffffff' : undefined,
                      fontWeight: causeListDate === '2026-10-30' ? 700 : undefined
                    }}
                  >
                    Tomorrow: 30 Oct
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCauseListDate('2026-11-03');
                      fetchDailyCauseList('2026-11-03', causeListHall);
                    }}
                    className={`tag-btn ${causeListDate === '2026-11-03' ? 'active' : ''}`}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.35rem 0.65rem',
                      background: causeListDate === '2026-11-03' ? '#d97706' : undefined,
                      color: causeListDate === '2026-11-03' ? '#ffffff' : undefined,
                      fontWeight: causeListDate === '2026-11-03' ? 700 : undefined
                    }}
                  >
                    03 Nov (Tue)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCauseListDate('2026-11-10');
                      fetchDailyCauseList('2026-11-10', causeListHall);
                    }}
                    className={`tag-btn ${causeListDate === '2026-11-10' ? 'active' : ''}`}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.35rem 0.65rem',
                      background: causeListDate === '2026-11-10' ? '#d97706' : undefined,
                      color: causeListDate === '2026-11-10' ? '#ffffff' : undefined,
                      fontWeight: causeListDate === '2026-11-10' ? 700 : undefined
                    }}
                  >
                    10 Nov (Tue)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="cause-stat-grid">
              <div className="cause-stat-card">
                <div className="cause-stat-icon">
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {tr('Total Listed Cases')}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                    {causeListItems.length}
                  </div>
                </div>
              </div>

              <div className="cause-stat-card">
                <div className="cause-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Video size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {tr('Active Virtual Courtrooms')}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                    {causeListItems.filter(i => i.status === 'IN_PROGRESS' || i.status === 'SCHEDULED').length}
                  </div>
                </div>
              </div>

              <div className="cause-stat-card">
                <div className="cause-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <Building size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {tr('Presiding Benches')}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                    Indore • Jabalpur • Gwalior
                  </div>
                </div>
              </div>

              <div className="cause-stat-card">
                <div className="cause-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <Scale size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--theme-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {tr('Statutory Regime')}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6' }}>
                    Order XV-A CPC (2015)
                  </div>
                </div>
              </div>
            </div>

            {/* Cause Board Table */}
            <div className="cause-table-wrapper">
              <table className="cause-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>{tr('Item No.')}</th>
                    <th style={{ width: '130px' }}>{tr('Time Slot')}</th>
                    <th>{tr('Case Title / Parties')}</th>
                    <th>{tr('Stage / Purpose')}</th>
                    <th>{tr('Presiding Judicial Officer')}</th>
                    <th>{tr('Appearing Counsels')}</th>
                    <th style={{ width: '120px' }}>{tr('Session Status')}</th>
                    <th style={{ width: '150px', textAlign: 'center' }}>{tr('Virtual Courtroom')}</th>
                  </tr>
                </thead>
                <tbody>
                  {causeListItems
                    .filter(item => causeListStatusFilter === 'ALL' || item.status === causeListStatusFilter)
                    .map((item) => (
                      <tr key={item.session_id}>
                        <td>
                          <span style={{ fontWeight: 800, color: '#d97706' }}>#{item.item_number}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                            {item.start_time} - {item.end_time}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>
                            {item.court_hall_id}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                            {item.case?.case_title || 'Commercial Suit'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <span className="mono" style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 700 }}>
                              {item.case?.cnr_number}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>
                              • ₹{((item.case?.claim_valuation || 0) / 100000).toFixed(1)}L
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'inline-block', background: 'rgba(217, 119, 6, 0.1)', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700 }}>
                            Order XV-A CMH Pre-Trial
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--theme-text-primary)', fontSize: '0.82rem' }}>
                            {item.judge_name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)' }}>
                            Commercial Division Bench
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem' }}>
                            <strong style={{ color: '#0284c7' }}>P:</strong> {item.plaintiff_counsel?.name}
                          </div>
                          <div style={{ fontSize: '0.78rem' }}>
                            <strong style={{ color: '#7c3aed' }}>D:</strong> {item.defendant_counsel?.name}
                          </div>
                        </td>
                        <td>
                          {item.status === 'IN_PROGRESS' ? (
                            <span className="live-pulse-badge in-session">
                              <span className="live-dot"></span>
                              <span>In Session</span>
                            </span>
                          ) : item.status === 'CONCLUDED' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                              <CheckCircle2 size={12} />
                              <span>Concluded</span>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                              <Clock size={12} />
                              <span>Scheduled</span>
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const joinInfo = checkSessionJoinStatus(item);
                            if (joinInfo.is_joinable) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCourtroom(item)}
                                  title={tr('Active Hearing Window • Click to join virtual courtroom')}
                                  style={{
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    color: '#ffffff',
                                    border: '1px solid #047857',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.85rem',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.4)'
                                  }}
                                >
                                  <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}></span>
                                  <Video size={13} />
                                  <span>{tr('Join Virtual Hearing')}</span>
                                </button>
                              );
                            }

                            if (item.status === 'CONCLUDED' || joinInfo.join_status === 'CONCLUDED') {
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCourtroom(item)}
                                  title={joinInfo.join_message || 'Hearing Concluded'}
                                  style={{
                                    background: 'var(--theme-card-bg)',
                                    color: 'var(--theme-text-muted)',
                                    border: '1px solid var(--theme-border)',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.74rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    opacity: 0.75
                                  }}
                                >
                                  <CheckCircle2 size={12} color="#10b981" />
                                  <span>{tr('Hearing Concluded')}</span>
                                </button>
                              );
                            }

                            if (joinInfo.join_status === 'SLOT_PASSED' || joinInfo.join_status === 'EXPIRED') {
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCourtroom(item)}
                                  title={joinInfo.join_message || 'Scheduled hearing slot has passed'}
                                  style={{
                                    background: 'var(--theme-card-bg)',
                                    color: 'var(--theme-text-muted)',
                                    border: '1px solid var(--theme-border)',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.75rem',
                                    fontSize: '0.74rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    opacity: 0.8
                                  }}
                                >
                                  <Clock size={12} color="#94a3b8" />
                                  <span>{tr('Slot Ended')}</span>
                                </button>
                              );
                            }

                            return (
                              <button
                                type="button"
                                onClick={() => handleOpenCourtroom(item)}
                                title={joinInfo.join_message || 'Virtual courtroom is locked until scheduled time'}
                                style={{
                                  background: 'var(--theme-card-bg)',
                                  color: '#b45309',
                                  border: '1px solid #fde68a',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  boxShadow: '0 1px 3px rgba(217, 119, 6, 0.1)'
                                }}
                              >
                                <Lock size={12} color="#d97706" />
                                <span>{joinInfo.join_label || tr('Locked • Scheduled')}</span>
                              </button>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  {causeListItems.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--theme-text-muted)' }}>
                        <Clock size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5, display: 'block' }} />
                        <div>No hearings scheduled for the selected date & court hall.</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Select another date from the quick presets above.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: E-CHALLAN & COURT FEES (CYBER TREASURY) */}
        {activeTab === 'echallan' && (
          <div className="echallan-container">
            {/* Header Banner */}
            <div className="cause-list-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid #d97706', color: '#b45309', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <Receipt size={13} />
                    <span>{tr('Government of Madhya Pradesh • Finance Dept')}</span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--theme-text-primary)' }}>
                    {tr('Cyber Treasury MP • Judicial e-Challan Gateway')}
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: 'var(--theme-text-secondary)', margin: 0 }}>
                    {tr('Statutory court fee computation and tamper-proof SHA-256 e-Challan generation under MP Court Fees Act.')}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={fetchChallans}
                    className="ctrl-btn"
                  >
                    <RefreshCw size={14} className={loadingChallans ? 'spin' : ''} />
                    <span>{loadingChallans ? tr('Refreshing...') : tr('Refresh Ledger')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3-Column Action Grid */}
            <div className="echallan-grid-3">
              {/* 1. Instant Statutory Fee Calculator */}
              <div className="treasury-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <DollarSign size={20} color="#d97706" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--theme-text-primary)' }}>
                    {tr('Instant Statutory Fee Calculator')}
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary)', margin: '0 0 1rem 0' }}>
                  Calculates mandatory ad-valorem fee, process serving costs, and welfare stamps under MP Commercial Courts Rules.
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    {tr('Enter Suit Valuation / Claim Amount (₹)')}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={claimValInput}
                      onChange={(e) => setClaimValInput(e.target.value)}
                      placeholder="e.g. 4500000"
                      style={{
                        flex: 1,
                        background: 'var(--theme-card-bg)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        color: 'var(--theme-text-primary)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleCalculateFee(claimValInput)}
                      style={{
                        background: '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {calculatingFee ? '...' : tr('Calculate')}
                    </button>
                  </div>
                </div>

                {feeBreakdown && (
                  <div style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--theme-text-secondary)' }}>{tr('Ad-Valorem Court Fee')}:</span>
                      <strong style={{ color: 'var(--theme-text-primary)' }}>₹{feeBreakdown.ad_valorem_court_fee.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--theme-text-secondary)' }}>{tr('Process Serving Fee')}:</span>
                      <strong style={{ color: 'var(--theme-text-primary)' }}>₹{feeBreakdown.process_serving_fee.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--theme-text-secondary)' }}>{tr('Advocate Welfare Stamp')}:</span>
                      <strong style={{ color: 'var(--theme-text-primary)' }}>₹{feeBreakdown.advocate_welfare_stamp.toLocaleString()}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid var(--theme-border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: '#d97706' }}>{tr('Total Statutory Payable Fee')}:</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>
                        ₹{feeBreakdown.total_payable_fee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Generate Official e-Challan */}
              <div className="treasury-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <CreditCard size={20} color="#d97706" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--theme-text-primary)' }}>
                    {tr('Generate Official e-Challan')}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                      {tr('Payer Name')}
                    </label>
                    <input
                      type="text"
                      value={challanPayerName}
                      onChange={(e) => setChallanPayerName(e.target.value)}
                      placeholder="Advocate or Litigant Name"
                      style={{
                        width: '100%',
                        background: 'var(--theme-card-bg)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: '6px',
                        padding: '0.45rem 0.65rem',
                        color: 'var(--theme-text-primary)',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                      {tr('Head of Account')}
                    </label>
                    <select
                      value={challanHead}
                      onChange={(e) => setChallanHead(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--theme-card-bg)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: '6px',
                        padding: '0.45rem 0.65rem',
                        color: 'var(--theme-text-primary)',
                        fontSize: '0.78rem'
                      }}
                    >
                      <option value="0030-02-103-01: Commercial Court Ad-Valorem Fee">0030-02-103-01: Commercial Court Ad-Valorem Fee</option>
                      <option value="0030-02-103-02: Process / Summons Serving Fee">0030-02-103-02: Process / Summons Serving Fee</option>
                      <option value="0030-02-103-03: Urgent Listing Application Fee">0030-02-103-03: Urgent Listing Application Fee</option>
                      <option value="0030-02-103-04: Certified Copy / Docket Inspection Fee">0030-02-103-04: Certified Copy Fee</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                        Fee Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={challanAmount}
                        onChange={(e) => setChallanAmount(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--theme-card-bg)',
                          border: '1px solid var(--theme-border)',
                          borderRadius: '6px',
                          padding: '0.45rem 0.65rem',
                          color: 'var(--theme-text-primary)',
                          fontSize: '0.82rem',
                          fontWeight: 700
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--theme-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                        Case CNR (Optional)
                      </label>
                      <input
                        type="text"
                        value={challanCnr}
                        onChange={(e) => setChallanCnr(e.target.value)}
                        placeholder={activeCase ? activeCase.cnr_number : "MPIN01..."}
                        style={{
                          width: '100%',
                          background: 'var(--theme-card-bg)',
                          border: '1px solid var(--theme-border)',
                          borderRadius: '6px',
                          padding: '0.45rem 0.65rem',
                          color: 'var(--theme-text-primary)',
                          fontSize: '0.82rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateChallan}
                    style={{
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                    }}
                  >
                    <Plus size={15} />
                    <span>{tr('Generate Official e-Challan')}</span>
                  </button>
                </div>
              </div>

              {/* 3. Public e-Challan Verification */}
              <div className="treasury-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <ShieldCheck size={20} color="#d97706" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--theme-text-primary)' }}>
                    {tr('Public e-Challan Verification')}
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary)', margin: '0 0 1rem 0' }}>
                  Authenticates genuine cyber treasury seals and SHA-256 cryptographic digests for court registries.
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={verifyChallanQuery}
                      onChange={(e) => setVerifyChallanQuery(e.target.value)}
                      placeholder="e.g. MP-CH-2026-100234 or SHA-256"
                      style={{
                        flex: 1,
                        background: 'var(--theme-card-bg)',
                        border: '1px solid var(--theme-border)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        color: 'var(--theme-text-primary)',
                        fontSize: '0.82rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyChallan}
                      style={{
                        background: '#1e293b',
                        color: '#d97706',
                        border: '1px solid #d97706',
                        borderRadius: '6px',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {verifyingChallan ? '...' : tr('Verify')}
                    </button>
                  </div>
                </div>

                {verifyChallanError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.65rem', color: '#991b1b', fontSize: '0.78rem' }}>
                    {verifyChallanError}
                  </div>
                )}

                {verifiedChallanData && (
                  <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem', color: '#065f46' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#047857', marginBottom: '0.35rem' }}>
                      <CheckCircle2 size={16} />
                      <span>{tr('Authentic Treasury Receipt Verified')}</span>
                    </div>
                    <div>Challan No: <strong>{verifiedChallanData.challan_number}</strong></div>
                    <div>Amount: <strong>₹{verifiedChallanData.amount.toLocaleString()}</strong> ({verifiedChallanData.status})</div>
                    <div>Bank Ref: <strong>{verifiedChallanData.bank_ref || 'N/A'}</strong></div>
                    <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '0.35rem', wordBreak: 'break-all' }}>
                      SHA-256: {verifiedChallanData.receipt_sha256}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stamped Receipt Modal Preview if success */}
            {challanSuccessReceipt && (
              <div className="treasury-receipt-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <QrCode size={52} color="#d97706" />
                    <div>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b45309', fontWeight: 800 }}>
                        {tr('Treasury Payment Confirmed!')} • MP Cyber Treasury
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0.2rem 0' }}>
                        Challan No: {challanSuccessReceipt.challan_number}
                      </h3>
                      <div style={{ fontSize: '0.8rem' }}>
                        Amount: <strong>₹{challanSuccessReceipt.amount.toLocaleString()}</strong> • Status: <span style={{ color: '#10b981', fontWeight: 800 }}>PAID</span> • Mode: {challanSuccessReceipt.payment_mode}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="ctrl-btn"
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                    >
                      <Printer size={13} />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChallanSuccessReceipt(null)}
                      style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #fde68a', fontSize: '0.74rem' }}>
                  <div><strong>{tr('Receipt SHA-256 Digest:')}</strong></div>
                  <span className="hash-badge-mono">{challanSuccessReceipt.receipt_sha256 || 'Pending payment verification'}</span>
                </div>
              </div>
            )}

            {/* Live Judicial e-Challan Ledger Table */}
            <div className="cause-table-wrapper">
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--theme-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                  {tr('Recent Judicial e-Challans')} ({challanList.length})
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--theme-text-muted)' }}>
                  State Cyber Treasury Portal MP (e-GRAS Synchronized)
                </span>
              </div>

              <table className="cause-table">
                <thead>
                  <tr>
                    <th>Challan No</th>
                    <th>Filing Date</th>
                    <th>Payer Name</th>
                    <th>Head of Account</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Bank / Txn Ref</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challanList.map((ch) => (
                    <tr key={ch.id}>
                      <td>
                        <span className="mono" style={{ fontWeight: 800, color: '#d97706' }}>{ch.challan_number}</span>
                        {ch.cnr_number && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)' }}>CNR: {ch.cnr_number}</div>
                        )}
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>
                        {new Date(ch.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--theme-text-primary)' }}>{ch.payer_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--theme-text-muted)' }}>{ch.payer_email}</div>
                      </td>
                      <td style={{ fontSize: '0.76rem', color: 'var(--theme-text-secondary)', maxWidth: '240px' }}>
                        {ch.head_of_account}
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--theme-text-primary)' }}>
                          ₹{ch.amount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {ch.status === 'PAID' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                            <Check size={12} />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fffbeb', color: '#b45309', padding: '0.2rem 0.55rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                            <Clock size={12} />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>
                      <td>
                        {ch.transaction_ref ? (
                          <span className="mono" style={{ fontSize: '0.72rem', color: '#0284c7' }}>
                            {ch.transaction_ref}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>Awaiting Payment</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {ch.status === 'PAID' ? (
                          <button
                            type="button"
                            onClick={() => setChallanSuccessReceipt(ch)}
                            style={{
                              background: '#f1f5f9',
                              color: '#0f172a',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '0.35rem 0.7rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            View Receipt
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePayChallan(ch.id)}
                            disabled={payingChallanId === ch.id}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.35rem 0.7rem',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <CreditCard size={12} />
                            <span>{payingChallanId === ch.id ? 'Processing...' : 'Pay Online'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: JUDICIAL ANALYTICS & NJDG PERFORMANCE SUITE */}
        {activeTab === 'analytics' && (
          <div>
            {/* Hero Banner */}
            <div className="search-hero" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #070d1e 0%, #1c1917 100%)', border: '1.5px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.25)', border: '1px solid #d97706', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    <TrendingUp size={12} />
                    <span>NJDG Central Judicial Node • Real-Time KPI Telemetry</span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
                    {tr("Judicial Analytics & NJDG (न्यायिक विश्लेषण)")}
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '780px' }}>
                    National Judicial Data Grid compliance metrics for High Court of Madhya Pradesh Commercial Division under Order XV-A CPC. Measuring pre-trial disposal velocity, advocate conflict interceptions, and statutory mediation diversion.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      background: '#334155',
                      color: '#ffffff',
                      border: '1px solid #3f3f46',
                      borderRadius: '8px',
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Printer size={13} />
                    <span>Print NJDG Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top 4 KPI Cards */}
            <div className="analytics-grid-4">
              <div className="analytics-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {tr("Pre-Trial Disposal Velocity (Order XV-A)")}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981' }}>
                  28.4 <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>{tr("Days Average CMH Completion")}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '0.35rem' }}>
                  ⚡ 92.2% faster than 365-day traditional civil trial
                </div>
                <div className="velocity-bar-track">
                  <div className="velocity-bar-fill" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="analytics-card" style={{ borderLeft: '4px solid #d97706' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {tr("Admissions Consensus Ratio")}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706' }}>
                  76.4% <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>Factual Crystallization</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700, marginTop: '0.35rem' }}>
                  ✓ Oral testimony eliminated on 340+ admitted averments
                </div>
                <div className="velocity-bar-track">
                  <div className="velocity-bar-fill" style={{ width: '76%' }}></div>
                </div>
              </div>

              <div className="analytics-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {tr("Counsel Clash Shield Interceptions")}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3b82f6' }}>
                  142 <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>Collisions Prevented</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, marginTop: '0.35rem' }}>
                  🛡️ Zero double-booking across Court Halls 1 to 4
                </div>
                <div className="velocity-bar-track">
                  <div className="velocity-bar-fill" style={{ width: '100%', background: '#3b82f6' }}></div>
                </div>
              </div>

              <div className="analytics-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {tr("Cyber Treasury Realization")}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#8b5cf6' }}>
                  ₹1.42 Cr <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme-text-secondary)' }}>e-Court Fees Realized</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 700, marginTop: '0.35rem' }}>
                  🔒 100% digital fee receipts verified via SHA-256
                </div>
                <div className="velocity-bar-track">
                  <div className="velocity-bar-fill" style={{ width: '88%', background: '#8b5cf6' }}></div>
                </div>
              </div>
            </div>

            {/* Comparative Benchmark: Order XV-A vs Traditional Trial */}
            <div className="court-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--theme-text-primary)' }}>
                ⚖️ Statutory Procedural Velocity Benchmark (Commercial Courts Act vs. Traditional Civil Suit)
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--theme-text-secondary)', margin: '0 0 1.25rem 0' }}>
                Empirical case lifecycle acceleration tracked under Order XV-A CPC practice directions:
              </p>

              <div className="cause-table-wrapper">
                <table className="cause-table">
                  <thead>
                    <tr>
                      <th>Procedural Milestone</th>
                      <th>Order XV-A Commercial CMH</th>
                      <th>Traditional Civil Suit</th>
                      <th>Acceleration Multiplier</th>
                      <th>Judicial Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Pleadings Completion</td>
                      <td style={{ color: '#10b981', fontWeight: 800 }}>30 Days Strict Limit</td>
                      <td style={{ color: '#ef4444' }}>120 to 180 Days</td>
                      <td><span className="badge" style={{ background: '#ecfdf5', color: '#059669' }}>4.5x Faster</span></td>
                      <td style={{ fontSize: '0.8rem' }}>Statutory forfeiture of right to file WS after 120 days</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Admission & Denial of Documents</td>
                      <td style={{ color: '#10b981', fontWeight: 800 }}>Pre-Trial Matrix (Day 20)</td>
                      <td style={{ color: '#ef4444' }}>180+ Days (Trial Stage)</td>
                      <td><span className="badge" style={{ background: '#ecfdf5', color: '#059669' }}>9.0x Faster</span></td>
                      <td style={{ fontSize: '0.8rem' }}>Mandatory Statement of Truth eliminates false denials</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>First Case Management Hearing (CMH)</td>
                      <td style={{ color: '#10b981', fontWeight: 800 }}>Day 28 (Within 4 Weeks)</td>
                      <td style={{ color: '#ef4444' }}>No Equivalent Concept</td>
                      <td><span className="badge" style={{ background: '#ecfdf5', color: '#059669' }}>Statutory Innovation</span></td>
                      <td style={{ fontSize: '0.8rem' }}>Judge and both counsels fix entire trial calendar</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Pre-Trial Section 89 Mediation Referral</td>
                      <td style={{ color: '#10b981', fontWeight: 800 }}>Instant Consensus Trigger</td>
                      <td style={{ color: '#ef4444' }}>Post-Evidence (Years Later)</td>
                      <td><span className="badge" style={{ background: '#ecfdf5', color: '#059669' }}>Immediate</span></td>
                      <td style={{ fontSize: '0.8rem' }}>38 matters diverted to Lok Adalat with 100% court fee refund</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 700 }}>Total Pre-Trial Horizon</td>
                      <td style={{ color: '#10b981', fontWeight: 800 }}>28.4 Days Average</td>
                      <td style={{ color: '#ef4444' }}>365 to 730 Days</td>
                      <td><span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800 }}>12.8x Faster</span></td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>Massive reduction in institutional case pendency</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Court Hall Workload & Dispute Distribution Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
              <div className="court-card">
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem 0', color: 'var(--theme-text-primary)' }}>
                  🏛️ Court Hall Active Load & Disposal Efficiency
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="hall-load-item">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Court Hall 04 (Indore Commercial Division)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>Hon'ble Justice Rajesh Sharma • 34 Active Dockets</div>
                    </div>
                    <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800 }}>96% On-Track</span>
                  </div>

                  <div className="hall-load-item">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Court Hall 01 (Principal Seat, Jabalpur)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>Hon'ble Justice Alok Verma • 32 Active Dockets</div>
                    </div>
                    <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800 }}>94% On-Track</span>
                  </div>

                  <div className="hall-load-item">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Court Hall 02 (Gwalior Bench)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>Hon'ble Justice Meenakshi Mehta • 28 Active Dockets</div>
                    </div>
                    <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800 }}>91% On-Track</span>
                  </div>

                  <div className="hall-load-item">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Court Hall 03 (District Commercial Court, Indore)</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-muted)' }}>Hon'ble Judge Satyendra K. Jain • 34 Active Dockets</div>
                    </div>
                    <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontWeight: 800 }}>88% On-Track</span>
                  </div>
                </div>
              </div>

              <div className="court-card">
                <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem 0', color: 'var(--theme-text-primary)' }}>
                  📊 Commercial Case Classification Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <span>Commercial Dispute / Supply Contracts</span>
                      <span style={{ color: '#d97706' }}>44% (56 Cases)</span>
                    </div>
                    <div className="velocity-bar-track">
                      <div className="velocity-bar-fill" style={{ width: '44%', background: '#d97706' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <span>Arbitration Petitions (Sec 9 & 34)</span>
                      <span style={{ color: '#3b82f6' }}>22% (28 Cases)</span>
                    </div>
                    <div className="velocity-bar-track">
                      <div className="velocity-bar-fill" style={{ width: '22%', background: '#3b82f6' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <span>Cheque Bounce (Sec 138 NI Act)</span>
                      <span style={{ color: '#10b981' }}>18% (23 Cases)</span>
                    </div>
                    <div className="velocity-bar-track">
                      <div className="velocity-bar-fill" style={{ width: '18%', background: '#10b981' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <span>Civil Recovery Suits</span>
                      <span style={{ color: '#8b5cf6' }}>16% (21 Cases)</span>
                    </div>
                    <div className="velocity-bar-track">
                      <div className="velocity-bar-fill" style={{ width: '16%', background: '#8b5cf6' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATUTORY E-SUMMONS MODAL (ORDER V RULES 1 & 9 CPC) */}
        {summonsModalOpen && summonsCase && (
          <div className="summons-overlay" onClick={() => setSummonsModalOpen(false)}>
            <div className="summons-card" onClick={(e) => e.stopPropagation()}>
              <div className="courtroom-header" style={{ background: '#070d1e', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileCheck size={20} color="#d97706" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    Statutory Judicial e-Summons (Order V Rules 1 & 9 CPC)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="ctrl-btn"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    <Printer size={13} />
                    <span>Print Summons</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSummonsModalOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="summons-body printable-summons">
                <div style={{ textAlign: 'center', borderBottom: '2px double #000000', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <MpHcEmblem size={65} />
                  </div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', letterSpacing: '0.05em', fontWeight: 900 }}>
                    IN THE HIGH COURT OF MADHYA PRADESH
                  </h2>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: 700 }}>
                    COMMERCIAL DIVISION • BENCH AT INDORE
                  </h3>
                  <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Under Commercial Courts Act, 2015 & Order XV-A, Code of Civil Procedure, 1908
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'uppercase' }}>
                    SUMMONS FOR SETTLEMENT OF ISSUES & PRE-TRIAL CASE MANAGEMENT HEARING (ORDER V CPC)
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <strong>CNR NUMBER:</strong> <span className="mono" style={{ fontWeight: 800 }}>{summonsCase.cnr_number}</span><br />
                    <strong>MATTER:</strong> {summonsCase.case_title}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>COURT HALL:</strong> {summonsCase.court_hall_id || 'HALL_04'}<br />
                    <strong>VALUATION:</strong> ₹{Number(summonsCase.claim_valuation || 4500000).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <strong>TO:</strong><br />
                  The Defendant(s) & Authorized Legal Counsel on Record,<br />
                  In the matter of: <em>{summonsCase.case_title}</em>
                </div>

                <p style={{ textIndent: '2rem', textAlign: 'justify', fontSize: '0.925rem', marginBottom: '0.85rem' }}>
                  WHEREAS the Plaintiff above-named has instituted a commercial suit against you in this Court under the provisions of the Commercial Courts Act, 2015 and Order XV-A of the Code of Civil Procedure, 1908;
                </p>

                <p style={{ textIndent: '2rem', textAlign: 'justify', fontSize: '0.925rem', marginBottom: '0.85rem' }}>
                  YOU ARE HEREBY SUMMONED to appear before this Court in person or by an Advocate duly instructed, in Court Hall 04, High Court of Madhya Pradesh Bench at Indore, on the <strong>{summonsCase.next_hearing_formatted || '03 Nov 2026 at 10:30 AM'}</strong> for the mandatory Pre-Trial Case Management Hearing (CMH).
                </p>

                <p style={{ textIndent: '2rem', textAlign: 'justify', fontSize: '0.925rem', marginBottom: '0.85rem' }}>
                  <strong>TAKE NOTICE</strong> that under Order XV-A Rule 2 CPC, you are strictly required to file your <em>Statement of Admissions and Denials of Documents</em> verified by an Affidavit of Truth prior to the aforesaid hearing. Take note that every document or factual averment not specifically denied shall be <strong>DEEMED TO BE ADMITTED</strong> on record.
                </p>

                <p style={{ textIndent: '2rem', textAlign: 'justify', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                  GIVEN under my hand and the seal of this Court, this 27th day of October, 2026.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <QrCode size={64} />
                    <div style={{ fontSize: '0.65rem', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                      e-Summons Digital Seal<br />
                      SHA256: 8a7f...e319
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#059669', fontWeight: 800, marginBottom: '0.2rem' }}>
                      [Digitally Signed via Class 3 Judicial DSC]
                    </div>
                    <strong style={{ fontSize: '0.95rem' }}>Registrar (Judicial)</strong><br />
                    High Court of Madhya Pradesh<br />
                    Bench at Indore
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 6. MP High Court Official Institutional Footer */}
      <footer className="mphc-footer">
        <div className="mphc-footer-grid">
          <div className="footer-col">
            <h4>
              <Landmark size={18} color="#d97706" />
              <span>{tr('High Court of Madhya Pradesh')}</span>
            </h4>
            <p style={{ marginBottom: '0.75rem' }}>
              {tr('Established under the States Reorganisation Act, 1956. The High Court exercises original, appellate, and commercial jurisdiction across Madhya Pradesh.')}
            </p>
            <ul>
              <li><strong>{tr('Principal Seat:')}</strong> Jabalpur - 482001</li>
              <li><strong>{tr('Bench at Indore:')}</strong> Mahatma Gandhi Road, Indore - 452001</li>
              <li><strong>{tr('Bench at Gwalior:')}</strong> City Centre, Gwalior - 474011</li>
              <li><strong>{tr('Statutory Regime:')}</strong> {tr('Commercial Courts Act, 2015 & Order XV-A CPC Practice Directions: Pre-Trial Case Management Hearing (CMH) is statutory for all commercial claims > ₹3,00,000. All statements of admission/denial must be uploaded prior to first hearing.').split(':')[0] || 'Commercial Courts Act, 2015 & Order XV-A CPC'}</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>
              <FileCheck size={18} color="#d97706" />
              <span>{tr('Judicial Services & Quick Portals')}</span>
            </h4>
            <ul>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('search')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#f59e0b', cursor: 'pointer', textAlign: 'left', font: 'inherit', textDecoration: 'underline' }}
                >
                  {tr('Universal CNR Case Search & Live Dossier')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('matrix')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#f59e0b', cursor: 'pointer', textAlign: 'left', font: 'inherit', textDecoration: 'underline' }}
                >
                  {tr('Admissions & Denials Matrix (Rule 3 Compliance)')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('cases')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#f59e0b', cursor: 'pointer', textAlign: 'left', font: 'inherit', textDecoration: 'underline' }}
                >
                  {tr('Commercial Suit Docket Register & e-Filing')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('scheduler')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#f59e0b', cursor: 'pointer', textAlign: 'left', font: 'inherit', textDecoration: 'underline' }}
                >
                  {tr('Smart Clash-Free Judicial Hearing Allotment')}
                </button>
              </li>
              <li>
                <a href="https://mphc.gov.in" target="_blank" rel="noopener noreferrer">
                  {tr('Official Portal of MP High Court (mphc.gov.in)')}
                </a>
              </li>
              <li>
                <a href="https://services.ecourts.gov.in" target="_blank" rel="noopener noreferrer">
                  {tr('National e-Courts Services Portal')}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>
              <Building size={18} color="#d97706" />
              <span>{tr('Registry & Technical Helpdesk')}</span>
            </h4>
            <p style={{ marginBottom: '0.75rem' }}>
              {tr('Specialized Case Management Hearing Portal configured for Commercial Court Hall 04, High Court of MP, Bench at Indore.')}
            </p>
            <ul>
              <li><strong>{tr('Bench Registry:')}</strong> {lang === 'HI' ? 'रजिस्ट्रार (न्यायिक-II), उच्च न्यायालय इन्दौर' : 'Registrar (Judicial-II), High Court Indore'}</li>
              <li><strong>{tr('Academic Project:')}</strong> Shri Vaishnav Vidyapeeth Vishwavidyalaya (SVVV)</li>
              <li><strong>{tr('Project Identifier:')}</strong> {tr('SVVV Major Project (MP-14)')}</li>
              <li><strong>{tr('Architecture:')}</strong> FastAPI 0.110 Async Core & React 19 Engine</li>
            </ul>
          </div>
        </div>

        <div className="mphc-bottom-bar">
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              {tr('© 2026 High Court of Madhya Pradesh • Commercial Court Division • Built under Order XV-A CPC Guidelines')}
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.72rem' }}>
              <span>{tr('Theme: Classic MP High Court Navy & Saffron Gold')}</span>
              <span>•</span>
              <span>{tr('Content Managed by Commercial Division Registry')}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. WEBRTC VIRTUAL COURTROOM MODAL */}
      {activeCourtroomSession && (
        <div className="courtroom-overlay">
          <div className="courtroom-modal">
            {/* Courtroom Top Header */}
            <div className="courtroom-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <MpHcEmblem size={34} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#d97706', fontSize: '0.9rem' }}>
                      Commercial Courtroom Hall 04 • High Court of MP
                    </span>
                    <span className="courtroom-rec-pill">
                      <span className="rec-dot"></span>
                      <span>ORDER XV-A LIVE RECORDING</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                    {activeCourtroomSession.case?.case_title || 'Commercial Hearing'} • CNR: <strong className="mono" style={{ color: '#ffffff' }}>{activeCourtroomSession.case?.cnr_number}</strong> • Room: <strong className="mono" style={{ color: '#f59e0b' }}>{activeCourtroomSession.webrtc_room_id}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setCourtroomViewMode(courtroomViewMode === 'grid' ? 'exhibits' : 'grid')}
                  className="ctrl-btn"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  <Monitor size={14} />
                  <span>{courtroomViewMode === 'grid' ? 'Show Exhibit Evidence' : 'Show Quad Video Grid'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCourtroomSession(null)}
                  className="ctrl-btn active-danger"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  <X size={14} />
                  <span>{tr('Leave Courtroom')}</span>
                </button>
              </div>
            </div>

            {/* 4-Tile Video Grid Body */}
            <div className="courtroom-body">
              {/* Tile 1: Hon'ble Presiding Judge */}
              <div className="courtroom-tile judge-bench">
                <div className="tile-avatar-halo" style={{ borderColor: '#d97706', background: 'rgba(217, 119, 6, 0.15)' }}>
                  ⚖️
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                    {activeCourtroomSession.judge_name || "Hon'ble Justice Rajesh Sharma"}
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
                    {activeCourtroomSession.plaintiff_counsel?.name || 'Adv. Himanshu Bawaniya'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                    Legal Counsel for Plaintiff ({activeCourtroomSession.plaintiff_counsel?.bar_council_id || 'MP/14297/2026'})
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
                    {activeCourtroomSession.defendant_counsel?.name || 'Adv. Priya Verma'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>
                    Legal Counsel for Defendant ({activeCourtroomSession.defendant_counsel?.bar_council_id || 'MP/11054/2026'})
                  </div>
                </div>
                <div className="tile-info-bar">
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Written Statement Filed</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Connected</span>
                </div>
              </div>

              {/* Tile 4: Court Evidence Screen / Admissions Matrix */}
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

            {/* Bottom Courtroom Action Controls Bar */}
            <div className="courtroom-controls">
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`ctrl-btn ${isMicMuted ? 'active-danger' : ''}`}
                >
                  {isMicMuted ? <MicOff size={15} /> : <Mic size={15} />}
                  <span>{isMicMuted ? tr('Unmute Audio') : tr('Mute Audio')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`ctrl-btn ${isVideoOff ? 'active-danger' : ''}`}
                >
                  {isVideoOff ? <VideoOff size={15} /> : <Video size={15} />}
                  <span>{isVideoOff ? tr('Start Video') : tr('Stop Video')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSharingScreen(!isSharingScreen)}
                  className={`ctrl-btn ${isSharingScreen ? 'active-danger' : ''}`}
                >
                  <Monitor size={15} />
                  <span>{isSharingScreen ? 'Stop Sharing' : tr('Share Exhibits')}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {currentRole === 'JUDGE' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateSessionStatus(activeCourtroomSession.session_id, 'IN_PROGRESS')}
                      className="ctrl-btn"
                      style={{ background: '#059669', borderColor: '#047857', color: '#ffffff' }}
                    >
                      <span>Mark In Session</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateSessionStatus(activeCourtroomSession.session_id, 'CONCLUDED');
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
                  onClick={() => setActiveCourtroomSession(null)}
                  className="ctrl-btn"
                >
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
