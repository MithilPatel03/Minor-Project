import React from 'react';
import { User, Award, ShieldCheck, Phone, Mail, Clock, ShoppingBag, LogOut, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage({ user, onLogout, onSwitchRole, userOrdersCount }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Please log in to view your profile</h3>
        <button className="btn-add-cart" onClick={() => navigate('/auth')}>
          Go to Login
        </button>
      </div>
    );
  }

  const role = user.role || 'customer';

  return (
    <div className="animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto' }}>
      {/* Profile Card Header */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: role === 'admin' ? 'linear-gradient(135deg, var(--primary), #d97706)' : role === 'staff' ? 'linear-gradient(135deg, var(--warning), #b45309)' : 'linear-gradient(135deg, var(--accent), #047857)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 800
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{user.name}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700 }}>
                <Award size={12} />
                <span>{user.tier || 'Gold Diner'} • Role: {role.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-customize"
            onClick={() => {
              onLogout();
              navigate('/auth');
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              borderColor: 'var(--danger)',
              color: 'var(--danger)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Fast Role Switcher Box for Testing */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px dashed var(--primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <RefreshCw size={18} color="var(--primary)" />
          <h4 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Test Role Switcher</h4>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Switch active account role to test customer navigation vs kitchen staff vs admin view options:
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { id: 'customer', label: '👤 Customer View' },
            { id: 'staff', label: '👨‍🍳 Kitchen Staff' },
            { id: 'admin', label: '📊 Restaurant Admin' }
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSwitchRole(r.id);
                if (r.id === 'staff') navigate('/kitchen');
                else if (r.id === 'admin') navigate('/admin');
                else navigate('/menu');
              }}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: role === r.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: role === r.id ? '#000' : 'var(--text-main)',
                border: role === r.id ? 'none' : '1px solid var(--border-light)'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards & Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <Sparkles size={24} color="var(--primary)" style={{ margin: '0 auto 8px auto' }} />
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
            {user.loyaltyPoints || 250} PTS
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Loyalty Rewards Balance
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'center'
        }}>
          <ShoppingBag size={24} color="var(--accent)" style={{ margin: '0 auto 8px auto' }} />
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {userOrdersCount} Orders
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Dine-In Visits
          </div>
        </div>
      </div>
    </div>
  );
}
