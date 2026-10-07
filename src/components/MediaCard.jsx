import React from 'react';
import { useVault } from '../context/VaultContext';

export const MediaCard = ({ item }) => {
  const { isFavorite, toggleFavorite } = useVault();
  const fav = isFavorite(item.t);

  return (
    <div className="card" style={{ '--h': item.h }}>
      <div className="poster">
        <span className="pt">{item.t}</span>
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
        <span className="rt">★ {item.r}</span>
        <strong>{item.t}</strong>
        <small>{item.y}</small>
      </div>
    </div>
  );
};
