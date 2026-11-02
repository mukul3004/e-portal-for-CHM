import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Keyboard, Check } from 'lucide-react';
import { parseTimeTo12Hour, formatTo24Hour, formatToDisplay12Hour } from '../utils/timePickerUtils';

export { parseTimeTo12Hour, formatTo24Hour, formatToDisplay12Hour };

/**
 * Interactive Material Clock Dialog Component
 * Matching Android / Material UI Time Picker with interactive clock dial,
 * smooth animations, CANCEL and OK confirmation buttons.
 */
export function MaterialTimePickerDialog({
  initialValue = '11:00:00',
  isOpen,
  onClose,
  onConfirm,
  title = 'SELECT TIME'
}) {
  const [selectedHour, setSelectedHour] = useState(11);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [period, setPeriod] = useState('AM');
  const [mode, setMode] = useState('hour'); // 'hour' | 'minute'
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dialRef = useRef(null);
  const isDraggingRef = useRef(false);
  const autoAdvanceTimer = useRef(null);

  // Sync state whenever dialog opens with new initialValue
  useEffect(() => {
    if (isOpen) {
      const p = parseTimeTo12Hour(initialValue);
      setSelectedHour(p.hour);
      setSelectedMinute(p.minute);
      setPeriod(p.period);
      setMode('hour');
      setIsKeyboardMode(false);
      setIsDragging(false);
      isDraggingRef.current = false;
    }
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, [isOpen, initialValue]);

  const handleOk = useCallback(() => {
    const formatted = formatTo24Hour(selectedHour, selectedMinute, period);
    onConfirm(formatted);
    onClose();
  }, [selectedHour, selectedMinute, period, onConfirm, onClose]);

  // Handle keyboard shortcuts (Escape -> close, Enter -> confirm)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        handleOk();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleOk]);

  // Dial geometry constants
  const dialSize = 256;
  const cx = dialSize / 2;
  const cy = dialSize / 2;
  const radius = 90;

  // Calculate current hand angle in degrees (0 deg is top / 12 o'clock)
  const currentAngle = mode === 'hour'
    ? ((selectedHour % 12) * 30)
    : (selectedMinute * 6);

  // Hand tip coordinates
  const rad = (currentAngle * Math.PI) / 180;
  const handTipX = cx + radius * Math.sin(rad);
  const handTipY = cy - radius * Math.cos(rad);

  // Calculate angle and update hour/minute from client coordinates
  const updateFromCoords = useCallback((clientX, clientY, isFinal = false) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + cx);
    const y = clientY - (rect.top + cy);

    let angleRad = Math.atan2(x, -y);
    if (angleRad < 0) angleRad += 2 * Math.PI;
    const angleDeg = (angleRad * 180) / Math.PI;

    if (mode === 'hour') {
      let h = Math.round(angleDeg / 30);
      if (h === 0) h = 12;
      setSelectedHour(h);

      if (isFinal) {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = setTimeout(() => {
          setMode('minute');
        }, 220);
      }
    } else {
      let m = Math.round(angleDeg / 6) % 60;
      setSelectedMinute(m);
    }
  }, [mode, cx, cy]);

  // Window-level dragging listeners to ensure butter-smooth tracking even if cursor moves fast
  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      updateFromCoords(clientX, clientY, false);
    };

    const handleGlobalUp = (e) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        updateFromCoords(clientX, clientY, true);
      }
    };

    window.addEventListener('mousemove', handleGlobalMove, { passive: true });
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalMove, { passive: true });
    window.addEventListener('touchend', handleGlobalUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [updateFromCoords]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    updateFromCoords(clientX, clientY, false);
  };

  if (!isOpen) return null;

  // Hour numbers 1 to 12
  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  // Minute numbers (multiples of 5)
  const minuteNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const isExactMinuteMark = selectedMinute % 5 === 0;

  return (
    <div
      className="material-timepicker-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="material-timepicker-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '320px',
          background: 'var(--theme-card, #ffffff)',
          color: 'var(--theme-text-primary, #1e293b)',
          borderRadius: '20px',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.32), 0 10px 20px -5px rgba(0,0,0,0.18)',
          border: '1px solid var(--theme-border, #e2e8f0)',
          padding: '1.25rem 1.25rem 0.85rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        {/* Title */}
        <div style={{ width: '100%', marginBottom: '0.85rem' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--theme-text-muted, #64748b)',
            textTransform: 'uppercase'
          }}>
            {title}
          </span>
        </div>

        {/* Digital Time & AM/PM Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          marginBottom: '1.2rem'
        }}>
          {/* Hour Box */}
          <button
            type="button"
            className={mode === 'hour' ? 'time-box-active' : 'time-box-inactive'}
            onClick={() => {
              setMode('hour');
              if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
            }}
            style={{
              width: '74px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              fontSize: '2.5rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: mode === 'hour' ? '2px solid #7c3aed' : '1px solid transparent',
              background: mode === 'hour' ? '#ede9fe' : '#f1f5f9',
              color: mode === 'hour' ? '#6d28d9' : '#334155',
              transition: 'all 0.18s ease'
            }}
            title="Click to select hour"
          >
            {String(selectedHour).padStart(2, '0')}
          </button>

          {/* Colon Separator */}
          <span style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: 'var(--theme-text-muted, #94a3b8)',
            lineHeight: 1
          }}>
            :
          </span>

          {/* Minute Box */}
          <button
            type="button"
            className={mode === 'minute' ? 'time-box-active' : 'time-box-inactive'}
            onClick={() => {
              setMode('minute');
              if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
            }}
            style={{
              width: '74px',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              fontSize: '2.5rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: mode === 'minute' ? '2px solid #7c3aed' : '1px solid transparent',
              background: mode === 'minute' ? '#ede9fe' : '#f1f5f9',
              color: mode === 'minute' ? '#6d28d9' : '#334155',
              transition: 'all 0.18s ease'
            }}
            title="Click to select minutes"
          >
            {String(selectedMinute).padStart(2, '0')}
          </button>

          {/* AM / PM Selector Stack */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--theme-border, #cbd5e1)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginLeft: '0.35rem'
          }}>
            <button
              type="button"
              onClick={() => setPeriod('AM')}
              style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                borderBottom: '1px solid var(--theme-border, #cbd5e1)',
                cursor: 'pointer',
                background: period === 'AM' ? '#ede9fe' : 'transparent',
                color: period === 'AM' ? '#6d28d9' : 'var(--theme-text-muted, #64748b)',
                transition: 'all 0.15s ease'
              }}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setPeriod('PM')}
              style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: period === 'PM' ? '#ede9fe' : 'transparent',
                color: period === 'PM' ? '#6d28d9' : 'var(--theme-text-muted, #64748b)',
                transition: 'all 0.15s ease'
              }}
            >
              PM
            </button>
          </div>
        </div>

        {/* Dynamic Dial Mode or Direct Input Mode */}
        {!isKeyboardMode ? (
          <div
            ref={dialRef}
            className="clock-dial-disc"
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            style={{
              width: `${dialSize}px`,
              height: `${dialSize}px`,
              borderRadius: '50%',
              background: '#f1f5f9',
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'pointer',
              touchAction: 'none',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            {/* SVG Hand & Pointer */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              {/* Hand connecting center to tip */}
              <line
                x1={cx}
                y1={cy}
                x2={handTipX}
                y2={handTipY}
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transition: isDragging ? 'none' : 'all 0.18s cubic-bezier(0.2, 0, 0, 1)'
                }}
              />
              {/* Center Pivot Dot */}
              <circle cx={cx} cy={cy} r="4" fill="#7c3aed" />

              {/* Selector Circle Knob at the end of the hand */}
              <circle
                cx={handTipX}
                cy={handTipY}
                r={mode === 'minute' && !isExactMinuteMark ? 14 : 18}
                fill="#7c3aed"
                style={{
                  transition: isDragging ? 'none' : 'all 0.18s cubic-bezier(0.2, 0, 0, 1)'
                }}
              />

              {/* Small center dot inside knob if minute is not multiple of 5 */}
              {mode === 'minute' && !isExactMinuteMark && (
                <circle
                  cx={handTipX}
                  cy={handTipY}
                  r="3.5"
                  fill="#ffffff"
                  style={{
                    transition: isDragging ? 'none' : 'all 0.18s cubic-bezier(0.2, 0, 0, 1)'
                  }}
                />
              )}
            </svg>

            {/* Radial Numbers on Clock Face */}
            {mode === 'hour' ? (
              hourNumbers.map((h) => {
                const angle = ((h % 12) * 30 * Math.PI) / 180;
                const nx = cx + radius * Math.sin(angle);
                const ny = cy - radius * Math.cos(angle);
                const isSelected = selectedHour === h;

                return (
                  <div
                    key={`hour-${h}`}
                    className={isSelected ? 'clock-num-active' : 'clock-num-inactive'}
                    style={{
                      position: 'absolute',
                      left: `${nx}px`,
                      top: `${ny}px`,
                      transform: 'translate(-50%, -50%)',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.92rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#ffffff' : '#334155',
                      pointerEvents: 'none',
                      zIndex: isSelected ? 3 : 1,
                      transition: 'color 0.12s ease'
                    }}
                  >
                    {h}
                  </div>
                );
              })
            ) : (
              minuteNumbers.map((m) => {
                const angle = (m * 6 * Math.PI) / 180;
                const nx = cx + radius * Math.sin(angle);
                const ny = cy - radius * Math.cos(angle);
                const isSelected = selectedMinute === m;

                return (
                  <div
                    key={`min-${m}`}
                    className={isSelected ? 'clock-num-active' : 'clock-num-inactive'}
                    style={{
                      position: 'absolute',
                      left: `${nx}px`,
                      top: `${ny}px`,
                      transform: 'translate(-50%, -50%)',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#ffffff' : '#334155',
                      pointerEvents: 'none',
                      zIndex: isSelected ? 3 : 1,
                      transition: 'color 0.12s ease'
                    }}
                  >
                    {String(m).padStart(2, '0')}
                  </div>
                );
              })
            )}

            {/* Floating indicator when non-multiple-of-5 minute is selected */}
            {mode === 'minute' && !isExactMinuteMark && (
              <div
                style={{
                  position: 'absolute',
                  left: `${handTipX}px`,
                  top: `${handTipY - 26}px`,
                  transform: 'translate(-50%, -50%)',
                  background: '#6d28d9',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  pointerEvents: 'none',
                  zIndex: 10,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                {String(selectedMinute).padStart(2, '0')}
              </div>
            )}
          </div>
        ) : (
          /* Manual Keyboard Input View */
          <div
            style={{
              width: `${dialSize}px`,
              height: `${dialSize}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1px dashed var(--theme-border, #cbd5e1)',
              padding: '1.5rem',
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--theme-text-muted, #64748b)', marginBottom: '1rem' }}>
              Direct Numeric Entry
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Hour (1-12)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={selectedHour}
                  onChange={(e) => {
                    let v = parseInt(e.target.value, 10);
                    if (isNaN(v)) v = 1;
                    if (v < 1) v = 1;
                    if (v > 12) v = 12;
                    setSelectedHour(v);
                  }}
                  style={{
                    width: '64px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid var(--theme-border, #cbd5e1)',
                    background: 'var(--theme-card, #ffffff)',
                    color: 'var(--theme-text-primary, #0f172a)'
                  }}
                />
              </div>

              <span style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem', color: '#64748b' }}>:</span>

              <div style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Minute (0-59)
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={selectedMinute}
                  onChange={(e) => {
                    let v = parseInt(e.target.value, 10);
                    if (isNaN(v)) v = 0;
                    if (v < 0) v = 0;
                    if (v > 59) v = 59;
                    setSelectedMinute(v);
                  }}
                  style={{
                    width: '64px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid var(--theme-border, #cbd5e1)',
                    background: 'var(--theme-card, #ffffff)',
                    color: 'var(--theme-text-primary, #0f172a)'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions Row: Keyboard toggle on left, CANCEL & OK on right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '1.1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--theme-border, #f1f5f9)'
        }}>
          {/* Toggle Keyboard / Dial Mode */}
          <button
            type="button"
            onClick={() => setIsKeyboardMode(!isKeyboardMode)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--theme-text-muted, #64748b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title={isKeyboardMode ? 'Switch to interactive clock face' : 'Switch to direct number entry'}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#7c3aed'; e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-text-muted, #64748b)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {isKeyboardMode ? <Clock size={20} /> : <Keyboard size={20} />}
          </button>

          {/* Action Buttons: CANCEL & OK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6d28d9',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handleOk}
              style={{
                background: '#7c3aed',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.35)',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#6d28d9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#7c3aed'; }}
            >
              <Check size={16} strokeWidth={2.5} />
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Comfortable, modern Time Picker Input Field with clickable modal trigger
 */
export default function MaterialTimePickerInput({
  value,
  onChange,
  id,
  name,
  disabled = false,
  style = {},
  dialogTitle = 'SELECT TIME'
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const displayTime = formatToDisplay12Hour(value);

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <button
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        onClick={() => !disabled && setIsDialogOpen(true)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.62rem 0.85rem',
          border: '1px solid var(--theme-border, #cbd5e1)',
          borderRadius: '6px',
          background: 'var(--theme-card, #ffffff)',
          color: 'var(--theme-text-primary, #1e293b)',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          textAlign: 'left',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = '#7c3aed';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.12)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = 'var(--theme-border, #cbd5e1)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
          }
        }}
      >
        <span style={{ letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>
          {displayTime}
        </span>
        <Clock size={16} style={{ color: '#7c3aed', flexShrink: 0 }} />
      </button>

      <MaterialTimePickerDialog
        isOpen={isDialogOpen}
        initialValue={value}
        title={dialogTitle}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={(newVal) => {
          if (onChange) onChange(newVal);
        }}
      />
    </div>
  );
}
