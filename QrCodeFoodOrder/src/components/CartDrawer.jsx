import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Trash2, Plus, Minus, Sparkles, CheckCircle2, QrCode, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeItem,
  onPlaceOrder,
  activeTable
}) {
  if (!isOpen) return null;

  const [tipPercent, setTipPercent] = useState(15);
  const [paymentMethod, setPaymentMethod] = useState('UPI Instant Payment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const tax = subtotal * 0.05; // 5% GST
  const tipAmount = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + tax + tipAmount;

  const upiId = '8511590433@superyes';
  // Standard Indian UPI Deep-Link Format with exact bill total
  const upiUri = `upi://pay?pa=${upiId}&pn=EazyOrder%20Restaurant&am=${grandTotal.toFixed(2)}&cu=INR&tn=Table%20${activeTable}%20Dine-in%20Order`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Trigger confetti celebration
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      onPlaceOrder({
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        tip: parseFloat(tipAmount.toFixed(2)),
        total: parseFloat(grandTotal.toFixed(2)),
        paymentMethod
      });
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '490px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Dine-In Cart</h3>
            <span className="table-badge">Table #{activeTable}</span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽️</div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '6px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem' }}>Scan or browse items from the menu to build your table order.</p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '220px', overflowY: 'auto' }}>
                {cart.map((cartItem, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{cartItem.item.name}</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{cartItem.totalPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Selected Options Summary */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {Object.entries(cartItem.selectedOptions || {}).map(([k, v]) => (
                        <span key={k} style={{ marginRight: '8px' }}>• {k}: {v}</span>
                      ))}
                      {cartItem.selectedExtras && cartItem.selectedExtras.length > 0 && (
                        <div>+ {cartItem.selectedExtras.map(e => e.name).join(', ')}</div>
                      )}
                      {cartItem.specialNotes && (
                        <div style={{ fontStyle: 'italic', color: 'var(--primary)', marginTop: '2px' }}>
                          "{cartItem.specialNotes}"
                        </div>
                      )}
                    </div>

                    {/* Quantity controls & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px 6px' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, cartItem.quantity - 1)}
                          style={{ color: 'var(--text-muted)', background: 'transparent' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, cartItem.quantity + 1)}
                          style={{ color: 'var(--text-muted)', background: 'transparent' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        style={{ color: 'var(--danger)', background: 'transparent', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip Selection */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Add Staff Tip:
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0, 10, 15, 20, 25].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: tipPercent === pct ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                        color: tipPercent === pct ? '#000' : 'var(--text-muted)',
                        border: tipPercent === pct ? 'none' : '1px solid var(--border-light)'
                      }}
                    >
                      {pct === 0 ? 'No Tip' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Select Payment Method:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'UPI Instant Payment', label: '📱 UPI Payment (QR Code)' },
                    { id: 'Pay at Restaurant', label: '💵 Pay at Restaurant (Cash/Card)' }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: paymentMethod === method.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: paymentMethod === method.id ? 'var(--accent)' : 'var(--text-muted)',
                        border: paymentMethod === method.id ? '1px solid var(--accent)' : '1px solid var(--border-light)'
                      }}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Bill Dynamic UPI QR Code Card */}
              {paymentMethod === 'UPI Instant Payment' && (
                <div style={{
                  background: '#ffffff',
                  color: '#000000',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.05em' }}>
                    Instant Dynamic UPI Payment QR
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 10px 0' }}>
                    Exact Amount: <span style={{ color: '#d97706' }}>₹{grandTotal.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'inline-block', background: '#000', padding: '12px', borderRadius: '12px', marginBottom: '10px' }}>
                    <QRCodeCanvas
                      value={upiUri}
                      size={150}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="M"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '9999px', margin: '0 auto 8px auto', maxWidth: '300px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      UPI ID: {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{ background: 'none', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                      {copiedUpi ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                    Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI App to pay exact bill total.
                  </p>
                </div>
              )}

              {/* Summary Breakdown */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>GST (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Staff Tip ({tipPercent}%)</span>
                  <span>₹{tipAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px dashed var(--border-light)', paddingTop: '6px' }}>
                  <span>Total Bill</span>
                  <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="button"
                className="btn-add-cart"
                onClick={handleCheckout}
                disabled={isSubmitting}
                style={{ width: '100%', height: '50px', fontSize: '1rem' }}
              >
                {isSubmitting ? (
                  <span>Sending Order to Kitchen...</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Place Table Order (₹{grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
