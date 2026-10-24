import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Utensils, Bell, Sparkles, ChefHat, ShieldCheck } from 'lucide-react';

export default function OrderTracker({ activeOrder, onRequestWaiter }) {
  if (!activeOrder) return null;

  // Real-time status pipeline stages
  const STAGES = [
    { key: 'SENT', label: 'Order Sent', icon: Utensils },
    { key: 'ACCEPTED', label: 'Kitchen Accepted', icon: ChefHat },
    { key: 'PREPARING', label: 'Cooking', icon: Sparkles },
    { key: 'READY', label: 'Ready to Serve', icon: Bell },
    { key: 'SERVED', label: 'Served', icon: CheckCircle2 }
  ];

  const getStageIndex = (status) => {
    const idx = STAGES.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = getStageIndex(activeOrder.status);

  // Timer simulation
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startTime = new Date(activeOrder.timestamp).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder.timestamp]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-glow)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-glow)'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Active Order #{activeOrder.id}
            </span>
            <span className="table-badge">Table #{activeOrder.tableNumber}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Payment: {activeOrder.paymentStatus} via {activeOrder.paymentMethod}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--primary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={16} />
            <span>Prep Time: {formatTimer(elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            className="btn-customize"
            onClick={onRequestWaiter}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              color: 'var(--danger)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Bell size={16} />
            <span>Call Waiter</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="timeline-pipeline">
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '5%',
          right: '5%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }}>
          <div style={{
            height: '100%',
            width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
            transition: 'width 0.5s ease'
          }} />
        </div>

        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;

          return (
            <div
              key={stage.key}
              className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-circle">
                <Icon size={18} />
              </div>
              <span className="step-label">{stage.label}</span>
            </div>
          );
        })}
      </div>

      {/* Order Item Summary Pills */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-light)' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Items in this order:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {activeOrder.items.map((item, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.quantity}x</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
