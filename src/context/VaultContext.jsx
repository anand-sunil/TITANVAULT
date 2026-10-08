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
        // Retrieve local items to retain poster images if Supabase table lacks poster_url column
        const localSaved = (() => {
          try {
            const raw = localStorage.getItem('tv_vault_entries');
            return raw ? JSON.parse(raw) : [];
          } catch {
            return [];
          }
        })();

        const merged = data.map((cloudItem) => {
          if (!cloudItem.poster_url) {
            const match = localSaved.find(
              (l) => l.title === cloudItem.title && (l.media_type === cloudItem.media_type || l.type === cloudItem.media_type)
            );
            if (match && (match.poster_url || match.poster)) {
              return { ...cloudItem, poster_url: match.poster_url || match.poster };
            }
          }
          return cloudItem;
        });

        // Also preserve any locally added entries that may not have synced to cloud yet
        const cloudKeys = new Set(data.map((c) => `${c.title}__${c.media_type}`));
        const localOnly = localSaved.filter((l) => !cloudKeys.has(`${l.title}__${l.media_type || l.type}`));
        const allCombined = [...merged, ...localOnly];

        setVaultEntries(allCombined);
        localStorage.setItem('tv_vault_entries', JSON.stringify(allCombined));

        // Sync localOnly entries to Supabase cloud so they appear on other devices (phone, etc.)
        if (localOnly.length > 0) {
          (async () => {
            for (const item of localOnly) {
              try {
                const syncPayload = {
                  user_id: user.id,
                  title: item.title,
                  media_type: item.media_type || item.type,
                  status: item.status,
                  rating: item.rating != null ? Number(item.rating) : null,
                  year: item.year ? Number(item.year) : null,
                  genres: item.genres || [],
                  overview: item.overview || '',
                  seasons: item.seasons || '',
                  poster_hue: item.poster_hue ?? item.hue ?? 0,
                  poster_url: item.poster_url || item.poster || null,
                  is_favorite: item.is_favorite || false,
                };
                await supabase
                  .from('vault_entries')
                  .upsert(syncPayload, { onConflict: 'user_id,title,media_type' });
              } catch (syncErr) {
                console.warn('Could not auto-sync local entry to Supabase:', item.title, syncErr);
              }
            }
          })();
        }

        // Sync favorites from database
        const favTitles = allCombined.filter((item) => item.is_favorite).map((item) => item.title);
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

    const updateLocalStateAndStorage = (entryToSave) => {
      setVaultEntries((prev) => {
        const filtered = prev.filter(
          (p) => !(p.title === entryToSave.title && (p.media_type === entryToSave.media_type || p.type === entryToSave.media_type))
        );
        const updated = [entryToSave, ...filtered];
        try {
          localStorage.setItem('tv_vault_entries', JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
        return updated;
      });
    };

    // If Supabase is connected and user is authenticated
    if (supabase && user) {
      const payload = {
        ...formatted,
        user_id: user.id,
      };

      try {
        let { data, error } = await supabase
          .from('vault_entries')
          .upsert(payload, { onConflict: 'user_id,title,media_type' })
          .select()
          .maybeSingle();

        // If upsert fails for any constraint/RLS edge-case, fallback to select-then-insert/update
        if (error) {
          console.warn('Upsert hit issue, trying direct select-then-save fallback:', error);
          const { data: existing } = await supabase
            .from('vault_entries')
            .select('id')
            .eq('user_id', user.id)
            .eq('title', formatted.title)
            .eq('media_type', formatted.media_type)
            .maybeSingle();

          if (existing?.id) {
            const updateRes = await supabase
              .from('vault_entries')
              .update(payload)
              .eq('id', existing.id)
              .select()
              .single();
            data = updateRes.data;
            error = updateRes.error;
          } else {
            const insertRes = await supabase
              .from('vault_entries')
              .insert(payload)
              .select()
              .single();
            data = insertRes.data;
            error = insertRes.error;
          }
        }

        if (error) {
          console.error('Supabase save error, falling back locally:', error);
          const fallbackEntry = {
            ...formatted,
            id: 'local_' + Date.now(),
            created_at: new Date().toISOString(),
          };
          updateLocalStateAndStorage(fallbackEntry);
          return { success: true, cloud: false, localFallback: true };
        }

        // Successfully saved to Supabase
        const finalSaved = { ...data, poster_url: data.poster_url || formatted.poster_url };
        updateLocalStateAndStorage(finalSaved);
        return { success: true, cloud: true, data: finalSaved };
      } catch (err) {
        console.error('Unexpected Supabase error, falling back locally:', err);
        const fallbackEntry = {
          ...formatted,
          id: 'local_' + Date.now(),
          created_at: new Date().toISOString(),
        };
        updateLocalStateAndStorage(fallbackEntry);
        return { success: true, cloud: false, localFallback: true };
      }
    }

    // Local fallback for guest or unconfigured mode
    const localEntry = {
      ...formatted,
      id: 'local_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    updateLocalStateAndStorage(localEntry);
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

  // Update Vault Entry (e.g. from Watchlist to Completed/Watched, or edit rating)
  const updateVaultEntry = async (title, mediaType, updates) => {
    setVaultEntries((prev) => {
      const updated = prev.map((item) => {
        if (item.title === title && (item.media_type === mediaType || item.type === mediaType)) {
          return { ...item, ...updates };
        }
        return item;
      });
      try {
        localStorage.setItem('tv_vault_entries', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    if (supabase && user) {
      try {
        await supabase
          .from('vault_entries')
          .update(updates)
          .match({ user_id: user.id, title, media_type: mediaType });
      } catch (err) {
        console.warn('Could not sync update to Supabase:', err);
      }
    }
  };

  // Delete Vault Entry
  const deleteVaultEntry = async (title, mediaType) => {
    setVaultEntries((prev) => {
      const filtered = prev.filter(
        (item) => !(item.title === title && (item.media_type === mediaType || item.type === mediaType))
      );
      try {
        localStorage.setItem('tv_vault_entries', JSON.stringify(filtered));
      } catch (e) {
        console.warn(e);
      }
      return filtered;
    });

    if (supabase && user) {
      try {
        await supabase
          .from('vault_entries')
          .delete()
          .match({ user_id: user.id, title, media_type: mediaType });
      } catch (err) {
        console.warn('Could not delete from Supabase:', err);
      }
    }
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
        updateVaultEntry,
        deleteVaultEntry,
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
