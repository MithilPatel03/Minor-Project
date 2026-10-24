import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Plus, SlidersHorizontal, Flame, Clock, Heart, Utensils, Check } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import ItemModal from './ItemModal';
import OrderTracker from './OrderTracker';

export default function CustomerView({
  menu,
  activeTable,
  onTableChange,
  cart,
  onAddToCart,
  onOpenCart,
  activeOrder,
  onRequestWaiter
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [modalItem, setModalItem] = useState(null);

  const tagsList = ['all', 'Vegetarian', 'Gluten-Free', 'Chef Pick', 'Spicy', 'Popular'];

  // Filtered menu calculation
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      // Stock check
      if (!item.inStock) return false;

      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }

      // Tag filter
      if (selectedTag !== 'all') {
        if (selectedTag === 'Vegetarian' && !item.isVeg) return false;
        if (selectedTag === 'Spicy' && item.spicyLevel === 0) return false;
        if (selectedTag !== 'Vegetarian' && selectedTag !== 'Spicy') {
          if (!item.tags.includes(selectedTag)) return false;
        }
      }

      return true;
    });
  }, [menu, selectedCategory, searchQuery, selectedTag]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cart.reduce((acc, c) => acc + c.totalPrice, 0);

  return (
    <div className="animate-fade-in">
      {/* Table Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.1))',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>
            Welcome to EazyOrder ✨
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Seated at <strong style={{ color: 'var(--primary)' }}>Table #{activeTable}</strong>. Order food & pay directly from your table.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Table:</span>
          <select
            value={activeTable}
            onChange={e => onTableChange(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: '#161a22',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            {['01', '02', '03', '04', '05', '06', '07', '08'].map(t => (
              <option key={t} value={t}>Switch to Table #{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Step Easy Guide for diner customers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>1</div>
          <div>
            <strong style={{ fontSize: '0.88rem', display: 'block' }}>Pick Your Dishes</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tap Add or Customize</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--accent)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>2</div>
          <div>
            <strong style={{ fontSize: '0.88rem', display: 'block' }}>Scan UPI or Pay at Table</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UPI QR: 8511590433@superyes</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--info)', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>3</div>
          <div>
            <strong style={{ fontSize: '0.88rem', display: 'block' }}>Live Cooking Status</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Track kitchen prep live</span>
          </div>
        </div>
      </div>

      {/* Live Order Tracker (If active order exists for this table) */}
      {activeOrder && (
        <OrderTracker activeOrder={activeOrder} onRequestWaiter={onRequestWaiter} />
      )}

      {/* Category Pills */}
      <div className="category-container">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search steak, burrata, cocktails..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="dietary-tags">
          {tagsList.map(tag => (
            <button
              key={tag}
              className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag === 'all' ? 'All Diets' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Item Grid */}
      {filteredMenu.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No dishes found</h3>
          <p>Try adjusting your search terms or dietary filters.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredMenu.map(item => (
            <div key={item.id} className="menu-card">
              <div className="card-img-wrapper">
                <img src={item.image} alt={item.name} className="card-img" />
                <div className="card-badge-container">
                  {item.isVeg ? (
                    <span className="card-badge veg">VEG</span>
                  ) : (
                    <span className="card-badge">NON-VEG</span>
                  )}
                  {item.tags.includes('Chef Pick') && (
                    <span className="card-badge special">CHEF PICK</span>
                  )}
                </div>
                <div className="prep-time-badge">
                  <Clock size={12} />
                  <span>{item.prepTime}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{item.name}</h3>
                  <div className="card-price">₹{item.price}</div>
                </div>

                <p className="card-desc">{item.description}</p>

                <div className="card-footer">
                  <button
                    className="btn-customize"
                    onClick={() => setModalItem(item)}
                  >
                    Customize
                  </button>

                  <button
                    className="btn-add-cart"
                    onClick={() => {
                      onAddToCart({
                        item,
                        quantity: 1,
                        selectedOptions: {},
                        selectedExtras: [],
                        specialNotes: '',
                        unitPrice: item.price,
                        totalPrice: item.price
                      });
                    }}
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Cart Bar */}
      {totalCartCount > 0 && (
        <div className="floating-cart-bar animate-fade-in">
          <div className="cart-bar-info">
            <div className="cart-icon-wrapper">
              <Utensils size={20} />
              <div className="cart-count-badge">{totalCartCount}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Table #{activeTable} Cart</div>
              <div className="cart-price-total">₹{totalCartPrice.toFixed(2)}</div>
            </div>
          </div>

          <button className="btn-view-cart" onClick={onOpenCart}>
            <span>View Order Cart</span>
          </button>
        </div>
      )}

      {/* Item Customization Modal */}
      {modalItem && (
        <ItemModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}
