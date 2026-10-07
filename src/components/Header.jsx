import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { NAV_ITEMS } from '../data/mediaData';

export const Header = () => {
  const { searchQuery, setSearchQuery } = useVault();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className={navTheme}>
      <button
        className="burger"
        aria-label="menu"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </button>

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

      <Link to="/login" className="av" title="Login / Profile" aria-label="Login"></Link>
    </header>
  );
};
