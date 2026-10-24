import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Bell, CheckCircle2, Volume2, VolumeX, Sparkles, AlertCircle, Utensils } from 'lucide-react';
import { playKitchenBell } from '../utils/syncService';

export default function KitchenView({ orders, onUpdateOrderStatus, waiterRequests, onClearWaiterRequest }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Trigger sound when new order arrives if sound is enabled
  useEffect(() => {
    const hasSent = orders.some(o => o.status === 'SENT');
    if (hasSent && soundEnabled) {
      playKitchenBell();
    }
  }, [orders.length]);

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'ALL') return o.status !== 'SERVED';
    return o.status === filterStatus;
  });

  const getNextStatus = (current) => {
    if (current === 'SENT') return 'ACCEPTED';
    if (current === 'ACCEPTED') return 'PREPARING';
    if (current === 'PREPARING') return 'READY';
    if (current === 'READY') return 'SERVED';
    return 'SERVED';
  };

  const getStatusButtonText = (current) => {
    if (current === 'SENT') return 'Accept Ticket';
    if (current === 'ACCEPTED') return 'Start Cooking';
    if (current === 'PREPARING') return 'Mark Ready to Serve';
    if (current === 'READY') return 'Complete & Serve';
    return 'Served';
  };

  return (
    <div className="animate-fade-in">
      {/* KDS Header Controls */}
      <div className="kds-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="brand-icon" style={{ background: 'var(--primary)', color: '#000' }}>
            <ChefHat size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Live Kitchen Display System (KDS)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time incoming table tickets & staff dispatch
            </p>
          </div>
        </div>

        <div className="kds-stats">
          <div className="stat-pill">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Orders:</span>
            <span className="stat-number">
              {orders.filter(o => o.status !== 'SERVED').length}
            </span>
          </div>

          <button
            type="button"
            className="stat-pill"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playKitchenBell();
            }}
            style={{ cursor: 'pointer', borderColor: soundEnabled ? 'var(--primary)' : 'var(--border-light)' }}
          >
            {soundEnabled ? <Volume2 size={18} color="var(--primary)" /> : <VolumeX size={18} color="var(--text-muted)" />}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: soundEnabled ? 'var(--primary)' : 'var(--text-muted)' }}>
              {soundEnabled ? 'Audio Alerts ON' : 'Muted'}
            </span>
          </button>
        </div>
      </div>

      {/* Waiter Requests Notification Banner */}
      {waiterRequests && waiterRequests.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '24px',
          animation: 'pulseUrgent 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <AlertCircle size={20} color="var(--danger)" />
            <h4 style={{ fontSize: '1rem', color: 'var(--danger)' }}>
              Active Waitstaff Service Calls ({waiterRequests.length})
            </h4>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {waiterRequests.map((req, idx) => (
              <div
                key={idx}
                style={{
                  background: '#161a22',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.88rem'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--primary)' }}>Table #{req.tableNumber}</strong>: {req.requestType}
                  {req.note && <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}> ({req.note})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => onClearWaiterRequest(idx)}
                  style={{
                    background: 'var(--accent)',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'SENT', 'ACCEPTED', 'PREPARING', 'READY'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: filterStatus === st ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: filterStatus === st ? '#000' : 'var(--text-muted)',
              border: filterStatus === st ? 'none' : '1px solid var(--border-light)'
            }}
          >
            {st === 'ALL' ? 'Active Tickets' : st}
          </button>
        ))}
      </div>

      {/* Ticket Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👨‍🍳</div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '6px' }}>No active tickets</h3>
          <p>New customer table orders will appear here automatically in real-time.</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {filteredOrders.map(order => {
            const nextSt = getNextStatus(order.status);
            const btnLabel = getStatusButtonText(order.status);

            return (
              <div key={order.id} className={`ticket-card ${order.status.toLowerCase()}`}>
                <div className="ticket-header">
                  <div>
                    <span className="ticket-table-num">Table #{order.tableNumber}</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ticket #{order.id}</div>
                  </div>
                  <div className="ticket-timer">
                    <Clock size={14} />
                    <span>{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="ticket-body">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="ticket-item">
                      <div>
                        <div>
                          <span className="item-qty">{item.quantity}x</span>
                          <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                        </div>

                        {/* Options */}
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '2px' }}>
                            {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                          </div>
                        )}

                        {item.specialNotes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontStyle: 'italic', marginTop: '2px' }}>
                            NOTE: "{item.specialNotes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ticket-actions">
                  <button
                    type="button"
                    className={`btn-status-step ${order.status === 'SENT' ? 'accept' : order.status === 'PREPARING' ? 'ready' : 'complete'}`}
                    onClick={() => onUpdateOrderStatus(order.id, nextSt)}
                  >
                    <span>{btnLabel}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
