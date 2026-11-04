import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * High-fidelity, scannable 2D QR Code image component.
 * Uses lib `qrcode` to generate standard ISO/IEC 18004 compliant QR codes.
 * Supports Canvas rendering with automatic SVG fallback.
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

    const qr = QRCode?.toDataURL ? QRCode : (QRCode?.default || QRCode);
    const darkColor = color?.dark || '#000000';
    const lightColor = color?.light || '#ffffff';

    const opts = {
      width: Math.max(size * 2, 200),
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'M'
    };

    if (qr && typeof qr.toDataURL === 'function') {
      qr.toDataURL(payload, opts)
        .then((url) => {
          if (isMounted) {
            setDataUrl(url);
            setError(false);
          }
        })
        .catch((err) => {
          console.warn('Canvas QR generation failed, attempting SVG fallback:', err);
          if (qr && typeof qr.toString === 'function') {
            qr.toString(payload, { ...opts, type: 'svg' }, (svgErr, svgString) => {
              if (isMounted) {
                if (!svgErr && svgString) {
                  setDataUrl('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
                  setError(false);
                } else {
                  setError(true);
                }
              }
            });
          } else {
            if (isMounted) setError(true);
          }
        });
    } else if (qr && typeof qr.toString === 'function') {
      qr.toString(payload, { ...opts, type: 'svg' }, (svgErr, svgString) => {
        if (isMounted) {
          if (!svgErr && svgString) {
            setDataUrl('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString));
            setError(false);
          } else {
            setError(true);
          }
        }
      });
    } else {
      if (isMounted) setError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [payload, size, color?.dark, color?.light]);

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

  const isUrl = typeof payload === 'string' && (payload.startsWith('http://') || payload.startsWith('https://'));

  const imgElement = (
    <img
      src={dataUrl}
      alt={alt}
      title={isUrl ? `Scan with camera or click to open: ${payload}` : "Scannable QR Code"}
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        background: color?.light || '#ffffff',
        cursor: isUrl ? 'pointer' : 'default',
        ...style
      }}
    />
  );

  if (isUrl) {
    return (
      <a 
        href={payload} 
        style={{ display: 'inline-block', textDecoration: 'none' }} 
        title={`Scan with smartphone camera or click to open: ${payload}`}
      >
        {imgElement}
      </a>
    );
  }

  return imgElement;
}
