import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { CurrentlyWatching } from '../components/CurrentlyWatching';
import { MediaCard } from '../components/MediaCard';
import { useVault } from '../context/VaultContext';

export const Home = () => {
  const rowRef = useRef(null);
  const { vaultEntries } = useVault();

  useEffect(() => {
    document.body.classList.add('home');
    return () => {
      document.body.classList.remove('home');
    };
  }, []);

  const handleScrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const recentlyWatched = useMemo(() => {
    return vaultEntries
      .filter((entry) => entry.status === 'Watched' || entry.status === 'Completed')
      .map((entry) => ({
        t: entry.title,
        y: entry.year || 2024,
        r: entry.rating || 8.0,
        g: Array.isArray(entry.genres) && entry.genres.length > 0 ? entry.genres[0] : 'All',
        type: entry.media_type,
        h: entry.poster_hue ?? 0,
        poster: entry.poster_url || entry.poster || null,
      }));
  }, [vaultEntries]);

  return (
    <>
      <HeroSection />

      <span className="tag">RECENTLY WATCHED</span>
      <div className="row" ref={rowRef}>
        {recentlyWatched.length > 0 ? (
          <>
            {recentlyWatched.map((item) => (
              <MediaCard key={item.t} item={item} />
            ))}
            <button
              type="button"
              className="arrow"
              onClick={handleScrollRight}
              aria-label="Scroll right"
            >
              ›
            </button>
          </>
        ) : (
          <div style={{ padding: '16px 20px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>No watched titles logged yet.</span>
            <Link to="/add" className="btn" style={{ fontSize: '15px', padding: '2px 14px', textDecoration: 'none' }}>
              + ADD A TITLE
            </Link>
          </div>
        )}
      </div>

      <CurrentlyWatching />
    </>
  );
};
