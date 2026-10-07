import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVault } from '../context/VaultContext';

const MOCK_MEDIA_DATABASE = [
  // Movies
  {
    id: 'm1',
    title: 'Interstellar',
    year: 2014,
    type: 'movies',
    typeLabel: 'Movie',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 9.8,
    hue: 200,
    overview:
      'When Earth becomes increasingly uninhabitable, former NASA pilot Joseph Cooper is tasked with traveling through a mysterious wormhole near Saturn to find humanity a new home amongst the stars.',
    quote: 'DO NOT GO GENTLE INTO THAT GOOD NIGHT.',
    duration: '2h 49m',
    director: 'Christopher Nolan'
  },
  {
    id: 'm2',
    title: 'Inception',
    year: 2010,
    type: 'movies',
    typeLabel: 'Movie',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    rating: 8.8,
    hue: 205,
    overview:
      'Dom Cobb is a skilled thief who extracts corporate secrets from within the subconscious during the dream state. Given one last job to plant an idea into a CEO’s mind, he faces dangerous subconscious demons.',
    quote: 'AN IDEA IS LIKE A VIRUS.',
    duration: '2h 28m',
    director: 'Christopher Nolan'
  },
  {
    id: 'm3',
    title: 'Dune: Part Two',
    year: 2024,
    type: 'movies',
    typeLabel: 'Movie',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    rating: 9.2,
    hue: 35,
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the universe.',
    quote: 'LONG LIVE THE FIGHTERS!',
    duration: '2h 46m',
    director: 'Denis Villeneuve'
  },
  {
    id: 'm4',
    title: 'The Dark Knight',
    year: 2008,
    type: 'movies',
    typeLabel: 'Movie',
    genres: ['Action', 'Crime', 'Drama'],
    rating: 9.0,
    hue: 215,
    overview:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    quote: 'WHY SO SERIOUS?',
    duration: '2h 32m',
    director: 'Christopher Nolan'
  },
  {
    id: 'm5',
    title: 'Oppenheimer',
    year: 2023,
    type: 'movies',
    typeLabel: 'Movie',
    genres: ['Drama', 'History', 'Biography'],
    rating: 8.8,
    hue: 18,
    overview:
      'The story of J. Robert Oppenheimer’s role in the Manhattan Project, developing the world’s first nuclear weapons, and the agonizing political fallout that followed.',
    quote: 'NOW I AM BECOME DEATH.',
    duration: '3h 00m',
    director: 'Christopher Nolan'
  },
  {
    id: 'm6',
    title: 'Blade Runner 2049',
    year: 2017,
    type: 'movies',
    typeLabel: 'Movie',
    genres: ['Sci-Fi', 'Mystery', 'Action'],
    rating: 9.0,
    hue: 185,
    overview:
      'Young Blade Runner K unearths a long-buried secret that leads him to track down former Blade Runner Rick Deckard, who has been missing for thirty years.',
    quote: 'TEARS IN RAIN.',
    duration: '2h 44m',
    director: 'Denis Villeneuve'
  },

  // Anime
  {
    id: 'a1',
    title: 'Solo Leveling',
    year: 2024,
    type: 'anime',
    typeLabel: 'Anime',
    genres: ['Action', 'Fantasy', 'Adventure'],
    rating: 9.1,
    hue: 225,
    seasons: '1 Season • 12 Episodes',
    statusTag: 'S01 COMPLETED',
    overview:
      'In a world where hunters battle deadly monsters, Sung Jinwoo, notoriously known as the weakest hunter of all mankind, is slaughtered in a double dungeon and awakens with the solitary power to level up.',
    quote: 'ARISE.',
    studio: 'A-1 Pictures'
  },
  {
    id: 'a2',
    title: 'Frieren',
    year: 2023,
    type: 'anime',
    typeLabel: 'Anime',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    rating: 9.6,
    hue: 280,
    seasons: '1 Season • 28 Episodes',
    statusTag: 'SEASON 1 ARCHIVED',
    overview:
      'An elf mage and her fellow adventurers defeat the Demon King. But for an elf with centuries to live, the real journey begins as she sets out to understand human emotions and memories.',
    quote: 'IT WOULD BE EMBARRASSING IF THEY SAW ME CRY.',
    studio: 'Madhouse'
  },
  {
    id: 'a3',
    title: 'Attack on Titan',
    year: 2013,
    type: 'anime',
    typeLabel: 'Anime',
    genres: ['Action', 'Mystery', 'Dark Fantasy'],
    rating: 9.0,
    hue: 30,
    seasons: '4 Seasons • 89 Episodes',
    statusTag: 'COMPLETED SERIES',
    overview:
      'After gigantic humanoid Titans breach Wall Maria and destroy his hometown, young Eren Jaeger swears vengeance against every Titan roaming beyond the walls.',
    quote: 'SHINZOU WO SASAGEYO!',
    studio: 'WIT Studio / MAPPA'
  },
  {
    id: 'a4',
    title: 'Jujutsu Kaisen',
    year: 2020,
    type: 'anime',
    typeLabel: 'Anime',
    genres: ['Action', 'Supernatural', 'Fantasy'],
    rating: 8.7,
    hue: 250,
    seasons: '2 Seasons • 47 Episodes',
    statusTag: 'SHIBUYA INCIDENT LOGGED',
    overview:
      'Yuji Itadori swallows a cursed finger belonging to Ryomen Sukuna, the King of Curses, entering a secret society of Jujutsu sorcerers to locate the remaining fragments.',
    quote: 'THROUGHOUT HEAVEN AND EARTH, I ALONE AM THE HONORED ONE.',
    studio: 'MAPPA'
  },
  {
    id: 'a5',
    title: 'One Piece',
    year: 1999,
    type: 'anime',
    typeLabel: 'Anime',
    genres: ['Action', 'Adventure', 'Fantasy'],
    rating: 8.8,
    hue: 50,
    seasons: '21 Sagas • 1100+ Episodes',
    statusTag: 'EGGHEAD ARC ONGOING',
    overview:
      'Monkey D. Luffy, a boy whose body gained the properties of rubber after eating a Devil Fruit, sets out to conquer the Grand Line and claim the legendary One Piece.',
    quote: 'I WILL BE KING OF THE PIRATES!',
    studio: 'Toei Animation'
  },
  {
    id: 'a6',
    title: 'Cyberpunk: Edgerunners',
    year: 2022,
    type: 'anime',
    typeLabel: 'Anime',
    genres: ['Action', 'Sci-Fi', 'Cyberpunk'],
    rating: 8.8,
    hue: 75,
    seasons: '1 Season • 10 Episodes',
    statusTag: 'MINISERIES COMPLETED',
    overview:
      'In a neon-drenched dystopia overwhelmed by corruption and cybernetic modifications, street kid David Martinez loses everything and fights to survive as a high-tech edgerunner.',
    quote: 'I GUESS I AM SPECIAL AFTER ALL.',
    studio: 'Studio Trigger'
  },

  // Series
  {
    id: 's1',
    title: 'Breaking Bad',
    year: 2008,
    type: 'series',
    typeLabel: 'Series',
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: 9.5,
    hue: 55,
    seasons: '5 Seasons • 62 Episodes',
    statusTag: 'ALL 5 SEASONS COMPLETE',
    overview:
      'A diagnosed high school chemistry teacher turns to manufacturing premium methamphetamine with a former student to secure his family’s financial future, spiraling into ruthless criminality.',
    quote: 'I AM THE ONE WHO KNOCKS.',
    network: 'AMC'
  },
  {
    id: 's2',
    title: 'The Last of Us',
    year: 2023,
    type: 'series',
    typeLabel: 'Series',
    genres: ['Drama', 'Sci-Fi', 'Survival'],
    rating: 9.2,
    hue: 30,
    seasons: '1 Season • 9 Episodes',
    statusTag: 'SEASON 1 ARCHIVED',
    overview:
      'Twenty years after a parasitic fungal outbreak collapses civilization, hardened smuggler Joel is hired to escort 14-year-old Ellie across a brutal, infected United States.',
    quote: 'ENDURE AND SURVIVE.',
    network: 'HBO'
  },
  {
    id: 's3',
    title: 'Stranger Things',
    year: 2016,
    type: 'series',
    typeLabel: 'Series',
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    rating: 8.7,
    hue: 350,
    seasons: '4 Seasons • 34 Episodes',
    statusTag: 'SEASON 4 ARCHIVED',
    overview:
      'When a young boy vanishes from a small Indiana town, his friends uncover secret government experiments, a portal to the terrifying Upside Down, and a telekinetic girl.',
    quote: 'FRIENDS DON\'T LIE.',
    network: 'Netflix'
  },
  {
    id: 's4',
    title: 'Shōgun',
    year: 2024,
    type: 'series',
    typeLabel: 'Series',
    genres: ['Drama', 'History', 'War'],
    rating: 9.1,
    hue: 20,
    seasons: '1 Season • 10 Episodes',
    statusTag: 'SEASON 1 COMPLETE',
    overview:
      'In feudal Japan at the dawn of a century-defining civil war, Lord Yoshii Toranaga navigates lethal political intrigue, aided by a shipwrecked English pilot who brings pivotal artillery.',
    quote: 'FATE HAS BROUGHT US TOGETHER.',
    network: 'FX / Hulu'
  },
  {
    id: 's5',
    title: 'Chernobyl',
    year: 2019,
    type: 'series',
    typeLabel: 'Series',
    genres: ['Drama', 'History', 'Thriller'],
    rating: 9.4,
    hue: 120,
    seasons: 'Miniseries • 5 Episodes',
    statusTag: 'LIMITED SERIES COMPLETE',
    overview:
      'The harrowing true story of the April 1986 catastrophic nuclear power plant explosion in Soviet Ukraine and the brave scientists and firefighters who sacrificed everything to contain the disaster.',
    quote: 'WHAT IS THE COST OF LIES?',
    network: 'HBO'
  },
  {
    id: 's6',
    title: 'The Boys',
    year: 2019,
    type: 'series',
    typeLabel: 'Series',
    genres: ['Action', 'Sci-Fi', 'Satire'],
    rating: 8.7,
    hue: 0,
    seasons: '4 Seasons • 32 Episodes',
    statusTag: 'SEASON 4 COMPLETE',
    overview:
      'A band of gritty vigilantes set out to violently expose the corrupt superhero group known as The Seven and the multi-billion-dollar conglomerate Vought that covers up their atrocities.',
    quote: 'DIABOLICAL.',
    network: 'Prime Video'
  }
];

