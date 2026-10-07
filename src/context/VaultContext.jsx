import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('tvfav');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    return new Set();
  });

  // User vault entries from Supabase
  const [vaultEntries, setVaultEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('tv_vault_entries');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Listen to Supabase Auth state changes
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch vault entries from Supabase when user logs in
  const fetchVaultEntries = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      const { data, error } = await supabase
        .from('vault_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setVaultEntries(data);
        localStorage.setItem('tv_vault_entries', JSON.stringify(data));

        // Sync favorites from database
        const favTitles = data.filter((item) => item.is_favorite).map((item) => item.title);
        if (favTitles.length > 0) {
          setFavorites((prev) => new Set([...prev, ...favTitles]));
        }
      }
    } catch (err) {
      console.error('Error fetching vault entries from Supabase:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVaultEntries();
    }
  }, [user, fetchVaultEntries]);

  // Auth Methods
  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase is not configured yet. Please add your credentials in .env.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, username) => {
    if (!supabase) {
      throw new Error('Supabase is not configured yet. Please add your credentials in .env.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setVaultEntries([]);
  };

  // Add / Update Vault Entry
  const addVaultEntry = async (entry) => {
    const formatted = {
      title: entry.title,
      media_type: entry.media_type || entry.type,
      status: entry.status,
      rating: entry.rating != null ? Number(entry.rating) : null,
      year: entry.year ? Number(entry.year) : null,
      genres: entry.genres || [],
      overview: entry.overview || '',
      seasons: entry.seasons || '',
      poster_hue: entry.poster_hue ?? entry.hue ?? 0,
      poster_url: entry.poster_url || entry.poster || null,
      is_favorite: entry.is_favorite || false,
    };

    // If Supabase is connected and user is authenticated
    if (supabase && user) {
      const payload = {
        ...formatted,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('vault_entries')
        .upsert(payload, { onConflict: 'user_id, title, media_type' })
        .select()
        .single();

      if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
      }

      setVaultEntries((prev) => {
        const filtered = prev.filter(
          (p) => !(p.title === formatted.title && p.media_type === formatted.media_type)
        );
        const updated = [data, ...filtered];
        localStorage.setItem('tv_vault_entries', JSON.stringify(updated));
        return updated;
      });

      return { success: true, cloud: true, data };
    }

    // Local fallback for guest or unconfigured mode
    setVaultEntries((prev) => {
      const filtered = prev.filter(
        (p) => !(p.title === formatted.title && p.media_type === formatted.media_type)
      );
      const localEntry = { ...formatted, id: 'local_' + Date.now(), created_at: new Date().toISOString() };
      const updated = [localEntry, ...filtered];
      localStorage.setItem('tv_vault_entries', JSON.stringify(updated));
      return updated;
    });

    return { success: true, cloud: false };
  };

  // Toggle Favorite
  const toggleFavorite = async (title, mediaType = 'movies') => {
    setFavorites((prev) => {
      const next = new Set(prev);
      const willBeFav = !next.has(title);
      if (willBeFav) {
        next.add(title);
      } else {
        next.delete(title);
      }
      try {
        localStorage.setItem('tvfav', JSON.stringify([...next]));
      } catch (e) {
        console.error(e);
      }

      // Sync with Supabase if logged in
      if (supabase && user) {
        supabase
          .from('vault_entries')
          .update({ is_favorite: willBeFav })
          .match({ user_id: user.id, title })
          .then(({ error }) => {
            if (error) console.warn('Could not sync favorite to Supabase:', error.message);
          });
      }

      return next;
    });
  };

  const isFavorite = (title) => favorites.has(title);

  return (
    <VaultContext.Provider
      value={{
        user,
        session,
        authLoading,
        signIn,
        signUp,
        signOut,
        favorites,
        toggleFavorite,
        isFavorite,
        searchQuery,
        setSearchQuery,
        vaultEntries,
        addVaultEntry,
        fetchVaultEntries,
        isSupabaseReady: isSupabaseConfigured(),
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
