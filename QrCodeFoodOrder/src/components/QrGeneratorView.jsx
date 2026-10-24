import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, ExternalLink, Sparkles, Printer } from 'lucide-react';

export default function QrGeneratorView({ onSelectTableAndSimulate }) {
  const [selectedTable, setSelectedTable] = useState('04');
  const [restaurantName, setRestaurantName] = useState('EazyOrder Gourmet Bistro');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const qrRef = useRef(null);

  const targetUrl = `${window.location.origin}/menu?table=${selectedTable}`;

  const handleDownloadQR = () => {
    const canvas = qrRef.current ? qrRef.current.querySelector('canvas') : null;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `EazyOrder_Table_${selectedTable}.png`;
    a.click();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <QrCode size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem' }}>Table QR Code Generator & Printing Station</h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Generate customized, printable QR code cards for table tops. Guests scan to view digital menu and place orders instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Controls Column */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Card Settings</h3>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Select Table Number:
            </label>
            <select
              value={selectedTable}
              onChange={e => setSelectedTable(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                fontWeight: 700
              }}
            >
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '12', '15', 'VIP-1', 'PATIO-3'].map(t => (
                <option key={t} value={t}>Table #{t}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Restaurant Brand Heading:
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={e => setRestaurantName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              QR Code Payload URL:
            </label>
            <div style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              color: 'var(--primary)',
              wordBreak: 'break-all'
            }}>
              {targetUrl}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleDownloadQR}
              style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
            >
              <Download size={18} />
              <span>Download Printable PNG</span>
            </button>

            <button
              type="button"
              className="btn-customize"
              onClick={() => onSelectTableAndSimulate(selectedTable)}
              style={{
                width: '100%',
                height: '48px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                fontWeight: 700
              }}
            >
              <ExternalLink size={18} />
              <span>Simulate Scan Table #{selectedTable}</span>
            </button>
          </div>
        </div>

        {/* Printable Card Preview Column */}
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', textAlign: 'center' }}>
            Printable Table Display Preview
          </h3>

          <div ref={qrRef} className="qr-preview-card">
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#d97706',
              marginBottom: '4px'
            }}>
              Dine-In Contactless Ordering
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
              {restaurantName}
            </h2>

            <div style={{
              background: '#000000',
              padding: '16px',
              borderRadius: '16px',
              marginBottom: '16px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}>
              <QRCodeCanvas
                value={targetUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>

            <div style={{
              background: '#f1f5f9',
              color: '#0f172a',
              padding: '6px 20px',
              borderRadius: '9999px',
              fontSize: '1.1rem',
              fontWeight: 800,
              marginBottom: '12px',
              border: '2px solid #cbd5e1'
            }}>
              TABLE #{selectedTable}
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '240px', lineHeight: 1.4 }}>
              Point camera at QR code to view menu, customize dishes, and order directly to your table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