export const AddToVault = () => {
  // 1. Media Type Selector State: 'movies' | 'anime' | 'series'
  const [mediaType, setMediaType] = useState('movies');

  // 2. Search & Suggestion State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 3. Selected Media Preview State (Initially null to show Search the Vault empty state)
  const [selectedMedia, setSelectedMedia] = useState(null);

  // 4. Rating State (1 to 10)
  const [rating, setRating] = useState(8);

  // 5. Status State
  const [status, setStatus] = useState('Watched');

  // 6. Action Feedback State
  const [addedNotice, setAddedNotice] = useState(false);
  const [isCloudSaved, setIsCloudSaved] = useState(false);
  const dropdownRef = useRef(null);

  const { addVaultEntry } = useVault();

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

  // Filter mock suggestions based on query and selected media type
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let pool = MOCK_MEDIA_DATABASE;

    // Filter by tab if not searching all or prioritize tab
    if (!q) {
      return pool.filter((item) => item.type === mediaType);
    }

    return pool.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchGenre = item.genres.some((g) => g.toLowerCase().includes(q));
      const matchType = item.typeLabel.toLowerCase().includes(q);
      return matchTitle || matchGenre || matchType;
    });
  }, [searchQuery, mediaType]);

  const handleSelectMedia = (item) => {
    setSelectedMedia(item);
    setMediaType(item.type);
    setSearchQuery(item.title);
    setIsSearchFocused(false);
    // Preset appropriate status for type
    if (item.type === 'movies') {
      setStatus('Watched');
    } else {
      setStatus('Completed');
    }
  };

  const handleClearSelection = () => {
    setSelectedMedia(null);
    setSearchQuery('');
  };

  const handleTabChange = (type) => {
    setMediaType(type);
    // If search query is empty, allow browsing
  };

  const handleAddToVault = async () => {
    if (!selectedMedia) return;
    try {
      const res = await addVaultEntry({
        title: selectedMedia.title,
        media_type: selectedMedia.type,
        status: status,
        rating: rating,
        year: selectedMedia.year,
        genres: selectedMedia.genres,
        overview: selectedMedia.overview,
        seasons: selectedMedia.seasons || '',
        poster_hue: selectedMedia.hue || 0,
      });
      setIsCloudSaved(Boolean(res?.cloud));
    } catch (err) {
      console.warn('Vault save error:', err);
      setIsCloudSaved(false);
    }
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 4000);
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
        <div className="add-header-burst bg">INTAKE DEPT.</div>
        <div className="add-header-content">
          <h1 className="add-vault-title bg">ADD TO VAULT</h1>
          <p className="add-vault-subtitle">Find it. Rate it. Lock it in.</p>
        </div>
        <div className="add-header-stamp bg">CLASSIFIED // ARCHIVE #99</div>
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

      {/* 3. SEARCH INPUT WITH SUGGESTIONS */}
      <section className="add-search-section" ref={dropdownRef}>
        <div className="comic-section-bar">
          <span className="comic-section-label bg">STEP 02: TARGET IDENTIFICATION</span>
          <span className="comic-badge-counter bg">{suggestions.length} MATCHES</span>
        </div>

        <div className="add-search-box-wrapper">
          <div className="add-search-input-box">
            <span className="add-search-icon" aria-hidden="true">⌕</span>
            <input
              type="text"
              className="add-search-input"
              placeholder="Search for a movie, anime or series..."
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
                  setIsSearchFocused(true);
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* SUGGESTION DROPDOWN */}
          {isSearchFocused && (
            <div className="add-suggestions-dropdown">
              <div className="dropdown-comic-header bg">
                <span>SUGGESTED TARGETS ({suggestions.length})</span>
                <span className="dropdown-tip">CLICK TO SELECT</span>
              </div>

              {suggestions.length > 0 ? (
                <div className="suggestions-list">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className={`suggestion-item ${selectedMedia?.id === item.id ? 'is-selected' : ''}`}
                      onClick={() => handleSelectMedia(item)}
                    >
                      <div className="suggestion-poster-wrap" style={{ '--h': item.hue }}>
                        <div className="suggestion-mini-poster">
                          <span className="smp-title bg">{item.title.substring(0, 3)}</span>
                        </div>
                      </div>

                      <div className="suggestion-info">
                        <div className="suggestion-title-row">
                          <strong className="suggestion-title">{item.title}</strong>
                          <span className="suggestion-year bg">{item.year}</span>
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
              ) : (
                <div className="dropdown-no-results">
                  <span className="no-res-sfx bg">NEW ENTRY!</span>
                  <p>NOT IN ARCHIVES. ADD AS CUSTOM {mediaType.toUpperCase()}?</p>
                  <button
                    type="button"
                    className="btn bg"
                    style={{ marginTop: '10px', fontSize: '18px', padding: '4px 18px', display: 'inline-block' }}
                    onClick={() =>
                      handleSelectMedia({
                        id: 'custom_' + Date.now(),
                        title: searchQuery,
                        year: new Date().getFullYear(),
                        type: mediaType,
                        typeLabel: mediaType === 'movies' ? 'Movie' : mediaType === 'anime' ? 'Anime' : 'Series',
                        genres: ['User Vault'],
                        rating: 8.0,
                        hue: Math.floor(Math.random() * 360),
                        overview: `Custom ${mediaType.slice(0, -1)} added directly to your personal vault.`,
                        seasons: mediaType === 'movies' ? '' : '1 Season • Ongoing',
                      })
                    }
                  >
                    + CREATE & RATE "{searchQuery.toUpperCase()}" →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. SELECTED MEDIA PREVIEW OR 8. EMPTY STATE */}
      {selectedMedia ? (
        <section className="add-selected-panel">
          <div className="selected-panel-banner">
            <div className="selected-status-tag bg">★ TARGET ACQUIRED ★</div>
            <div className="selected-file-id bg">ENTRY ID: #{selectedMedia.id.toUpperCase()}</div>
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
                <div className="poster-comic-texture">
                  <div className="poster-ben-day-dots"></div>
                  <div className="poster-title-stamp bg">{selectedMedia.title}</div>
                  <div className="poster-rating-stamp bg">★ {selectedMedia.rating}</div>
                  {selectedMedia.quote && (
                    <div className="poster-quote-balloon bg">
                      "{selectedMedia.quote}"
                    </div>
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
                {selectedMedia.genres.map((g) => (
                  <span key={g} className="selected-genre-chip bg">
                    {g}
                  </span>
                ))}
                {selectedMedia.duration && (
                  <span className="selected-spec-chip bg">{selectedMedia.duration}</span>
                )}
                {selectedMedia.director && (
                  <span className="selected-spec-chip bg">DIR: {selectedMedia.director}</span>
                )}
                {selectedMedia.studio && (
                  <span className="selected-spec-chip bg">STUDIO: {selectedMedia.studio}</span>
                )}
                {selectedMedia.network && (
                  <span className="selected-spec-chip bg">NETWORK: {selectedMedia.network}</span>
                )}
              </div>

              {/* SERIES / ANIME SPECIFIC INFORMATION */}
              {(selectedMedia.type === 'anime' || selectedMedia.type === 'series') && selectedMedia.seasons && (
                <div className="selected-season-panel">
                  <div className="season-icon bg">EP</div>
                  <div className="season-text">
                    <strong className="season-heading bg">ARCHIVE STRUCTURE:</strong>
                    <span className="season-detail">{selectedMedia.seasons}</span>
                  </div>
                  {selectedMedia.statusTag && (
                    <span className="season-tag bg">{selectedMedia.statusTag}</span>
                  )}
                </div>
              )}

              {/* OVERVIEW IN COMIC DIALOGUE BOX */}
              <div className="selected-overview-box">
                <div className="overview-corner-tab bg">SYNOPSIS // DOSSIER</div>
                <p className="overview-text">{selectedMedia.overview}</p>
              </div>

              {/* 5. YOUR RATING SECTION */}
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
                  STAMP YOUR VERDICT INTO THE TITANVAULT LOG:
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

              {/* 6. STATUS SELECTOR */}
              <div className="add-status-section">
                <div className="status-header-row">
                  <h3 className="status-section-title bg">VAULT STATUS</h3>
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

              {/* 7. LARGE ADD BUTTON */}
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
                        {isCloudSaved ? '★ STORED IN SUPABASE CLOUD VAULT! ★' : '★ SAVED TO LOCAL VAULT! ★'}
                      </strong>
                      <span className="toast-desc">
                        "{selectedMedia.title}" locked in as {status.toUpperCase()} with rating {rating}/10!
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
          <p className="empty-subtitle">Choose something to add to your collection.</p>

          <div className="empty-quick-picks">
            <span className="empty-quick-title bg">QUICK SUGGESTIONS TO TRY:</span>
            <div className="empty-chips-row">
              {MOCK_MEDIA_DATABASE.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="empty-pick-chip bg"
                  onClick={() => handleSelectMedia(item)}
                >
                  + {item.title} ({item.typeLabel})
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
