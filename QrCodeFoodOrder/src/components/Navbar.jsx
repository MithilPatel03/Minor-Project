import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Utensils, ChefHat, QrCode, BarChart3, ShoppingBag, LogIn, Receipt } from 'lucide-react';

export default function Navbar({ cartCount, activeTable, onOpenCart, currentUser, onLogout }) {
  const navigate = useNavigate();

  // Role detection
  const role = currentUser ? currentUser.role : 'customer';
  const isCustomer = role === 'customer';
  const isStaff = role === 'staff';
  const isAdmin = role === 'admin';

  return (
    <header className="navbar">
      {/* Brand & Table Badge (Table Badge shown for Customers) */}
      <div className="brand-section">
        <NavLink to={isStaff ? '/kitchen' : isAdmin ? '/admin' : '/menu'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-icon">
            <Utensils size={22} />
          </div>
          <div>
            <span className="brand-name">EazyOrder</span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isStaff ? 'Kitchen Staff Portal' : isAdmin ? 'Manager Dashboard' : 'Smart QR Dine-In'}
            </div>
          </div>
        </NavLink>

        {isCustomer && activeTable && (
          <div className="table-badge">
            <QrCode size={14} />
            Table #{activeTable}
          </div>
        )}
      </div>

      {/* Role-Based Clean Navigation Links */}
      <nav className="nav-tabs">
        {/* Customer Diner Links */}
        {isCustomer && (
          <>
            <NavLink
              to="/restaurants"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Utensils size={16} />
              <span>Explore Restaurants</span>
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Utensils size={16} />
              <span>Food Menu</span>
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Receipt size={16} />
              <span>My Order</span>
            </NavLink>
          </>
        )}

        {/* Kitchen Staff / Chef Link (Staff Only) */}
        {isStaff && (
          <NavLink
            to="/kitchen"
            className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
          >
            <ChefHat size={16} />
            <span>Chef Kitchen</span>
          </NavLink>
        )}

        {/* Restaurant Manager / Admin Links (Admin Only) */}
        {isAdmin && (
          <>
            <NavLink
              to="/qr-generator"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <QrCode size={16} />
              <span>Print QR Cards</span>
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <BarChart3 size={16} />
              <span>Manager & Prices</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Auth & Cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* View Cart Button (for Customer view) */}
        {isCustomer && cartCount > 0 && (
          <button className="btn-view-cart" onClick={onOpenCart} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <ShoppingBag size={18} />
            <span>Cart ({cartCount})</span>
          </button>
        )}

        {/* Account Profile / Login Button */}
        {currentUser ? (
          <NavLink
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: isAdmin ? '1px solid var(--primary)' : isStaff ? '1px solid var(--warning)' : '1px solid var(--border-light)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: isAdmin ? 'var(--primary)' : isStaff ? 'var(--warning)' : 'var(--accent)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}</span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: isAdmin ? 'var(--primary)' : isStaff ? 'var(--warning)' : 'var(--accent)',
              background: 'rgba(0,0,0,0.3)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {role}
            </span>
          </NavLink>
        ) : (
          <NavLink
            to="/auth"
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary), #d97706)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={16} />
            <span>Login / Register</span>
          </NavLink>
        )}
      </div>
    </header>
  );
}
