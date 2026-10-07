import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVault } from '../context/VaultContext';

export const Login = () => {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signIn, isSupabaseReady } = useVault();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-mode');
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove('auth-mode');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // If Supabase is configured, execute real authentication
    if (isSupabaseReady) {
      const email = emailOrUser.trim();
      if (!email.includes('@')) {
        setErrorMsg('PLEASE ENTER A VALID EMAIL ADDRESS TO SIGN IN.');
        return;
      }

      setSubmitting(true);
      try {
        await signIn(email, password);
        setSuccessMsg('LOGIN SUCCESSFUL! OPENING VAULT...');
        setTimeout(() => {
          navigate('/home');
        }, 800);
      } catch (err) {
        setErrorMsg(err.message ? err.message.toUpperCase() : 'INVALID LOGIN CREDENTIALS.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local demo mode if Supabase keys haven't been added to .env yet
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        navigate('/home');
      }, 500);
    }
  };

  return (
    <div className="auth-page auth-login">
      <Link to="/" className="auth-back-badge bg" title="Return to TitanVault">
        ← BACK TO VAULT
      </Link>

      <div className="auth-container centered">
        {/* Website Logo */}
        <Link to="/" className="auth-logo-header bg" title="Return to TitanVault">
          <span className="logo-titan">TITAN</span>
          <span className="logo-vault login-vault">VAULT</span>
          <small>MY MEDIA UNIVERSE</small>
        </Link>

        {/* Centered Comic Form Card */}
        <div className="auth-card-panel">
          <div className="auth-card">
            <div className="auth-card-header">
              <h1 className="auth-title bg">
                <span>WELCOME</span> <span className="auth-accent login-accent">BACK</span>
              </h1>
              <div className="auth-badge login-badge bg">TO THE VAULT</div>
            </div>

            {errorMsg && (
              <div className="auth-comic-alert bg">
                <span className="alert-sfx">POW!</span> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="auth-comic-success bg">
                <span className="alert-sfx">BOOM!</span> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email or Username */}
              <div className="auth-field">
                <label className="auth-label">EMAIL ADDRESS</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label">PASSWORD</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="auth-options">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={submitting}
                  />
                  <span className="auth-checkbox-custom"></span>
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="auth-forgot-link" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn login-btn bg"
                disabled={submitting}
              >
                {submitting ? 'AUTHENTICATING...' : 'LOGIN'}
              </button>

              {/* Footer switch */}
              <div className="auth-switch-text">
                Don't have an account?{' '}
                <Link to="/signup" className="auth-switch-link login-switch bg">
                  SIGN UP
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
