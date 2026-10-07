import React, { useMemo } from 'react';
import { MediaGridPage } from '../components/MediaGridPage';
import { useVault } from '../context/VaultContext';
import { PAGES_CONFIG } from '../data/mediaData';

export const Watchlist = () => {
  const { vaultEntries } = useVault();

  const items = useMemo(() => {
    return vaultEntries
      .filter((entry) => entry.status === 'Watchlist')
      .map((entry) => ({
        t: entry.title,
        y: entry.year || 2024,
        r: entry.rating,
        g: Array.isArray(entry.genres) && entry.genres.length > 0 ? entry.genres[0] : 'All',
        genres: entry.genres || [],
        overview: entry.overview || '',
        status: entry.status || 'Watchlist',
        type: entry.media_type || entry.type || 'movies',
        h: entry.poster_hue ?? entry.hue ?? 0,
        poster: entry.poster_url || entry.poster || null,
      }));
  }, [vaultEntries]);

  return <MediaGridPage pageKey="watchlist" config={PAGES_CONFIG.watchlist} items={items} />;
};
