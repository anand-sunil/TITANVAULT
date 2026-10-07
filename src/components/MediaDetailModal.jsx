import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';

export const MediaDetailModal = ({ item, onClose }) => {
  const { updateVaultEntry, deleteVaultEntry, isFavorite, toggleFavorite } = useVault();
  const [currentStatus, setCurrentStatus] = useState(item.status || 'Watched');
  const [currentRating, setCurrentRating] = useState(item.r || 8);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!item) return null;

  const fav = isFavorite(item.t);
  const posterUrl = item.poster || item.poster_url;
  const isMovie = item.type === 'movies';

  // Status options
  const statusOptions = isMovie
    ? ['Watched', 'Watchlist']
    : ['Completed', 'Watching', 'Watchlist', 'Dropped'];

  const shouldAskRating = isMovie
    ? currentStatus === 'Watched'
    : currentStatus === 'Completed';

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateVaultEntry(item.t, item.type, {
        status: currentStatus,
        rating: shouldAskRating ? Number(currentRating) : null,
      });
      setSavedNotice(true);
      setTimeout(() => {
        setSavedNotice(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${item.t}" from your vault?`)) {
      await deleteVaultEntry(item.t, item.type);
      onClose();
    }
  };

  return (
    <div className="comic-modal-overlay" onClick={onClose}>
      <div className="comic-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="comic-modal-header">
          <div className="cm-tag bg">VAULT DOSSIER // #{item.type?.toUpperCase()}</div>
          <button type="button" className="cm-close-btn bg" onClick={onClose} aria-label="Close dossier">
            ✕ CLOSE
          </button>
        </div>

        <div className="comic-modal-body">
          {/* POSTER SECTION */}
          <div className="cm-poster-col">
            <div className="cm-poster-frame">
              {posterUrl ? (
                <img src={posterUrl} alt={item.t} className="cm-poster-img" />
              ) : (
                <div className="cm-poster-placeholder bg">{item.t}</div>
              )}
              <div className="cm-poster-halftone"></div>
            </div>

            <button
              type="button"
              className={`cm-fav-btn bg ${fav ? 'fav-on' : ''}`}
              onClick={() => toggleFavorite(item.t)}
            >
              ♥ {fav ? 'IN FAVORITES' : 'ADD TO FAVORITES'}
            </button>
          </div>

          {/* INFO & ACTIONS SECTION */}
          <div className="cm-info-col">
            <div className="cm-title-row">
              <h2 className="cm-title bg">{item.t}</h2>
              <span className="cm-year bg">{item.y}</span>
            </div>

            {/* GENRES */}
            <div className="cm-chips-row">
              <span className={`cm-type-chip bg type-${item.type}`}>
                {item.type === 'movies' ? 'MOVIE' : item.type === 'anime' ? 'ANIME' : 'SERIES'}
              </span>
              {Array.isArray(item.genres) && item.genres.length > 0 ? (
                item.genres.map((g) => (
                  <span key={g} className="cm-genre-chip bg">
                    {g}
                  </span>
                ))
              ) : item.g && item.g !== 'All' ? (
                <span className="cm-genre-chip bg">{item.g}</span>
              ) : null}
            </div>

            {/* OVERVIEW / SYNOPSIS */}
            <div className="cm-overview-box">
              <span className="cm-overview-tag bg">ARCHIVE SYNOPSIS</span>
              <p className="cm-overview-text">
                {item.overview || 'No synopsis recorded for this title.'}
              </p>
            </div>

            {/* STATUS SELECTOR */}
            <div className="cm-status-section">
              <span className="cm-section-label bg">VAULT LOG STATUS:</span>
              <div className="cm-status-options">
                {statusOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`cm-status-btn bg ${currentStatus === st ? 'active' : ''}`}
                    onClick={() => setCurrentStatus(st)}
                  >
                    {currentStatus === st ? '◆ ' : ''}{st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* RATING SELECTOR (IF COMPLETED/WATCHED) */}
            {shouldAskRating && (
              <div className="cm-rating-section">
                <div className="cm-rating-header">
                  <span className="cm-section-label bg">TITAN RATING:</span>
                  <span className="cm-rating-score bg">★ {currentRating} / 10</span>
                </div>
                <div className="cm-rating-buttons">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`cm-rate-btn bg ${Number(currentRating) === num ? 'active' : ''}`}
                      onClick={() => setCurrentRating(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATION */}
            {savedNotice && (
              <div className="cm-save-toast bg">
                ✓ VAULT LOG UPDATED SUCCESSFULLY!
              </div>
            )}

            {/* MODAL FOOTER CONTROLS */}
            <div className="cm-footer-actions">
              <button
                type="button"
                className="btn bg cm-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'UPDATING...' : 'SAVE CHANGES →'}
              </button>
              <button
                type="button"
                className="cm-delete-btn bg"
                onClick={handleDelete}
              >
                ✕ REMOVE FROM VAULT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
