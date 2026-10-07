import React, { useMemo } from 'react';
import { MediaGridPage } from '../components/MediaGridPage';
import { useVault } from '../context/VaultContext';
import { PAGES_CONFIG } from '../data/mediaData';

export const Movies = () => {
  const { vaultEntries } = useVault();
  const items = useMemo(() => {
    return vaultEntries
      .filter((entry) => entry.media_type === 'movies' || entry.type === 'movies')
      .map((entry) => ({
        t: entry.title,
        y: entry.year || 2024,
        r: entry.rating,
        g: Array.isArray(entry.genres) && entry.genres.length > 0 ? entry.genres[0] : 'All',
        type: 'movies',
        h: entry.poster_hue ?? entry.hue ?? 0,
        poster: entry.poster_url || entry.poster || null,
      }));
  }, [vaultEntries]);

  return <MediaGridPage pageKey="movies" config={PAGES_CONFIG.movies} items={items} />;
};
