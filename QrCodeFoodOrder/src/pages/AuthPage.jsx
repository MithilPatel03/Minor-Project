import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, ShieldCheck, ChefHat, Sparkles, LogIn, UserPlus, Utensils, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'staff' | 'admin'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Generate user profile object
    const userProfile = {
      id: `usr_${Math.floor(Math.random() * 10000)}`,
      name: mode === 'register' ? name : (email.split('@')[0] || 'Diner Guest'),
      email,
      phone: phone || '+1 (555) 234-5678',
      role,
      loyaltyPoints: 250,
      tier: 'Gold Member'
    };

    onLogin(userProfile);

    // Redirect based on role
    if (role === 'staff') {
      navigate('/kitchen');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/menu');
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemo = (demoRole) => {
    let demoUser = {
      id: 'demo_101',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 987-6543',
      role: 'customer',
      loyaltyPoints: 340,
      tier: 'Platinum Diner'
    };

    if (demoRole === 'staff') {
      demoUser = {
        id: 'staff_88',
        name: 'Head Chef Marco',
        email: 'chef.marco@eazyorder.com',
        role: 'staff',
        loyaltyPoints: 0,
        tier: 'Staff'
      };
    } else if (demoRole === 'admin') {
      demoUser = {
        id: 'admin_01',
        name: 'Manager Sarah',
        email: 'sarah.manager@eazyorder.com',
        role: 'admin',
        loyaltyPoints: 0,
        tier: 'Admin'
      };
    }

    onLogin(demoUser);

    if (demoRole === 'staff') navigate('/kitchen');
    else if (demoRole === 'admin') navigate('/admin');
    else navigate('/menu');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '460px', margin: '40px auto 0 auto' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="brand-icon" style={{ width: '56px', height: '56px', margin: '0 auto 12px auto' }}>
          <Utensils size={30} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome to EazyOrder</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {mode === 'login' ? 'Sign in to access your table account & rewards' : 'Create a new EazyOrder account for faster dining'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '4px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-light)',
        marginBottom: '24px'
      }}>
        <button
          type="button"
          onClick={() => { setMode('login'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: mode === 'login' ? 'var(--primary)' : 'transparent',
            color: mode === 'login' ? '#000' : 'var(--text-muted)'
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: mode === 'register' ? 'var(--primary)' : 'transparent',
            color: mode === 'register' ? '#000' : 'var(--text-muted)'
          }}
        >
          Create Account
        </button>
      </div>

      {/* Form Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Account Type / Role:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'customer', label: 'Diner Guest' },
                  { id: 'staff', label: 'Kitchen Chef' },
                  { id: 'admin', label: 'Manager' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: role === r.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)',
                      color: role === r.id ? 'var(--primary)' : 'var(--text-muted)',
                      border: role === r.id ? '1px solid var(--primary)' : '1px solid var(--border-light)'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-add-cart"
            style={{ width: '100%', height: '48px', fontSize: '1rem', marginBottom: '20px' }}
          >
            {mode === 'login' ? (
              <>
                <LogIn size={18} />
                <span>Sign In to Account</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create EazyOrder Account</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Presets */}
        <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>
            ⚡ Fast Demo 1-Click Login Presets:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>👤 Customer Diner Login</span>
              <span style={{ color: 'var(--accent)', fontWeight: 800 }}>Gold Member</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>👨‍🍳 Kitchen Staff Login</span>
              <span style={{ color: 'var(--warning)', fontWeight: 800 }}>KDS Tickets</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>📊 Restaurant Owner Login</span>
              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Admin & Sales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
