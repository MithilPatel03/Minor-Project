import React, { useState } from 'react';
import { X, Bell, GlassWater, UtensilsCrossed, Receipt, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WaiterModal({ isOpen, onClose, activeTable, onSendRequest }) {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] = useState('Request Water');
  const [note, setNote] = useState('');
  const [isSent, setIsSent] = useState(false);

  const OPTIONS = [
    { id: 'Request Water', label: 'Bring Water Pitcher', icon: GlassWater },
    { id: 'Extra Cutlery', label: 'Extra Cutlery / Napkins', icon: UtensilsCrossed },
    { id: 'Request Bill', label: 'Bring Printed Bill', icon: Receipt },
    { id: 'Clean Table', label: 'Clear / Clean Table', icon: Sparkles },
    { id: 'Assistance', label: 'Talk to Server', icon: Bell }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendRequest({
      tableNumber: activeTable,
      requestType: selectedType,
      note,
      timestamp: new Date().toISOString()
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Call Waitstaff</h3>
            <span className="table-badge">Table #{activeTable}</span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {isSent ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle2 size={48} color="var(--accent)" style={{ marginBottom: '12px' }} />
              <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Server Notified!</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                A staff member is on their way to Table #{activeTable}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Select assistance needed:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = selectedType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedType(opt.id)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isSelected ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>SELECTED</span>}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Optional note for server..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-add-cart"
                style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
              >
                Send Request to Waitstaff
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
