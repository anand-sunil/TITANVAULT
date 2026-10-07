import React from 'react';
import { useVault } from '../context/VaultContext';

export const MediaCard = ({ item, onSelect }) => {
  const { isFavorite, toggleFavorite } = useVault();
  const fav = isFavorite(item.t);
  const posterUrl = item.poster || item.poster_url;

  return (
    <div
      className="card"
      style={{ '--h': item.h, cursor: onSelect ? 'pointer' : 'default' }}
      onClick={() => onSelect && onSelect(item)}
    >
      <div className="poster">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={item.t}
            className="poster-img"
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        ) : (
          <span className="pt">{item.t}</span>
        )}
      </div>
      <button
        type="button"
        className={`heart ${fav ? 'on' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(item.t);
        }}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        ♥
      </button>
      <div className="meta">
        {item.r != null && item.r > 0 ? (
          <span className="rt">★ {item.r}</span>
        ) : (
          <span className="rt" style={{ background: '#333', color: 'var(--cream)', fontSize: '10px' }}>
            UNRATED
          </span>
        )}
        <strong>{item.t}</strong>
        <small>{item.y}</small>
      </div>
    </div>
  );
};
