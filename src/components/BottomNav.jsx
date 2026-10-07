import React from 'react';
import { NavLink } from 'react-router-dom';
import { useVault } from '../context/VaultContext';
import { NAV_ITEMS } from '../data/mediaData';
import {
  HomeIcon,
  MoviesIcon,
  AnimeIcon,
  SeriesIcon,
  WatchlistIcon,
  FavoritesIcon,
  AddVaultIcon,
} from './Icons';

const ICON_MAP = {
  home: HomeIcon,
  movies: MoviesIcon,
  anime: AnimeIcon,
  series: SeriesIcon,
  watchlist: WatchlistIcon,
  favorites: FavoritesIcon,
  add: AddVaultIcon,
};

export const BottomNav = () => {
  const { setSearchQuery } = useVault();

  // Bottom nav displays the primary items (home, movies, anime, series, watchlist, favorites)
  return (
    <div className="bottom" id="bn">
      {NAV_ITEMS.map((item) => {
        const IconComponent = ICON_MAP[item.key];
        return (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) => (isActive ? 'on' : '')}
            onClick={() => {
              setSearchQuery('');
              window.scrollTo(0, 0);
            }}
          >
            <span className="bottom-nav-icon">
              {IconComponent ? <IconComponent className="bottom-nav-svg" size={20} /> : item.icon}
            </span>
            {item.label}
          </NavLink>
        );
      })}
    </div>
  );
};
