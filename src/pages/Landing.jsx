import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoviesIcon, AnimeIcon, SeriesIcon } from '../components/Icons';

export const Landing = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.classList.add('landing-mode');
    window.scrollTo(0, 0);

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.body.classList.remove('landing-mode');
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="comic-page">
      {/* Halftone & Ink Splatter Texture Background */}
      <div
        className="comic-bg-halftone"
        style={{
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`
        }}
      />
      <div className="comic-ink-splatter" />

      {/* Comic Book Header Banner / Issue Bar */}
      <div className="comic-issue-bar">
        <div className="issue-left bg">
          <span className="issue-stamp">ISSUE #1</span>
          <span className="issue-title">TITANVAULT COMICS GROUP</span>
          <span className="issue-sub">★ ALL-MEDIA ARCHIVE ★</span>
        </div>
        <div className="issue-center bg">
          "THE GREATEST PERSONAL MEDIA COLLECTION IN THE MULTIVERSE!"
        </div>
        <div className="issue-right bg">
          <span className="issue-badge">100% FREE</span>
        </div>
      </div>

      <div className="comic-spread">
        {/* ========================================================
            1. HERO / MAIN PANEL
            ======================================================== */}
        <section className="comic-panel hero-comic-panel">
          {/* Comic Corner Corner Brackets */}
          <div className="comic-corner tl" />
          <div className="comic-corner tr" />
          <div className="comic-corner bl" />
          <div className="comic-corner br" />

          {/* Sound Effect Boom Starburst */}
          <div className="comic-sfx-burst bg" style={{ transform: `rotate(-12deg) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}>
            <span>BOOM!</span>
          </div>

          <div className="hero-comic-content">
            {/* Center Comic Title Logo */}
            <div
              className="comic-logo-wrap"
              style={{
                transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
              }}
            >
              <h1 className="comic-main-logo bg">
                <span className="logo-word-titan">TITAN</span>
                <span className="logo-word-vault">VAULT</span>
              </h1>
              <div className="comic-sub-banner bg">
                MY MEDIA UNIVERSE
              </div>
            </div>

            {/* Tagline & Supporting Caption Box */}
            <div className="comic-caption-box">
              <div className="comic-tagline bg">
                YOUR MOVIES. YOUR ANIME. YOUR SERIES.
              </div>
              <p className="comic-supporting">
                ONE PLACE TO KEEP YOUR COLLECTION.
              </p>
            </div>

            {/* ========================================================
                3. ACTION BUTTONS
                ======================================================== */}
            <div className="comic-actions">
              <Link to="/login" className="comic-btn btn-enter bg">
                <span className="btn-ink"></span>
                <span className="btn-text">ENTER THE VAULT</span>
                <span className="btn-arrow">→</span>
              </Link>

              <Link to="/signup" className="comic-btn btn-create bg">
                <span className="btn-ink"></span>
                <span className="btn-text">CREATE ACCOUNT</span>
                <span className="btn-arrow">⚡</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. MEDIA PANELS (MOVIES, ANIME, SERIES)
            ======================================================== */}
        <div className="comic-media-grid">
          {/* Panel 1: MOVIES */}
          <div className="comic-panel media-comic-panel panel-movies">
            <div className="panel-artwork art-movies" />
            <div className="panel-halftone-overlay" />
            <div className="panel-top-tag bg">VOLUME I</div>
            <div className="panel-sfx bg">ACTION!</div>

            <div className="panel-info">
              <h2 className="panel-heading bg">MOVIES</h2>
              <div className="panel-desc bg">DIFFERENT WORLDS. SAME EMOTIONS.</div>
            </div>
            <Link to="/login" className="panel-link-badge bg">
              EXPLORE ARCHIVE ›
            </Link>
          </div>

          {/* Panel 2: ANIME */}
          <div className="comic-panel media-comic-panel panel-anime">
            <div className="panel-artwork art-anime" />
            <div className="panel-halftone-overlay" />
            <div className="panel-top-tag bg">VOLUME II</div>
            <div className="panel-sfx bg">SUGOI!</div>

            <div className="panel-info">
              <h2 className="panel-heading bg">ANIME</h2>
              <div className="panel-desc bg">MORE THAN JUST AN ANIMATION.</div>
            </div>
            <Link to="/login" className="panel-link-badge bg">
              EXPLORE SHONEN ›
            </Link>
          </div>

          {/* Panel 3: SERIES */}
          <div className="comic-panel media-comic-panel panel-series">
            <div className="panel-artwork art-series" />
            <div className="panel-halftone-overlay" />
            <div className="panel-top-tag bg">VOLUME III</div>
            <div className="panel-sfx bg">BINGE!</div>

            <div className="panel-info">
              <h2 className="panel-heading bg">SERIES</h2>
              <div className="panel-desc bg">EPISODES THAT STAY WITH YOU.</div>
            </div>
            <Link to="/login" className="panel-link-badge bg">
              EXPLORE SAGAS ›
            </Link>
          </div>
        </div>

        {/* ========================================================
            4. SMALL FEATURE STRIP
            ======================================================== */}
        <footer className="comic-feature-strip">
          <div className="comic-feature-card feat-movies">
            <span className="feat-icon"><MoviesIcon className="feat-svg" size={26} /></span>
            <div className="feat-text">
              <strong className="bg">MOVIES</strong>
              <small>Build your collection</small>
            </div>
          </div>

          <div className="comic-feature-card feat-anime">
            <span className="feat-icon"><AnimeIcon className="feat-svg" size={26} /></span>
            <div className="feat-text">
              <strong className="bg">ANIME</strong>
              <small>Track your journey</small>
            </div>
          </div>

          <div className="comic-feature-card feat-series">
            <span className="feat-icon"><SeriesIcon className="feat-svg" size={26} /></span>
            <div className="feat-text">
              <strong className="bg">SERIES</strong>
              <small>Never lose your progress</small>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
