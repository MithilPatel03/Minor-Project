import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Clock, Utensils, Sparkles, ChevronRight } from 'lucide-react';
import { RESTAURANTS } from '../data/initialData';

export default function RestaurantsPage({ onSelectRestaurant, currentRestaurantId }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = RESTAURANTS.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  });

  const handleSelect = (rId) => {
    onSelectRestaurant(rId);
    navigate('/menu');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(16, 185, 129, 0.12))',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span>Multi-Restaurant Dining Marketplace</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              Explore Top Restaurants & Dine-In Hubs
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Scan table QR codes or pick any gourmet restaurant to view its live menu and order instantly.
            </p>
          </div>

          <div className="search-input-wrapper" style={{ minWidth: '280px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filteredRestaurants.map(restaurant => {
          const isSelected = currentRestaurantId === restaurant.id;

          return (
            <div
              key={restaurant.id}
              className="menu-card"
              style={{
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-light)',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <div className="card-img-wrapper" style={{ height: '190px' }}>
                <img src={restaurant.image} alt={restaurant.name} className="card-img" />
                <div className="card-badge-container">
                  <span className="card-badge" style={{ background: '#10b981', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="#000" />
                    <span>{restaurant.rating}</span>
                  </span>
                  <span className="card-badge" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    {restaurant.reviewsCount}+ ratings
                  </span>
                </div>
              </div>

              <div className="card-content">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-main)' }}>
                  {restaurant.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                  {restaurant.cuisine}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-add-cart"
                  onClick={() => handleSelect(restaurant.id)}
                  style={{ width: '100%', height: '44px', fontSize: '0.92rem' }}
                >
                  <span>{isSelected ? 'Currently Viewing Menu' : 'Open Restaurant Menu'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
