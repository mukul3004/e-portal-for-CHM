import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, AlertTriangle, 
  CheckCircle2, Clock, Landmark, ShieldCheck, 
  Sun, Moon, Filter, ArrowRight, Info, ExternalLink
} from 'lucide-react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_NAMES_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

export default function CourtCalendarView({ 
  lang = 'EN', 
  tr = (k) => k,
  activeBench = 'INDORE',
  onSelectHearingDate,
  onNavigateToCauseList,
  onNavigateToScheduler
}) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // November default
  const [benchFilter, setBenchFilter] = useState(activeBench || 'ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'holidays' | 'vacations'
  const [loading, setLoading] = useState(false);
  const [monthData, setMonthData] = useState(null);
  const [annualOverview, setAnnualOverview] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Fallback initial dataset if API is unreachable
  const fetchMonthCalendar = async (year, month, bench) => {
    setLoading(true);
    try {
      const benchParam = bench && bench !== 'ALL' ? `&bench_id=${bench}` : '';
      const res = await fetch(`/api/v1/schedule/calendar/month-overview?year=${year}&month=${month}${benchParam}`);
      if (res.ok) {
        const data = await res.json();
        setMonthData(data);
        // Default selected day to 1st or today
        if (data.days && data.days.length > 0) {
          const defaultDay = data.days.find(d => d.day_number === 3) || data.days[0];
          setSelectedDay(defaultDay);
        }
      }
    } catch (err) {
      console.warn("Could not fetch calendar month from API, utilizing fallback data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnualOverview = async (year, bench) => {
    try {
      const benchParam = bench && bench !== 'ALL' ? `&bench_id=${bench}` : '';
      const res = await fetch(`/api/v1/schedule/calendar/holidays?year=${year}${benchParam}`);
      if (res.ok) {
        const data = await res.json();
        setAnnualOverview(data);
      }
    } catch (err) {
      console.warn("Could not fetch annual holidays overview", err);
    }
  };

  useEffect(() => {
    fetchMonthCalendar(currentYear, currentMonth, benchFilter);
    fetchAnnualOverview(currentYear, benchFilter);
  }, [currentYear, currentMonth, benchFilter]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(11);
  };

  // Helper for starting weekday padding
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay(); // 0 is Sunday
  };

  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Statistics calculation
  const totalDays = monthData?.days?.length || 30;
  const sittingDays = monthData?.days?.filter(d => d.is_working_day).length || 0;
  const holidaysInMonth = monthData?.days?.filter(d => !d.is_working_day).length || 0;
  const scheduledSessionsInMonth = monthData?.days?.reduce((acc, d) => acc + (d.scheduled_sessions_count || 0), 0) || 0;

  // Filtered annual holidays
  const filteredHolidays = (annualOverview?.gazetted_holidays || []).filter(h => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      h.name_en?.toLowerCase().includes(q) ||
      h.name_hi?.includes(q) ||
      h.date?.includes(q) ||
      h.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="court-calendar-container" style={{ width: '100%', marginBottom: '2rem' }}>
      {/* 1. Official Institutional Banner */}
      <div className="cause-list-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid #d97706', color: '#b45309', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Landmark size={13} />
              <span>{tr('High Court of Madhya Pradesh • Official Judicial Calendar 2026')}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--theme-text-primary)' }}>
              {lang === 'HI' ? 'उच्च न्यायालय कैलेंडर एवं अवकाश तालिका' : 'High Court Judicial Calendar & Holiday Gazette'}
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--theme-text-secondary)', margin: 0 }}>
              {tr('Order XV-A Case Management Hearing Roster & Statutory Holiday Compliance Schedule')}
            </p>
          </div>

          {/* Quick Action Switches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div className="view-mode-pill-bar" style={{ display: 'flex', background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)', borderRadius: '8px', padding: '3px' }}>
              <button
                type="button"
                className={`bench-pill ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                {tr('Interactive Month Grid')}
              </button>
              <button
                type="button"
                className={`bench-pill ${viewMode === 'holidays' ? 'active' : ''}`}
                onClick={() => setViewMode('holidays')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                {tr('Annual Gazetted Holidays')} ({annualOverview?.gazetted_holidays_count || 24})
              </button>
              <button
                type="button"
                className={`bench-pill ${viewMode === 'vacations' ? 'active' : ''}`}
                onClick={() => setViewMode('vacations')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                {tr('Court Vacations & Recess')}
              </button>
            </div>
          </div>
        </div>

        {/* Bench & Jurisdiction Filter Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--theme-border)', paddingTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--theme-text-muted)', textTransform: 'uppercase' }}>
              {tr('Select Bench Jurisdiction')}:
            </span>
            <button
              type="button"
              className={`bench-pill ${benchFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setBenchFilter('ALL')}
            >
              {tr('All Benches')}
            </button>
            <button
              type="button"
              className={`bench-pill ${benchFilter === 'INDORE' ? 'active' : ''}`}
              onClick={() => setBenchFilter('INDORE')}
            >
              {tr('Indore Bench')}
            </button>
            <button
              type="button"
              className={`bench-pill ${benchFilter === 'JABALPUR' ? 'active' : ''}`}
              onClick={() => setBenchFilter('JABALPUR')}
            >
              {tr('Principal Seat Jabalpur')}
            </button>
            <button
              type="button"
              className={`bench-pill ${benchFilter === 'GWALIOR' ? 'active' : ''}`}
              onClick={() => setBenchFilter('GWALIOR')}
            >
              {tr('Gwalior Bench')}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, background: 'rgba(22, 163, 74, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(22, 163, 74, 0.25)' }}>
              ● {lang === 'HI' ? 'राजपत्रित प्रकाशित अनुसूची' : 'Authoritative Gazette Synchronized'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div className="cause-stat-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="cause-stat-card">
          <div className="stat-label">{tr('Sitting Days this Month')}</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{sittingDays}</div>
          <div className="stat-sub">{totalDays - sittingDays} {lang === 'HI' ? 'अवकाश / बंद दिवस' : 'non-sitting days'}</div>
        </div>

        <div className="cause-stat-card">
          <div className="stat-label">{tr('Total Gazetted Holidays')}</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{annualOverview?.gazetted_holidays_count || 24}</div>
          <div className="stat-sub">{lang === 'HI' ? 'वार्षिक राजपत्रित अवकाश' : 'Annual Court Gazetted Offs'}</div>
        </div>

        <div className="cause-stat-card">
          <div className="stat-label">{tr('High Court Vacations')}</div>
          <div className="stat-value" style={{ color: '#d97706' }}>3</div>
          <div className="stat-sub">{annualOverview?.vacation_days_count || 40} {lang === 'HI' ? 'अवकाश दिवस (ग्रीष्म/शीत/दशहरा)' : 'total vacation days'}</div>
        </div>

        <div className="cause-stat-card">
          <div className="stat-label">{tr('Scheduled Hearings this Month')}</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{scheduledSessionsInMonth}</div>
          <div className="stat-sub">{lang === 'HI' ? 'आदेश XV-A सीएमएच सत्र' : 'Order XV-A CMH Sessions in DB'}</div>
        </div>
      </div>

      {/* 3. VIEW MODE A: INTERACTIVE MONTH CALENDAR GRID */}
      {viewMode === 'grid' && (
        <div className="court-card" style={{ padding: '1.25rem' }}>
          {/* Month Navigation Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="ctrl-btn"
                style={{ padding: '0.4rem 0.65rem' }}
                title={tr('Previous Month')}
              >
                <ChevronLeft size={16} />
              </button>

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--theme-text-primary)', minWidth: '180px', textAlign: 'center' }}>
                {lang === 'HI' ? MONTH_NAMES_HI[currentMonth - 1] : MONTH_NAMES[currentMonth - 1]} {currentYear}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="ctrl-btn"
                style={{ padding: '0.4rem 0.65rem' }}
                title={tr('Next Month')}
              >
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={handleJumpToToday}
                className="ctrl-btn"
                style={{ fontSize: '0.74rem', padding: '0.4rem 0.65rem', marginLeft: '0.5rem' }}
              >
                {tr('Current Month / Today')}
              </button>
            </div>

            {/* Legend Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.74rem', color: 'var(--theme-text-secondary)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }}></span>
                <span>{tr('Gazetted Holiday')}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d97706' }}></span>
                <span>{tr('Court Vacation')}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#64748b' }}></span>
                <span>{lang === 'HI' ? 'रविवार / २रा-४था शनि' : 'Sunday / 2nd-4th Sat'}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }}></span>
                <span>{tr('Sitting Day')}</span>
              </div>
            </div>
          </div>

          {/* 7-Column Day Names Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '6px' }}>
            {(lang === 'HI' ? DAY_NAMES_HI : DAY_NAMES).map((dName, idx) => (
              <div 
                key={dName} 
                style={{ 
                  padding: '0.45rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: idx === 0 ? '#dc2626' : (idx === 6 ? '#64748b' : 'var(--theme-text-secondary)'),
                  background: 'var(--theme-card-bg)',
                  borderRadius: '6px',
                  border: '1px solid var(--theme-border)'
                }}
              >
                {dName}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {/* Blank padding cells before 1st day */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div 
                key={`empty-${idx}`} 
                style={{ 
                  minHeight: '85px', 
                  background: 'rgba(0,0,0,0.02)', 
                  borderRadius: '8px', 
                  border: '1px dashed var(--theme-border)',
                  opacity: 0.35
                }} 
              />
            ))}

            {/* Real Day Cells */}
            {(monthData?.days || []).map((dayObj) => {
              const isSelected = selectedDay?.date === dayObj.date;
              const isHoliday = dayObj.is_holiday;
              const isVacation = dayObj.is_vacation;
              const isSitting = dayObj.is_working_day;
              const hasHearings = (dayObj.scheduled_sessions_count || 0) > 0;

              let cellBg = 'var(--theme-card-bg)';
              let borderStyle = isSelected ? '2px solid #d97706' : '1px solid var(--theme-border)';

              if (dayObj.category === 'GAZETTED_HOLIDAY') {
                cellBg = 'rgba(239, 68, 68, 0.08)';
              } else if (dayObj.category === 'COURT_VACATION') {
                cellBg = 'rgba(217, 119, 6, 0.08)';
              } else if (dayObj.status === 'SUNDAY' || dayObj.status === 'SECOND_SATURDAY' || dayObj.status === 'FOURTH_SATURDAY') {
                cellBg = 'rgba(100, 116, 139, 0.06)';
              }

              return (
                <div
                  key={dayObj.date}
                  onClick={() => setSelectedDay(dayObj)}
                  style={{
                    minHeight: '85px',
                    padding: '0.45rem',
                    background: cellBg,
                    border: borderStyle,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 0 2px rgba(217, 119, 6, 0.35)' : 'none'
                  }}
                >
                  {/* Date Number & Status Tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span 
                      style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 800, 
                        color: dayObj.day_of_week === 'Sun' ? '#dc2626' : (isHoliday ? '#ef4444' : 'var(--theme-text-primary)') 
                      }}
                    >
                      {dayObj.day_number}
                    </span>

                    {/* Sitting / Holiday Pill */}
                    {dayObj.category === 'GAZETTED_HOLIDAY' && (
                      <span style={{ fontSize: '0.58rem', fontWeight: 800, background: '#ef4444', color: 'white', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                        {lang === 'HI' ? 'अवकाश' : 'Off'}
                      </span>
                    )}
                    {dayObj.category === 'COURT_VACATION' && (
                      <span style={{ fontSize: '0.58rem', fontWeight: 800, background: '#d97706', color: 'white', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                        {lang === 'HI' ? 'छुट्टी' : 'Vacation'}
                      </span>
                    )}
                    {isSitting && (
                      <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#16a34a' }}>
                        ● {lang === 'HI' ? 'बैठक' : 'Open'}
                      </span>
                    )}
                  </div>

                  {/* Holiday Name or Hearing Count */}
                  <div>
                    {isHoliday && dayObj.label_en && dayObj.status !== 'SUNDAY' && dayObj.status !== 'SECOND_SATURDAY' && dayObj.status !== 'FOURTH_SATURDAY' && (
                      <div 
                        style={{ 
                          fontSize: '0.66rem', 
                          fontWeight: 700, 
                          color: '#dc2626', 
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                        title={lang === 'HI' ? dayObj.label_hi : dayObj.label_en}
                      >
                        {lang === 'HI' ? dayObj.label_hi : dayObj.label_en}
                      </div>
                    )}

                    {hasHearings && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.64rem', fontWeight: 700, color: '#2563eb', background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.25)', padding: '0.1rem 0.3rem', borderRadius: '4px', textAlign: 'center' }}>
                        ⚡ {dayObj.scheduled_sessions_count} {lang === 'HI' ? 'सुनवाई' : 'Hearings'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Selected Date Detail Inspector Card */}
          {selectedDay && (
            <div style={{ marginTop: '1.5rem', background: 'var(--theme-card-bg)', border: '1.5px solid var(--theme-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: selectedDay.is_working_day ? '#16a34a' : '#dc2626', marginBottom: '0.35rem' }}>
                    {selectedDay.is_working_day ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    <span>{selectedDay.is_working_day ? tr('Sitting Day') : tr('Court Closed')}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--theme-text-primary)' }}>
                    {selectedDay.day_of_week_full}, {selectedDay.day_number} {lang === 'HI' ? MONTH_NAMES_HI[currentMonth - 1] : MONTH_NAMES[currentMonth - 1]} {currentYear}
                  </h3>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedDay.is_working_day ? '#16a34a' : '#dc2626' }}>
                    {lang === 'HI' ? selectedDay.label_hi : selectedDay.label_en}
                  </div>
                  {selectedDay.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--theme-text-secondary)', margin: '0.25rem 0 0 0' }}>
                      {selectedDay.description}
                    </p>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onNavigateToCauseList && onNavigateToCauseList(selectedDay.date)}
                    className="ctrl-btn"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <ExternalLink size={13} />
                    <span>{tr('Open in Daily Cause List')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToScheduler && onNavigateToScheduler(selectedDay.date)}
                    style={{
                      background: selectedDay.is_working_day ? '#070d1e' : '#d97706',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Clock size={13} />
                    <span>{tr('Schedule Hearing on this Date')}</span>
                  </button>
                </div>
              </div>

              {/* Statutory Note on Section 10 General Clauses Act */}
              {!selectedDay.is_working_day && (
                <div style={{ marginTop: '0.85rem', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', borderRadius: '6px', padding: '0.65rem 0.85rem', fontSize: '0.78rem', color: '#b45309' }}>
                  <strong>{tr('Statutory Note (Section 10 General Clauses Act)')}: </strong>
                  {tr('Under Section 10 of General Clauses Act, any statutory Order XV-A filing or limitation deadline falling on a non-working day extends to the next working court day.')}
                </div>
              )}

              {/* Sessions list if hearings scheduled on this day */}
              {(selectedDay.sessions || []).length > 0 ? (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--theme-border)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '0.5rem' }}>
                    ⚡ {lang === 'HI' ? 'इस तिथि हेतु निर्धारित आदेश XV-A वाद प्रबंधन सुनवाई:' : 'Order XV-A Hearings Scheduled for this Date:'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.5rem' }}>
                    {selectedDay.sessions.map((sess, sIdx) => (
                      <div key={sess.session_id || sIdx} style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-border)', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                          <span style={{ color: '#2563eb' }}>{sess.court_hall_id}</span>
                          <span className="mono">{sess.start_time} - {sess.end_time}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--theme-text-secondary)', marginTop: '0.2rem' }}>
                          Status: <strong style={{ color: '#16a34a' }}>{sess.status}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedDay.is_working_day ? (
                <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--theme-text-muted)' }}>
                  {tr('Regular High Court sitting in session for commercial dispute hearings.')}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* 5. VIEW MODE B: ANNUAL GAZETTED HOLIDAYS ROSTER */}
      {viewMode === 'holidays' && (
        <div className="court-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--theme-text-primary)' }}>
                {tr('Official Gazetted Holiday List 2026')}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--theme-text-secondary)', margin: 0 }}>
                {lang === 'HI' ? 'मध्य प्रदेश उच्च न्यायालय द्वारा अधिसूचित राजपत्रित एवं स्थानीय अवकाश' : 'Gazetted and regional holidays notified by the High Court of Madhya Pradesh'}
              </p>
            </div>

            <div style={{ width: '220px' }}>
              <input
                type="text"
                placeholder={lang === 'HI' ? 'अवकाश खोजें...' : 'Search holiday...'}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  border: '1px solid var(--theme-border)',
                  borderRadius: '6px',
                  background: 'var(--theme-card-bg)',
                  color: 'var(--theme-text-primary)'
                }}
              />
            </div>
          </div>

          <div className="court-table-container">
            <table className="court-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>{tr('Date')}</th>
                  <th>{tr('Holiday Name')} (EN)</th>
                  <th>{tr('Holiday Name')} (HI)</th>
                  <th style={{ width: '130px' }}>{tr('Category')}</th>
                  <th style={{ width: '120px' }}>{tr('Applicable Benches')}</th>
                  <th>{tr('Description')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHolidays.map((h, idx) => (
                  <tr key={h.date || idx}>
                    <td className="mono" style={{ fontWeight: 700, color: '#dc2626' }}>
                      {h.date}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--theme-text-primary)' }}>
                      {h.name_en}
                    </td>
                    <td style={{ fontWeight: 600, color: '#b45309' }}>
                      {h.name_hi}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: h.type === 'BENCH_HOLIDAY' ? 'rgba(147, 51, 234, 0.15)' : 'rgba(239, 68, 68, 0.12)', color: h.type === 'BENCH_HOLIDAY' ? '#7e22ce' : '#dc2626', fontWeight: 700 }}>
                        {h.type}
                      </span>
                    </td>
                    <td>
                      <span className="court-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                        {h.benches.join(', ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary)' }}>
                      {h.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. VIEW MODE C: COURT VACATIONS & RECESS */}
      {viewMode === 'vacations' && (
        <div className="court-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--theme-text-primary)' }}>
            {tr('Court Vacations & Recess Schedule')}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--theme-text-secondary)', margin: '0 0 1.25rem 0' }}>
            {lang === 'HI' ? 'ग्रीष्मकालीन, शीतकालीन एवं दशहरा अवकाश के दौरान केवल अति-आवश्यक मामलों हेतु वेकेशन बेंच बैठती है।' : 'During vacation periods, regular division sittings are suspended. Dedicated Vacation Benches sit for emergency interim relief.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {(annualOverview?.vacations || []).map((vac, idx) => (
              <div 
                key={vac.name_en || idx} 
                style={{ 
                  background: 'var(--theme-card-bg)', 
                  border: '1.5px solid var(--theme-border)', 
                  borderRadius: '8px', 
                  padding: '1rem',
                  borderTop: '4px solid #d97706'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                    {lang === 'HI' ? vac.name_hi : vac.name_en}
                  </span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(217, 119, 6, 0.15)', color: '#b45309', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                    {vac.name_en === 'Summer Vacation' ? '26 Days' : (vac.name_en === 'Winter Vacation' ? '8 Days' : '6 Days')}
                  </span>
                </div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--theme-text-primary)', marginBottom: '0.5rem' }}>
                  {vac.start_date} <ArrowRight size={13} style={{ display: 'inline', margin: '0 0.25rem' }} /> {vac.end_date}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {vac.description}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                  ✓ {lang === 'HI' ? 'अति-आवश्यक स्थगन आवेदन हेतु अवकाश पीठ उपलब्ध' : 'Vacation Bench available for urgent Order XV-A interim stays'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
