import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cpu, UserCheck, ShieldCheck } from 'lucide-react';
import PulseArrow from '../components/PulseArrow';

const LoginRegister = () => {
  const { user, login, register, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  // Toggle tab states: 'login' or 'register'
  const [activeTab, setActiveTab] = useState('login');
  
  // Registration specific role: 'student' or 'faculty'
  const [role, setRole] = useState('student');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institutionName, setInstitutionName] = useState('');

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email || !password) {
          throw new Error('Please fill in both email and password.');
        }
        await login(email, password);
      } else {
        if (!name || !email || !password) {
          throw new Error('Name, email, and password are required.');
        }
        if (role === 'faculty' && !institutionName) {
          throw new Error('Please specify your Institution / College Name.');
        }
        await register(name, email, password, role, institutionName);
      }

    } catch (err) {
      setLocalError(err.message || 'Authentication operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabToggle = (tab) => {
    setActiveTab(tab);
    setLocalError('');
    setEmail('');
    setPassword('');
    setName('');
    setInstitutionName('');
  };

  return (
    <div className="container auth-page" id="auth-page-container">
      <div className="auth-card-wrapper">
        {/* Brand branding */}
        <div className="auth-brand-logo" style={{ textAlign: 'center' }}>
          <Cpu className="logo-icon-spin" size={40} />
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800 }}>
            EduCircuit <span style={{ color: 'var(--accent-indigo)' }}>Labs</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
            Manage your student kits purchases or institutional PO quote approvals.
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabToggle('login')}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabToggle('register')}
          >
            Create Account
          </button>
        </div>

        {/* Auth form card */}
        <form onSubmit={handleSubmit} className="auth-form card-panel">
          {(localError || authError) && (
            <div className="error-alert">
              {localError || authError}
            </div>
          )}

          {activeTab === 'register' && (
            <>
              {/* Role Toggle Selector */}
              <div className="role-selector-row">
                <button
                  type="button"
                  className={`role-btn ${role === 'student' ? 'active' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <UserCheck size={14} style={{ marginRight: '4px' }} />
                  Student
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'faculty' ? 'active' : ''}`}
                  onClick={() => setRole('faculty')}
                >
                  <ShieldCheck size={14} style={{ marginRight: '4px' }} />
                  Faculty
                </button>
              </div>

              <div className="filter-group-item" style={{ marginBottom: '16px' }}>
                <label className="select-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Robert Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="filter-group-item" style={{ marginBottom: '16px' }}>
            <label className="select-label">Email Address</label>
            <input
              type="email"
              required
              placeholder="robert@educircuit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="filter-group-item" style={{ marginBottom: '16px' }}>
            <label className="select-label">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {activeTab === 'register' && (
            <div className="filter-group-item" style={{ marginBottom: '16px' }}>
              <label className="select-label">
                {role === 'faculty' ? 'College Name *' : 'School / College (Optional)'}
              </label>
              <input
                type="text"
                required={role === 'faculty'}
                placeholder="MIT School of Engineering"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary auth-submit-btn"
            style={{ padding: '12px' }}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                {activeTab === 'login' ? 'Sign In' : 'Register'}
                <PulseArrow style={{ marginLeft: '4px', width: '16px', height: '8px' }} />
              </span>
            )}
          </button>
        </form>

        {/* Sandbox Credentials helper Box */}
        <div className="auth-footer-help">
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Sandbox logins:</h4>
          <div style={{ marginBottom: '4px' }}><strong>Student:</strong> <code>student@educircuit.com</code> / <code>student123</code></div>
          <div style={{ marginBottom: '4px' }}><strong>Faculty:</strong> <code>college@educircuit.com</code> / <code>college123</code></div>
          <div><strong>Admin:</strong> <code>admin@educircuit.com</code> / <code>admin123</code></div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
