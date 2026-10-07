import React from 'react';
import { Link } from 'react-router-dom';
import { useVault } from '../context/VaultContext';

export const CurrentlyWatching = () => {
  const { vaultEntries } = useVault();
  const watchingItems = vaultEntries
    .filter((entry) => entry.status === 'Watching')
    .map((entry) => ({
      t: entry.title,
      ep: entry.seasons || 'Episodes in Progress',
      progress: 60,
      h: entry.poster_hue ?? 0,
    }));

  return (
    <>
      <div className="sec">
        <span className="tag">CURRENTLY WATCHING</span>
      </div>
      <div className="wide">
        {watchingItems.length > 0 ? (
          watchingItems.map((item) => (
            <div key={item.t} className="panel" style={{ '--h': item.h }}>
              <h3 className="bg">{item.t}</h3>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>{item.ep}</div>
              <div className="bar" style={{ width: '60%' }}>
                <i style={{ width: `${item.progress}%` }}></i>
              </div>
              <button className="play" aria-label={`Play ${item.t}`}>
                ▶
              </button>
            </div>
          ))
        ) : (
          <div className="panel" style={{ padding: '20px', gridColumn: '1 / -1', background: '#0e0e14' }}>
            <h3 className="bg" style={{ color: 'var(--yel)', fontSize: '20px' }}>NO ACTIVE STREAMS</h3>
            <p style={{ color: '#aaa', fontSize: '14px', margin: '6px 0 12px' }}>
              You don't have any shows marked as "Watching" yet.
            </p>
            <Link to="/add" className="btn" style={{ fontSize: '16px', padding: '4px 16px', textDecoration: 'none', display: 'inline-block' }}>
              + START WATCHING SOMETHING
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
