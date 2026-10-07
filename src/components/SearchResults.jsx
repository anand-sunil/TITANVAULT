import React from 'react';
import { Link } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { MediaCard } from './MediaCard';

export const SearchResults = () => {
  const { searchQuery, vaultEntries } = useVault();
  const query = searchQuery.trim().toLowerCase();

  const results = vaultEntries
    .filter((entry) =>
      entry.title.toLowerCase().includes(query) ||
      (Array.isArray(entry.genres) && entry.genres.some((g) => g.toLowerCase().includes(query)))
    )
    .map((entry) => ({
      t: entry.title,
      y: entry.year || 2024,
      r: entry.rating || 8.0,
      g: Array.isArray(entry.genres) && entry.genres.length > 0 ? entry.genres[0] : 'All',
      type: entry.media_type || entry.type || 'movies',
      h: entry.poster_hue ?? entry.hue ?? 0,
    }));

  return (
    <div>
      <div className="tools">
        <span className="tag" style={{ margin: 0 }}>
          SEARCH RESULTS
        </span>
      </div>
      <div className="grid">
        {results.length > 0 ? (
          results.map((item) => <MediaCard key={item.t} item={item} />)
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '36px 20px', textAlign: 'center', background: '#0b0b12', border: '2px dashed var(--cream)' }}>
            <h3 className="bg" style={{ color: 'var(--yel)', fontSize: '26px', marginBottom: '8px' }}>
              NO MATCHES IN YOUR VAULT
            </h3>
            <p style={{ color: '#bbb', fontSize: '15px', marginBottom: '16px' }}>
              No items matching "{searchQuery}" found in your collection.
            </p>
            <Link to="/add" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
              + SEARCH & ADD TO VAULT
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
