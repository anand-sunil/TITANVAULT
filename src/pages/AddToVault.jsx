import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { searchTMDB, getTMDBDetails, isTMDBConfigured } from '../lib/tmdb';

export const AddToVault = () => {
  // 1. Media Type Selector State: 'movies' | 'anime' | 'series'
  const [mediaType, setMediaType] = useState('movies');

  // 2. Search & Suggestion State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const [tmdbResults, setTmdbResults] = useState([]);

  // 3. Selected Media Preview State (Initially null - empty state on page load)
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // 4. Rating State (1 to 10) - ONLY required when status is 'Watched' or 'Completed'
  const [rating, setRating] = useState(8);

  // 5. Status State
  const [status, setStatus] = useState('Watched');

  // 6. Action Feedback State
  const [addedNotice, setAddedNotice] = useState(false);
  const [isCloudSaved, setIsCloudSaved] = useState(false);
  const dropdownRef = useRef(null);

  const { addVaultEntry } = useVault();
  const tmdbReady = isTMDBConfigured();

  // Status options per media type
  const statusOptions = useMemo(() => {
    if (mediaType === 'movies') {
      return ['Watched', 'Watchlist'];
    }
    return ['Completed', 'Watching', 'Watchlist', 'Dropped'];
  }, [mediaType]);

  // Keep status synchronized when tab changes
  useEffect(() => {
    if (!statusOptions.includes(status)) {
      setStatus(statusOptions[0]);
    }
  }, [statusOptions, status]);

  // Determine if rating should be asked:
  // ONLY ask for rating when completing the movie ('Watched') or series/anime ('Completed')!
  // When adding to Watchlist (or Watching/Dropped), DO NOT ask for rating!
  const shouldAskRating = useMemo(() => {
    if (mediaType === 'movies') {
      return status === 'Watched';
    }
    return status === 'Completed';
  }, [mediaType, status]);

  // Debounced TMDB search effect
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setTmdbResults([]);
      setSearching(false);
      return;
    }

    if (!tmdbReady) {
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchTMDB(q, mediaType);
        setTmdbResults(results);
      } catch (err) {
        console.error('TMDB search error:', err);
        setTmdbResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, mediaType, tmdbReady]);

  const handleSelectMedia = async (item) => {
    setSearchQuery(item.title);
    setIsSearchFocused(false);
    setSelectedMedia(item);

    // If it has a TMDB ID, fetch enhanced details (genres, runtime, seasons)
    if (item.tmdb_id && tmdbReady) {
      setLoadingDetails(true);
      try {
        const details = await getTMDBDetails(item.tmdb_id, item.type || mediaType);
        if (details) {
          setSelectedMedia(details);
        }
      } catch (err) {
        console.warn('Could not load extra TMDB details:', err);
      } finally {
        setLoadingDetails(false);
      }
    }

    // Default status according to media type
    if (mediaType === 'movies') {
      setStatus('Watched');
    } else {
      setStatus('Completed');
    }
  };

  const handleClearSelection = () => {
    setSelectedMedia(null);
    setSearchQuery('');
    setTmdbResults([]);
  };

  const handleTabChange = (type) => {
    setMediaType(type);
    setTmdbResults([]);
    // If selected media doesn't match new type, clear it
    if (selectedMedia && selectedMedia.type !== type) {
      setSelectedMedia(null);
    }
  };

  const handleAddToVault = async () => {
    if (!selectedMedia) return;

    try {
      const res = await addVaultEntry({
        title: selectedMedia.title,
        media_type: selectedMedia.type || mediaType,
        status: status,
        rating: shouldAskRating ? rating : null,
        year: selectedMedia.year || 2024,
        genres: selectedMedia.genres || [],
        overview: selectedMedia.overview || '',
        seasons: selectedMedia.seasons || '',
        poster_hue: selectedMedia.hue || 0,
        poster_url: selectedMedia.poster || null,
      });
      setIsCloudSaved(Boolean(res?.cloud));
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
      }, 4000);
    } catch (err) {
      console.warn('Vault save error:', err);
      setIsCloudSaved(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="add-vault-container">
      {/* 1. COMIC HEADER */}
      <section className="add-vault-header-panel">
        <div className="add-header-burst bg">LIVE TMDB RADAR</div>
        <div className="add-header-content">
          <h1 className="add-vault-title bg">ADD TO VAULT</h1>
          <p className="add-vault-subtitle">Find it. Rate it. Lock it in.</p>
        </div>
        <div className="add-header-stamp bg">REAL DATA // METADATA FETCH</div>
      </section>

      {/* 2. MEDIA TYPE SELECTOR */}
      <section className="add-type-section">
        <div className="comic-section-bar">
          <span className="comic-section-label bg">STEP 01: SELECT CLASSIFICATION</span>
        </div>
        <div className="add-type-selector">
          <button
            type="button"
            className={`add-type-btn bg ${mediaType === 'movies' ? 'active-movies' : ''}`}
            onClick={() => handleTabChange('movies')}
          >
            <span className="type-icon">▦</span> MOVIES
          </button>
          <button
            type="button"
            className={`add-type-btn bg ${mediaType === 'anime' ? 'active-anime' : ''}`}
            onClick={() => handleTabChange('anime')}
          >
            <span className="type-icon">☺</span> ANIME
          </button>
          <button
            type="button"
            className={`add-type-btn bg ${mediaType === 'series' ? 'active-series' : ''}`}
            onClick={() => handleTabChange('series')}
          >
            <span className="type-icon">▣</span> SERIES
          </button>
        </div>
      </section>

      {/* 3. SEARCH INPUT WITH TMDB RESULTS */}
      <section className="add-search-section" ref={dropdownRef}>
        <div className="comic-section-bar">
          <span className="comic-section-label bg">STEP 02: SEARCH TMDB ARCHIVES</span>
          {searching ? (
            <span className="comic-badge-counter bg" style={{ color: 'var(--yel)' }}>
              SCANNING TMDB...
            </span>
          ) : (
            <span className="comic-badge-counter bg">
              {tmdbResults.length} FOUND
            </span>
          )}
        </div>

        <div className="add-search-box-wrapper">
          <div className="add-search-input-box">
            <span className="add-search-icon" aria-hidden="true">⌕</span>
            <input
              type="text"
              className="add-search-input"
              placeholder={`Search real ${mediaType} on TMDB (e.g. Interstellar, Breaking Bad, Solo Leveling)...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="add-search-clear-btn bg"
                onClick={() => {
                  setSearchQuery('');
                  setTmdbResults([]);
                  setIsSearchFocused(false);
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* TMDB API KEY NOTICE (If not configured in .env yet) */}
          {!tmdbReady && searchQuery && (
            <div
              style={{
                marginTop: '8px',
                padding: '10px 14px',
                background: '#1d0909',
                border: '2px solid var(--red)',
                fontSize: '13px',
                color: '#fff',
              }}
            >
              <strong style={{ color: 'var(--yel)' }}>★ TMDB API KEY NEEDED FOR LIVE SEARCH:</strong> Add{' '}
              <code>VITE_TMDB_API_KEY</code> to your <code>.env</code> file (free at themoviedb.org). You can still
              type any title and click "CREATE CUSTOM ENTRY" below!
            </div>
          )}

          {/* SUGGESTION DROPDOWN */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="add-suggestions-dropdown">
              <div className="dropdown-comic-header bg">
                <span>
                  {searching ? 'FETCHING FROM TMDB...' : `TMDB RESULTS (${tmdbResults.length})`}
                </span>
                <span className="dropdown-tip">CLICK TO AUTO-FILL METADATA</span>
              </div>

              {tmdbResults.length > 0 ? (
                <div className="suggestions-list">
                  {tmdbResults.map((item) => (
                    <div
                      key={item.id}
                      className={`suggestion-item ${selectedMedia?.id === item.id ? 'is-selected' : ''}`}
                      onClick={() => handleSelectMedia(item)}
                    >
                      <div className="suggestion-poster-wrap" style={{ '--h': item.hue }}>
                        {item.poster ? (
                          <img
                            src={item.poster}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="suggestion-mini-poster">
                            <span className="smp-title bg">{item.title.substring(0, 3)}</span>
                          </div>
                        )}
                      </div>

                      <div className="suggestion-info">
                        <div className="suggestion-title-row">
                          <strong className="suggestion-title">{item.title}</strong>
                          {item.year && <span className="suggestion-year bg">{item.year}</span>}
                        </div>
                        <div className="suggestion-meta-row">
                          <span className={`suggestion-type-badge bg type-${item.type}`}>
                            {item.typeLabel}
                          </span>
                          <span className="suggestion-genres">
                            {item.genres.slice(0, 2).join(' • ')}
                          </span>
                        </div>
                      </div>

                      <div className="suggestion-action-arrow bg">SELECT ➔</div>
                    </div>
                  ))}
                </div>
              ) : !searching ? (
                <div className="dropdown-no-results">
                  <span className="no-res-sfx bg">CUSTOM TARGET</span>
                  <p>NOT FOUND ON TMDB OR SEARCHING CUSTOM TITLE. ADD MANUALLY?</p>
                  <button
                    type="button"
                    className="btn bg"
                    style={{ marginTop: '10px', fontSize: '18px', padding: '6px 20px', display: 'inline-block' }}
                    onClick={() =>
                      handleSelectMedia({
                        id: 'custom_' + Date.now(),
                        title: searchQuery,
                        year: new Date().getFullYear(),
                        type: mediaType,
                        typeLabel: mediaType === 'movies' ? 'Movie' : mediaType === 'anime' ? 'Anime' : 'Series',
                        genres: ['User Custom'],
                        rating: 8.0,
                        hue: Math.floor(Math.random() * 360),
                        overview: `Custom ${mediaType.slice(0, -1)} added directly to your vault.`,
                        seasons: mediaType === 'movies' ? '' : '1 Season • Ongoing',
                        poster: null,
                      })
                    }
                  >
                    + CREATE & ADD "{searchQuery.toUpperCase()}" →
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* 4. SELECTED MEDIA PREVIEW */}
      {selectedMedia ? (
        <section className="add-selected-panel">
          <div className="selected-panel-banner">
            <div className="selected-status-tag bg">★ TARGET LOCKED ★</div>
            <div className="selected-file-id bg">
              {selectedMedia.tmdb_id ? `TMDB ID: #${selectedMedia.tmdb_id}` : 'CUSTOM ENTRY'}
            </div>
            <button
              type="button"
              className="selected-change-btn bg"
              onClick={handleClearSelection}
              title="Deselect target"
            >
              CHANGE TARGET ✕
            </button>
          </div>

          <div className="selected-panel-inner">
            {/* POSTER COLUMN */}
            <div className="selected-poster-column">
              <div className="selected-poster-card" style={{ '--h': selectedMedia.hue }}>
                {selectedMedia.poster ? (
                  <img
                    src={selectedMedia.poster}
                    alt={selectedMedia.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                  />
                ) : null}
                <div className="poster-comic-texture">
                  <div className="poster-ben-day-dots"></div>
                  {!selectedMedia.poster && (
                    <div className="poster-title-stamp bg">{selectedMedia.title}</div>
                  )}
                  {shouldAskRating && (
                    <div className="poster-rating-stamp bg">★ {rating}</div>
                  )}
                  {selectedMedia.tagline && (
                    <div className="poster-quote-balloon bg">"{selectedMedia.tagline}"</div>
                  )}
                </div>
                <div className="poster-ink-outline"></div>
              </div>
            </div>

            {/* DETAILS COLUMN */}
            <div className="selected-details-column">
              <div className="selected-header-row">
                <h2 className="selected-title bg">{selectedMedia.title}</h2>
                <span className="selected-year-badge bg">{selectedMedia.year}</span>
              </div>

              <div className="selected-meta-chips">
                <span className={`selected-type-chip bg chip-${selectedMedia.type}`}>
                  {selectedMedia.typeLabel.toUpperCase()}
                </span>
                {selectedMedia.genres &&
                  selectedMedia.genres.map((g) => (
                    <span key={g} className="selected-genre-chip bg">
                      {g}
                    </span>
                  ))}
                {selectedMedia.duration && (
                  <span className="selected-spec-chip bg">{selectedMedia.duration}</span>
                )}
              </div>

              {/* SERIES / ANIME SEASON INFO */}
              {(selectedMedia.type === 'anime' || selectedMedia.type === 'series') && selectedMedia.seasons && (
                <div className="selected-season-panel">
                  <div className="season-icon bg">EP</div>
                  <div className="season-text">
                    <strong className="season-heading bg">ARCHIVE STRUCTURE:</strong>
                    <span className="season-detail">{selectedMedia.seasons}</span>
                  </div>
                </div>
              )}

              {/* SYNOPSIS */}
              <div className="selected-overview-box">
                <div className="overview-corner-tab bg">SYNOPSIS // TMDB DOSSIER</div>
                <p className="overview-text">
                  {loadingDetails ? 'Fetching complete synopsis...' : selectedMedia.overview}
                </p>
              </div>

              {/* 5. STATUS SELECTOR */}
              <div className="add-status-section">
                <div className="status-header-row">
                  <h3 className="status-section-title bg">SET STATUS</h3>
                  <span className="status-current-badge bg">SELECTED: {status.toUpperCase()}</span>
                </div>

                <div className="status-button-group">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`status-comic-btn bg ${status === opt ? 'active-status' : ''}`}
                      onClick={() => setStatus(opt)}
                    >
                      <span className="status-bullet">◆</span> {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. YOUR RATING SECTION */}
              {/* CRITICAL RULE: When adding to Watchlist (or Watching/Dropped), DO NOT ask for rating! */}
              {/* ONLY when completing ('Watched' or 'Completed') do we prompt for user rating! */}
              {shouldAskRating ? (
                <div className="add-rating-section">
                  <div className="rating-header-row">
                    <h3 className="rating-section-title bg">YOUR RATING</h3>
                    <div className="prominent-rating-display bg">
                      <span className="rating-score-num">{rating}</span>
                      <span className="rating-score-max">/ 10</span>
                      <span className="rating-score-star">★</span>
                    </div>
                  </div>

                  <p className="rating-instruction">
                    STAMP YOUR PERSONAL VERDICT INTO THE TITANVAULT LOG:
                  </p>

                  {/* 1 - 10 BUTTONS (TWO ROWS: 1-5, 6-10) */}
                  <div className="rating-button-grid">
                    <div className="rating-row">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`rating-comic-btn bg ${rating === num ? 'active-rating' : ''}`}
                          onClick={() => setRating(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="rating-row">
                      {[6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`rating-comic-btn bg ${rating === num ? 'active-rating' : ''}`}
                          onClick={() => setRating(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: '#101018',
                    border: '2px dashed #444',
                    padding: '12px 16px',
                    color: 'var(--cream)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ color: 'var(--yel)', fontSize: '20px' }}>★</span>
                  <span style={{ fontSize: '13px' }}>
                    <strong>NO RATING REQUIRED:</strong> Titles added to{' '}
                    <strong style={{ color: 'var(--yel)' }}>{status.toUpperCase()}</strong> remain unrated until you complete them.
                  </span>
                </div>
              )}

              {/* 7. ADD BUTTON */}
              <div className="add-action-section">
                <button
                  type="button"
                  className="add-to-vault-action-btn bg"
                  onClick={handleAddToVault}
                >
                  <span className="btn-lightning">⚡</span>
                  ADD TO VAULT →
                  <span className="btn-lightning">⚡</span>
                </button>

                {/* SUCCESS NOTIFICATION BURST */}
                {addedNotice && (
                  <div className="comic-success-toast">
                    <div className="toast-sfx bg">BOOM!</div>
                    <div className="toast-body">
                      <strong className="toast-title bg">
                        {isCloudSaved ? '★ SAVED TO SUPABASE CLOUD VAULT! ★' : '★ SAVED TO LOCAL VAULT! ★'}
                      </strong>
                      <span className="toast-desc">
                        "{selectedMedia.title}" locked in as {status.toUpperCase()}
                        {shouldAskRating ? ` with rating ${rating}/10!` : ' (unrated watchlist)!'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* 8. EMPTY STATE */
        <section className="add-empty-state-panel">
          <div className="empty-radar-graphic">
            <div className="radar-circle circle-1"></div>
            <div className="radar-circle circle-2"></div>
            <div className="radar-crosshair"></div>
            <span className="radar-vault-icon bg">⌕</span>
          </div>

          <h2 className="empty-title bg">SEARCH THE VAULT</h2>
          <p className="empty-subtitle">Type any movie, anime, or series to fetch real TMDB data.</p>
        </section>
      )}
    </div>
  );
};
