import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryPanel } from './CategoryPanel';
import { useVault } from '../context/VaultContext';

export const HeroSection = () => {
  const { vaultEntries } = useVault();
  const watchingItem = vaultEntries.find((entry) => entry.status === 'Watching');

  return (
    <div className="top">
      <div>
        <span className="tag">
          {watchingItem ? 'CONTINUE WATCHING' : 'TITANVAULT DISPATCH'}
        </span>
        <div className="panel hero">
          {watchingItem ? (
            <>
              <h1 className="bg">{watchingItem.title}</h1>
              <div className="ep">{watchingItem.seasons || 'In Progress'}</div>
              <div className="bar" style={{ width: '260px' }}>
                <i style={{ width: '65%' }}></i>
              </div>
              <div style={{ marginTop: '10px', display: 'flex' }}>
                <button className="btn">RESUME</button>
                <Link to="/add" className="plus" aria-label="Add or change media" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                  +
                </Link>
              </div>
              {watchingItem.overview && (
                <div className="quote">
                  "{watchingItem.overview.slice(0, 48)}..."
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="bg">WELCOME TO TITANVAULT</h1>
              <div className="ep">YOUR PERSONAL MEDIA ARCHIVE</div>
              <div className="bar" style={{ width: '260px' }}>
                <i style={{ width: '100%' }}></i>
              </div>
              <div style={{ marginTop: '10px', display: 'flex' }}>
                <Link to="/add" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  + ADD TO VAULT
                </Link>
              </div>
              <div className="quote">FIND IT. RATE IT. LOCK IT IN.</div>
            </>
          )}
        </div>
      </div>

      <div className="cats">
        <CategoryPanel
          category="movies"
          c1="#3a0508"
          c2="#7a0a10"
          c3="#ff2a3a"
          subtitle="DIFFERENT WORLDS. SAME EMOTIONS."
        />
        <CategoryPanel
          category="anime"
          c1="#1a0838"
          c2="#4b1a92"
          c3="#b36bff"
          subtitle="MORE THAN JUST AN ANIME."
        />
        <CategoryPanel
          category="series"
          c1="#06143a"
          c2="#0f3a8a"
          c3="#2f86ff"
          subtitle="EPISODES THAT STAY WITH YOU."
        />
      </div>
    </div>
  );
};
