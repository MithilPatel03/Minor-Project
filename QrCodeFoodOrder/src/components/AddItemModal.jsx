import React, { useState } from 'react';
import { X, Plus, Utensils, Sparkles, Image, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';

export default function AddItemModal({ isOpen, onClose, onAddItem, currentRestaurantId }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('mains');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('15 mins');
  const [isVeg, setIsVeg] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');

  const PRESET_IMAGES = [
    { label: 'Gourmet Meal', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pizza', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80' },
    { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Indian Curry', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80' },
    { label: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Drink / Mocktail', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
    { label: 'Dessert Cake', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newItem = {
      id: `m_${Date.now()}`,
      restaurantId: currentRestaurantId || 'r1',
      name,
      category,
      price: parseFloat(price),
      description: description || 'Delicious freshly prepared dish.',
      image: imageUrl,
      prepTime: prepTime || '15 mins',
      calories: 450,
      tags: [isVeg ? 'Vegetarian' : 'Non-Veg', 'New Dish'],
      isVeg,
      spicyLevel: 0,
      customizations: {},
      inStock: true
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Menu Dish</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Dish Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Dish Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Butter Chicken Deluxe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
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

          {/* Price (INR) & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Price in ₹ (INR) *
              </label>
              <input
                type="number"
                placeholder="e.g. 380"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Menu Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#161a22',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Veg / Non-Veg Toggle & Prep Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Dietary Type
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsVeg(true)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: isVeg ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: isVeg ? 'var(--accent)' : 'var(--text-muted)',
                    border: isVeg ? '1px solid var(--accent)' : '1px solid var(--border-light)'
                  }}
                >
                  🟢 Veg
                </button>

                <button
                  type="button"
                  onClick={() => setIsVeg(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: !isVeg ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: !isVeg ? 'var(--danger)' : 'var(--text-muted)',
                    border: !isVeg ? '1px solid var(--danger)' : '1px solid var(--border-light)'
                  }}
                >
                  🔴 Non-Veg
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Prep Time
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                placeholder="e.g. 15 mins"
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
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Description & Ingredients
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Slow cooked cottage cheese in rich tomato gravy..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                resize: 'none'
              }}
            />
          </div>

          {/* Preset Photo Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Select Food Image Preset:
            </label>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {PRESET_IMAGES.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.label}
                  onClick={() => setImageUrl(img.url)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: imageUrl === img.url ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    opacity: imageUrl === img.url ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-add-cart"
            style={{ width: '100%', height: '48px', fontSize: '1rem' }}
          >
            <Plus size={18} />
            <span>Publish New Dish to Menu</span>
          </button>
        </form>
      </div>
    </div>
  );
}
