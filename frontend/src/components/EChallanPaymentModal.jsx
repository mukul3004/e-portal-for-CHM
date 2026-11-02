import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import QRCodeImage from './QRCodeImage';

export default function EChallanPaymentModal({
  challan,
  onClose,
  onPaymentSuccess,
  apiBase = '/api'
}) {
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' | 'netbanking' | 'card'
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [processing, setProcessing] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  if (!challan) return null;

  const upiVpa = 'mpcybertreasury@sbi';
  const upiPayPayload = `upi://pay?pa=${upiVpa}&pn=MP%20Judicial%20Cyber%20Treasury&am=${challan.amount}&tr=${challan.challan_number}&cu=INR&tn=Court%20Fee%20${challan.challan_number}`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const executePayment = async (mode, bankName = 'State Bank of India') => {
    setProcessing(true);
    setPaymentError(null);
    try {
      const res = await fetch(`${apiBase}/echallan/${challan.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_mode: mode,
          bank_name: bankName
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Payment gateway failed to confirm transaction.');
      }

      const paidChallan = await res.json();
      onPaymentSuccess(paidChallan);
    } catch (err) {
      console.error('Payment failure:', err);
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(7, 13, 30, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem'
      }}
    >
      <div
        style={{
          background: 'var(--theme-card-bg, #ffffff)',
          color: 'var(--theme-text-primary, #0f172a)',
          width: '100%',
          maxWidth: '580px',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(217,119,6,0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #070d1e 0%, #0f172a 60%, #1e3a8a 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            borderBottom: '2px solid #d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#f59e0b',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '0.2rem'
              }}
            >
              <ShieldCheck size={14} />
              <span>Cyber Treasury MP • e-GRAS Gateway</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
              Judicial Court Fee Payment
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: processing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto' }}>
          {/* Challan Summary Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '1.5px solid #fde68a',
              borderRadius: '10px',
              padding: '1rem',
              color: '#78350f',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#b45309' }}>
                Challan Number (CRN)
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', color: '#92400e' }}>
                {challan.challan_number}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#92400e', marginTop: '0.2rem' }}>
                Payer: <strong>{challan.payer_name}</strong>
                {challan.cnr_number ? ` • CNR: ${challan.cnr_number}` : ''}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#b45309' }}>
                Total Fee Payable
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#b45309' }}>
                ₹{challan.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--theme-border, #e2e8f0)',
              marginBottom: '1.25rem'
            }}
          >
            <button
              type="button"
              onClick={() => setPaymentTab('upi')}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                border: 'none',
                background: paymentTab === 'upi' ? '#d97706' : 'transparent',
                color: paymentTab === 'upi' ? '#ffffff' : 'var(--theme-text-secondary, #475569)',
                fontWeight: 700,
                fontSize: '0.825rem',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s'
              }}
            >
              <QrCode size={16} />
              <span>BHIM UPI / QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentTab('netbanking')}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                border: 'none',
                background: paymentTab === 'netbanking' ? '#d97706' : 'transparent',
                color: paymentTab === 'netbanking' ? '#ffffff' : 'var(--theme-text-secondary, #475569)',
                fontWeight: 700,
                fontSize: '0.825rem',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s'
              }}
            >
              <Building size={16} />
              <span>SBI e-Pay / Net Banking</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentTab('card')}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                border: 'none',
                background: paymentTab === 'card' ? '#d97706' : 'transparent',
                color: paymentTab === 'card' ? '#ffffff' : 'var(--theme-text-secondary, #475569)',
                fontWeight: 700,
                fontSize: '0.825rem',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s'
              }}
            >
              <CreditCard size={16} />
              <span>Cards / RTGS</span>
            </button>
          </div>

          {/* TAB 1: BHIM UPI / QR CODE */}
          {paymentTab === 'upi' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #d97706',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)',
                  marginBottom: '1rem'
                }}
              >
                {/* Working QR Code */}
                <QRCodeImage
                  value={upiPayPayload}
                  size={190}
                  alt="UPI Payment QR Code"
                  color={{ dark: '#070d1e', light: '#ffffff' }}
                />
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#059669',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>Bharat QR • Scannable via PhonePe, GPay, Paytm</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--theme-text-secondary, #64748b)' }}>
                  Cyber Treasury VPA:
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    background: 'var(--theme-card-bg, #f1f5f9)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-border, #cbd5e1)'
                  }}
                >
                  {upiVpa}
                </span>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--theme-border, #cbd5e1)',
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    color: copiedVpa ? '#059669' : 'inherit'
                  }}
                >
                  {copiedVpa ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--theme-text-muted, #64748b)', margin: '0 0 1.25rem 0' }}>
                Scan this QR code with any UPI application to authorize ₹{challan.amount.toLocaleString()} or click below to simulate instant online bank confirmation.
              </p>

              <button
                type="button"
                onClick={() => executePayment('BHIM_UPI', 'State Bank of India (UPI Gateway)')}
                disabled={processing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
              >
                <CheckCircle2 size={18} />
                <span>
                  {processing
                    ? 'Reconciling with Cyber Treasury...'
                    : `Confirm & Complete Payment (₹${challan.amount.toLocaleString()})`}
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: SBI E-PAY / NET BANKING */}
          {paymentTab === 'netbanking' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--theme-text-muted, #64748b)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase'
                }}
              >
                Select Authorized Treasury Settlement Bank:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {[
                  'State Bank of India',
                  'Punjab National Bank',
                  'Bank of India',
                  'HDFC Bank Commercial',
                  'ICICI Bank Treasury',
                  'Bank of Baroda'
                ].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      border: selectedBank === b ? '2px solid #d97706' : '1px solid var(--theme-border, #cbd5e1)',
                      background: selectedBank === b ? 'rgba(217,119,6,0.1)' : 'var(--theme-card-bg, #ffffff)',
                      color: selectedBank === b ? '#b45309' : 'var(--theme-text-primary, #0f172a)',
                      fontWeight: selectedBank === b ? 800 : 600,
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Building size={14} />
                    <span>{b}</span>
                  </button>
                ))}
              </div>

              <div
                style={{
                  background: 'var(--theme-card-bg, #f8fafc)',
                  border: '1px solid var(--theme-border, #e2e8f0)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.78rem',
                  color: 'var(--theme-text-secondary, #475569)',
                  marginBottom: '1.25rem'
                }}
              >
                Settlement through: <strong>{selectedBank}</strong> • Account Head: <strong>{challan.head_of_account}</strong>
              </div>

              <button
                type="button"
                onClick={() => executePayment('SBI_EPAY', selectedBank)}
                disabled={processing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(30, 58, 138, 0.35)'
                }}
              >
                <Lock size={16} />
                <span>
                  {processing
                    ? 'Connecting to Bank Gateway...'
                    : `Authorize via ${selectedBank} (₹${challan.amount.toLocaleString()})`}
                </span>
              </button>
            </div>
          )}

          {/* TAB 3: CARDS / RTGS */}
          {paymentTab === 'card' && (
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  color: '#ffffff',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 800 }}>
                    Judicial Fee Debit / Corporate Card
                  </span>
                  <Lock size={14} color="#94a3b8" />
                </div>
                <div style={{ fontSize: '1.1rem', letterSpacing: '0.15em', fontFamily: 'monospace', marginBottom: '1.25rem' }}>
                  •••• •••• •••• 8912
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem' }}>CARD HOLDER</span>
                    <strong>{challan.payer_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem' }}>EXPIRES</span>
                    <strong>12 / 29</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => executePayment('DEBIT_CARD', 'State Bank of India')}
                disabled={processing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                }}
              >
                <CreditCard size={18} />
                <span>
                  {processing
                    ? 'Authorizing Transaction...'
                    : `Pay ₹${challan.amount.toLocaleString()} with Card`}
                </span>
              </button>
            </div>
          )}

          {/* Error Notice */}
          {paymentError && (
            <div
              style={{
                marginTop: '1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#991b1b',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{paymentError}</span>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div
          style={{
            background: 'var(--theme-card-bg, #f8fafc)',
            borderTop: '1px solid var(--theme-border, #e2e8f0)',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--theme-text-muted, #64748b)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={12} color="#059669" />
            <span>256-Bit SSL Encrypted • State Cyber Treasury Portal MP</span>
          </div>
          <span style={{ fontFamily: 'monospace' }}>Rule 12 M.P. Financial Code</span>
        </div>
      </div>
    </div>
  );
}

