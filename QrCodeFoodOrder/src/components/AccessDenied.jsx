import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export default function AccessDenied({ requiredRole, currentUser, onSwitchRole }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--danger)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 24px',
        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <ShieldAlert size={36} />
        </div>

        <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '8px' }}>
          Access Restricted ({requiredRole.toUpperCase()} ONLY)
        </h3>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
          You are currently logged in as a <strong>{currentUser ? currentUser.role : 'Customer'}</strong>.
          This page is restricted to restaurant {requiredRole === 'admin' ? 'Managers & Owners' : 'Kitchen Staff'}.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn-add-cart"
            onClick={() => {
              if (onSwitchRole) onSwitchRole(requiredRole);
              navigate(requiredRole === 'admin' ? '/admin' : '/kitchen');
            }}
            style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
          >
            <LogIn size={18} />
            <span>Switch to {requiredRole.toUpperCase()} Demo Account</span>
          </button>

          <button
            type="button"
            className="btn-customize"
            onClick={() => navigate('/menu')}
            style={{ width: '100%', height: '44px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Diner Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
