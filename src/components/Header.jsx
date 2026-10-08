import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { NAV_ITEMS } from '../data/mediaData';

export const Header = () => {
  const { searchQuery, setSearchQuery, user, signOut } = useVault();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navTheme = !searchQuery
    ? location.pathname === '/anime'
      ? 'anime'
      : location.pathname === '/series'
      ? 'series'
      : location.pathname === '/watchlist'
      ? 'watchlist'
      : location.pathname === '/favorites'
      ? 'favorites'
      : ''
    : '';

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <>
      <header className={navTheme}>
        <Link
          to="/home"
          className="logo bg"
          onClick={() => {
            setSearchQuery('');
            window.scrollTo(0, 0);
          }}
        >
          TITANVAULT
          <small>MY MEDIA UNIVERSE</small>
        </Link>

        <nav id="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => `bg ${isActive && !searchQuery ? 'on' : ''}`}
              onClick={() => {
                setSearchQuery('');
                window.scrollTo(0, 0);
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="search">
          <input
            id="q"
            type="text"
            placeholder="Search movies, anime, series..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <span>⌕</span>
        </div>

        {/* Profile Picture / Account Button */}
        {user ? (
          <button
            type="button"
            className="av"
            onClick={() => setShowLogoutModal(true)}
            title={`Account: ${user.user_metadata?.username || user.email} (Click to log out)`}
            aria-label="Profile and Log Out"
          >
            <span className="av-letter">
              {(user.user_metadata?.username || user.email || 'U')[0].toUpperCase()}
            </span>
          </button>
        ) : (
          <Link
            to="/login"
            className="av"
            title="Log In / Register"
            aria-label="Log In"
          >
            <span className="av-icon">👤</span>
          </Link>
        )}
      </header>

      {/* CONFIRM LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="comic-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="comic-modal-container logout-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="comic-modal-header">
              <div className="cm-tag bg">ACCOUNT SESSION // TITAN SECURITY</div>
              <button
                type="button"
                className="cm-close-btn bg"
                onClick={() => setShowLogoutModal(false)}
                aria-label="Close"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="logout-modal-content">
              <div className="logout-avatar-badge bg">
                {(user?.user_metadata?.username || user?.email || 'U')[0].toUpperCase()}
              </div>

              <h2 className="logout-modal-title bg">LOG OUT OF TITANVAULT?</h2>
              <p className="logout-modal-desc">
                You are currently signed in as{' '}
                <strong style={{ color: 'var(--yel)' }}>
                  {user?.user_metadata?.username || user?.email}
                </strong>
                .<br />
                Do you want to end your session on this device?
              </p>

              <div className="logout-modal-actions">
                <button
                  type="button"
                  className="btn bg logout-btn-confirm"
                  onClick={handleConfirmLogout}
                >
                  ✓ LOG OUT NOW
                </button>
                <button
                  type="button"
                  className="logout-btn-cancel bg"
                  onClick={() => setShowLogoutModal(false)}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
