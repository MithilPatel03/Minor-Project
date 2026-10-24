import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, Utensils, Receipt, ChevronRight } from 'lucide-react';
import OrderTracker from '../components/OrderTracker';

export default function OrderHistoryPage({ orders, activeTable, onRequestWaiter }) {
  const tableOrders = orders.filter(o => o.tableNumber === activeTable);
  const activeOrder = orders.find(o => o.tableNumber === activeTable && o.status !== 'SERVED');

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Dine-In Order History</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Active status tracking & receipt history for <strong style={{ color: 'var(--primary)' }}>Table #{activeTable}</strong>
        </p>
      </div>

      {/* Active Live Order Tracker */}
      {activeOrder && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--primary)' }}>
            🔥 Live Table Order Status
          </h3>
          <OrderTracker activeOrder={activeOrder} onRequestWaiter={onRequestWaiter} />
        </div>
      )}

      {/* Past Receipts Section */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Past Receipts</h3>

      {tableOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)'
        }}>
          <Receipt size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <h4 style={{ color: 'var(--text-main)', marginBottom: '6px' }}>No orders placed for Table #{activeTable} yet</h4>
          <p style={{ fontSize: '0.88rem' }}>Browse the menu and place an order to see receipts here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tableOrders.map(order => (
            <div
              key={order.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Receipt #{order.id}</span>
                    <span className="table-badge">Table #{order.tableNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {new Date(order.timestamp).toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{order.total ? order.total.toFixed(2) : '0.00'}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: order.status === 'SERVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: order.status === 'SERVED' ? 'var(--accent)' : 'var(--primary)'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '12px' }}>
                {order.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span>{it.quantity || 1}x {it.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      ₹{(it.totalPrice || ((it.price || 0) * (it.quantity || 1)) || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
