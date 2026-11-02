import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * High-fidelity, scannable 2D QR Code image component.
 * Uses lib `qrcode` to generate standard ISO/IEC 18004 compliant QR codes.
 */
export default function QRCodeImage({
  value,
  text,
  size = 160,
  className = '',
  style = {},
  color = { dark: '#000000', light: '#ffffff' },
  alt = 'QR Code'
}) {
  const payload = value || text || '';
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!payload) return;

    QRCode.toDataURL(payload, {
      width: size * 2, // Higher density for crisp rendering on retina screens
      margin: 1,
      color: {
        dark: color.dark || '#000000',
        light: color.light || '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [payload, size, color.dark, color.light]);

  if (error || !payload) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '0.7rem',
          color: '#64748b',
          textAlign: 'center',
          padding: '4px',
          ...style
        }}
      >
        QR Unavailable
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '6px',
          fontSize: '0.68rem',
          color: '#94a3b8',
          ...style
        }}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      title="Scannable QR Code"
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        background: color.light || '#ffffff',
        ...style
      }}
    />
  );
}
