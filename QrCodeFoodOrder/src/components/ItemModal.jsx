import React, { useState } from 'react';
import { X, Flame, Sparkles, Plus, Minus, Check } from 'lucide-react';

export default function ItemModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // Handle radio customization option (e.g. doneness, crust)
  const handleOptionChange = (groupName, value) => {
    setSelectedOptions(prev => ({ ...prev, [groupName]: value }));
  };

  // Handle checkbox extra toppings
  const toggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.name === extra.name);
      if (exists) {
        return prev.filter(e => e.name !== extra.name);
      } else {
        return [...prev, extra];
      }
    });
  };

  // Compute calculated unit price
  const extrasTotal = selectedExtras.reduce((acc, e) => acc + e.price, 0);
  const unitPrice = item.price + extrasTotal;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleAdd = () => {
    onAddToCart({
      item,
      quantity,
      selectedOptions,
      selectedExtras,
      specialNotes,
      unitPrice,
      totalPrice: parseFloat(totalPrice)
    });
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Customize Item</h3>
            {item.isVeg ? (
              <span className="card-badge veg">Veg</span>
            ) : (
              <span className="card-badge">Non-Veg</span>
            )}
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Header Image & Info */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{item.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {item.description}
              </p>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{item.price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Customization Options (Radio groups) */}
          {item.customizations && Object.entries(item.customizations).map(([key, options]) => {
            if (key === 'extras') return null; // handled separately
            return (
              <div key={key} style={{ marginBottom: '20px' }}>
                <h5 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '10px', textTransform: 'capitalize' }}>
                  Select {key}:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {options.map((opt) => {
                    const isSelected = selectedOptions[key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOptionChange(key, opt)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Add-ons & Extras */}
          {item.customizations && item.customizations.extras && (
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                Add Extra Toppings & Sides:
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.customizations.extras.map((extra) => {
                  const isChecked = selectedExtras.some(e => e.name === extra.name);
                  return (
                    <label
                      key={extra.name}
                      onClick={() => toggleExtra(extra)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isChecked ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1px solid var(--text-muted)',
                          background: isChecked ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000'
                        }}>
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{extra.name}</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                        +₹{extra.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Cooking Notes */}
          <div style={{ marginBottom: '24px' }}>
            <h5 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Special Kitchen Requests:
            </h5>
            <textarea
              placeholder="e.g. Allergy info, less salt, sauce on the side..."
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                resize: 'none'
              }}
            />
          </div>

          {/* Quantity Selector & Add to Order Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '4px'
            }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '8px', color: 'var(--text-main)', background: 'transparent' }}
              >
                <Minus size={18} />
              </button>
              <span style={{ width: '32px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '8px', color: 'var(--text-main)', background: 'transparent' }}
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAdd}
              style={{ height: '48px', fontSize: '1rem' }}
            >
              Add to Order • ₹{totalPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
