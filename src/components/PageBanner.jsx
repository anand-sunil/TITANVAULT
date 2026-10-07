import React from 'react';

export const PageBanner = ({ type, title, tag, h, isWatchlist }) => {
  return (
    <div className={`panel banner ${type}`} style={{ '--h': h }}>
      <h1 className={`bg ${isWatchlist ? 'w' : ''}`}>{title}</h1>
      <span className="tag">{tag}</span>
      <button className="arrow" aria-label="Explore section">›</button>
    </div>
  );
};
