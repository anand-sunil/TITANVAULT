import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SearchResults } from './components/SearchResults';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { Anime } from './pages/Anime';
import { Series } from './pages/Series';
import { Watchlist } from './pages/Watchlist';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Landing } from './pages/Landing';
import { AddToVault } from './pages/AddToVault';
import { useVault } from './context/VaultContext';

export const App = () => {
  const { searchQuery } = useVault();
  const location = useLocation();

  useEffect(() => {
    // Preserve exact prototype behavior for internal dashboard:
    const isHome = (location.pathname === '/home' || location.pathname === '/vault') && !searchQuery;
    document.body.classList.toggle('home', isHome);

    const isAnime = location.pathname === '/anime' && !searchQuery;
    document.body.classList.toggle('anime', isAnime);

    const isSeries = location.pathname === '/series' && !searchQuery;
    document.body.classList.toggle('series', isSeries);

    const isWatchlist = location.pathname === '/watchlist' && !searchQuery;
    document.body.classList.toggle('watchlist', isWatchlist);

    const isFavorites = location.pathname === '/favorites' && !searchQuery;
    document.body.classList.toggle('favorites', isFavorites);

    const isAdd = location.pathname === '/add' && !searchQuery;
    document.body.classList.toggle('add-vault', isAdd);
  }, [location.pathname, searchQuery]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandingPage = (location.pathname === '/' || location.pathname === '/landing') && !searchQuery;

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <main id="main">
        {searchQuery ? (
          <SearchResults />
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/vault" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/series" element={<Series />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add" element={<AddToVault />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
      <BottomNav />
    </>
  );
};
