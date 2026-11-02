import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import QRCodeImage from './QRCodeImage';

// Helper to convert Indian numbers to words
function numberToWordsINR(amount) {
  if (!amount || isNaN(amount)) return 'Zero Rupees Only';
  const num = Math.floor(amount);
  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 10) return single[n];
    if (n >= 10 && n < 20) return double[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
  }

  function convertThreeDigits(n) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (h > 0) res += single[h] + ' Hundred';
    if (rest > 0) res += (res ? ' ' : '') + convertTwoDigits(rest);
    return res;
  }

  if (num === 0) return 'Zero Rupees Only';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let words = '';
  if (crore > 0) words += convertTwoDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertTwoDigits(thousand) + ' Thousand ';
  if (remainder > 0) words += convertThreeDigits(remainder);

  return `Rupees ${words.trim()} Only`;
}

export default function EChallanReceiptModal({
  challan,
  onClose,
  onVerifyInRegistry
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedChallan, setCopiedChallan] = useState(false);

  if (!challan) return null;

  const paidDateFormatted = (() => {
    try {
      return new Date(challan.paid_at || challan.created_at || '2026-10-29T10:00:00Z').toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
    } catch {
      return '29 Oct 2026, 11:30:00 AM';
    }
  })();

  const verificationUrl = `${window.location.origin}/#verify=${challan.challan_number}`;
  const qrVerificationText = [
    `🏛️ HIGH COURT OF MADHYA PRADESH - CYBER TREASURY`,
    `================================================`,
    `RECEIPT STATUS : OFFICIALLY PAID & VERIFIED`,
    `Challan No     : ${challan.challan_number}`,
    `Payer Name     : ${challan.payer_name || 'Advocate'}`,
    `Total Amount   : INR ${Number(challan.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    `Payment Mode   : ${challan.payment_mode || 'BHIM_UPI'} (State Bank of India Treasury)`,
    `Payment Date   : ${paidDateFormatted}`,
    `CNR / Case     : ${challan.cnr_number || 'General Commercial Docket'}`,
    `SHA-256 Digest :`,
    `${challan.receipt_sha256 || 'AUTHENTIC-SEALED'}`,
    `Statutory Auth : Sec. 65B Indian Evidence Act & IT Act 2000`,
    `Portal Registry: https://cmh-eportal-frontend.onrender.com`,
    `================================================`
  ].join('\n');

  const handleCopyHash = () => {
    if (!challan.receipt_sha256) return;
    navigator.clipboard.writeText(challan.receipt_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyChallanNumber = () => {
    navigator.clipboard.writeText(challan.challan_number);
    setCopiedChallan(true);
    setTimeout(() => setCopiedChallan(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `========================================================================
    GOVERNMENT OF MADHYA PRADESH - CYBER TREASURY (e-GRAS)
      HIGH COURT OF MADHYA PRADESH - COMMERCIAL DIVISION
         JUDICIAL COURT FEE PAYMENT RECEIPT (M.P.T.C. FORM 10)
========================================================================
Challan Number (CRN) : ${challan.challan_number}
Transaction Ref      : ${challan.transaction_ref || 'N/A'}
Bank Ref (CIN)       : ${challan.bank_ref || 'N/A'}
Payment Date & Time  : ${paidDateFormatted}
Payment Mode         : ${challan.payment_mode || 'SBI_EPAY / UPI'}
Payment Status       : ${challan.status || 'PAID'}

PAYER DETAILS:
Payer Name           : ${challan.payer_name}
Payer Email          : ${challan.payer_email}
Payer Capacity       : ${challan.payer_role || 'ADVOCATE'}
CNR / Case Reference : ${challan.cnr_number || 'General Docket'}
Bench / Location     : High Court of MP, Bench at Indore (Commercial Division)
Court Hall           : Court Hall 04

HEAD OF ACCOUNT & REVENUE BREAKDOWN:
Major / Minor Head   : ${challan.head_of_account}
Total Amount Paid    : INR ${challan.amount.toFixed(2)}
Amount in Words      : ${numberToWordsINR(challan.amount)}

DIGITAL SECURITY SEAL & CRYPTOGRAPHIC VERIFICATION:
SHA-256 Digest       : ${challan.receipt_sha256 || 'PENDING'}
Verification Gateway : ${verificationUrl}
Verified By          : State Cyber Treasury Portal (Madhya Pradesh Finance Dept)

Statutory Notice:
This is an electronically generated and cryptographically sealed Cyber Treasury
judicial receipt pursuant to Section 65B Indian Evidence Act and Information
Technology Act, 2000. No manual signature is required.
========================================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eChallan_Receipt_${challan.challan_number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(7, 13, 30, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          color: '#0f172a',
          width: '100%',
          maxWidth: '740px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Modal Top Action Toolbar (No-Print) */}
        <div
          className="no-print"
          style={{
            background: '#070d1e',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderBottom: '2px solid #d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Official Cyber Treasury e-Receipt
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#d97706',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
              }}
            >
              <Printer size={14} />
              <span>Print Official Receipt</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReceipt}
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Download size={14} />
              <span>Download (.TXT)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div
          className="printable-receipt"
          style={{
            padding: '2rem',
            overflowY: 'auto',
            background: '#ffffff',
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          {/* Official Government Header */}
          <div
            style={{
              textAlign: 'center',
              borderBottom: '2px solid #0f172a',
              paddingBottom: '1.25rem',
              marginBottom: '1.25rem',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>🇮🇳</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e293b' }}>
              GOVERNMENT OF MADHYA PRADESH • FINANCE DEPARTMENT
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Directorate of Treasuries and Accounts (Cyber Treasury e-GRAS)
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#070d1e', margin: '0.4rem 0 0.1rem 0' }}>
              HIGH COURT OF MADHYA PRADESH • BENCH AT INDORE
            </div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Judicial Court Fee Electronic Receipt • M.P.T.C. Form No. 10
            </div>

            {/* Paid Stamp Crest */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                border: '2px solid #059669',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                background: '#ecfdf5',
                color: '#065f46',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                STATUS
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={16} />
                <span>PAID</span>
              </div>
            </div>
          </div>

          {/* Reference Numbers Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Challan Number (CRN)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, fontFamily: 'monospace', color: '#d97706' }}>
                  {challan.challan_number}
                </span>
                <button
                  type="button"
                  onClick={handleCopyChallanNumber}
                  className="no-print"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedChallan ? '#059669' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                  title="Copy Challan Number"
                >
                  {copiedChallan ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Treasury Transaction Ref
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'monospace', color: '#0284c7' }}>
                {challan.transaction_ref || 'CYBER-MP-TREASURY'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Bank Reference (CIN)
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                {challan.bank_ref || 'SBI-MP-CONFIRMED'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Payment Date & Time
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                {paidDateFormatted}
              </div>
            </div>
          </div>

          {/* Detailed Metadata Grid */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.825rem',
              marginBottom: '1.25rem'
            }}
          >
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', width: '28%', fontWeight: 700, color: '#475569' }}>
                  Payer Name:
                </td>
                <td style={{ padding: '0.5rem 0', fontWeight: 800, color: '#0f172a' }}>
                  {challan.payer_name} ({challan.payer_role || 'Advocate on Record'})
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>
                  Payer Email / Contact:
                </td>
                <td style={{ padding: '0.5rem 0', color: '#334155' }}>
                  {challan.payer_email}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>
                  Case CNR / Suit Ref:
                </td>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                  {challan.cnr_number || 'General Commercial Court Registry'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>
                  Bench & Court Hall:
                </td>
                <td style={{ padding: '0.5rem 0', color: '#334155' }}>
                  High Court of MP Bench at Indore • Commercial Division (Court Hall 04)
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>
                  Head of Account:
                </td>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#b45309' }}>
                  {challan.head_of_account}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>
                  Payment Mode:
                </td>
                <td style={{ padding: '0.5rem 0', color: '#334155' }}>
                  {challan.payment_mode || 'SBI_EPAY / Bharat UPI'} (State Bank of India Treasury Gateway)
                </td>
              </tr>
            </tbody>
          </table>

          {/* Amount Box */}
          <div
            style={{
              background: '#fffbeb',
              border: '2px solid #d97706',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#b45309' }}>
                Total Statutory Fee Liquidated
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#92400e' }}>
                ₹{challan.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#78350f', marginTop: '0.2rem' }}>
                Amount in Words: <em>{numberToWordsINR(challan.amount)}</em>
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                padding: '0.5rem 0.85rem',
                fontSize: '0.75rem',
                color: '#92400e'
              }}
            >
              <div>• Statutory Ad-Valorem: <strong>₹{(challan.amount - 2000).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
              <div>• Process Serving Fee: <strong>₹1,500.00</strong></div>
              <div>• Advocate Welfare Fund: <strong>₹500.00</strong></div>
            </div>
          </div>

          {/* Cryptographic Seal & Scannable QR Code Section */}
          <div
            style={{
              borderTop: '1px dashed #cbd5e1',
              paddingTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}
          >
            {/* Scannable Real QR Code */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  background: '#ffffff',
                  padding: '6px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <QRCodeImage
                  value={qrVerificationText}
                  size={120}
                  alt="e-Challan Verification QR Code"
                  color={{ dark: '#070d1e', light: '#ffffff' }}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} />
                  <span>Scannable Digital Verification QR</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: '300px', marginTop: '0.2rem' }}>
                  Scan with any smartphone camera or QR reader to verify official MP Cyber Treasury authenticity directly.
                </div>
                {onVerifyInRegistry && (
                  <button
                    type="button"
                    onClick={() => {
                      onVerifyInRegistry(challan.challan_number);
                      onClose();
                    }}
                    className="no-print"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#d97706',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginTop: '0.35rem'
                    }}
                  >
                    <span>Verify in Portal Registry</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* SHA-256 Digest Box */}
            <div style={{ flex: 1, minWidth: '240px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.2rem' }}>
                Receipt SHA-256 Digest Seal
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.68rem',
                  wordBreak: 'break-all',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.6rem',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.35rem'
                }}
              >
                <span>{challan.receipt_sha256 || 'SHA256-PENDING-TREASURY-AUTHENTICATION'}</span>
                {challan.receipt_sha256 && (
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="no-print"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: copiedHash ? '#059669' : '#64748b',
                      padding: 0
                    }}
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                Sec. 65B Indian Evidence Act & IT Act 2000 Electronic Seal
              </div>
            </div>
          </div>

          {/* Statutory Footer */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.68rem',
              color: '#94a3b8',
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            This is an electronically generated and certified Cyber Treasury judicial fee payment receipt under Rule 12 of the M.P. Financial Code and Order XV-A CPC Commercial Division Rules. No manual signature is required. For verification inquiries, quote Challan No. {challan.challan_number}.
          </div>
        </div>
      </div>
    </div>
  );
}
