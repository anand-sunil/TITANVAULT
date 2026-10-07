const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export const isTMDBConfigured = () => Boolean(TMDB_API_KEY && TMDB_API_KEY.trim() !== '');

export const searchTMDB = async (query, mediaType = 'movies') => {
  if (!query || query.trim().length === 0) return [];
  if (!isTMDBConfigured()) {
    console.warn('TMDB API Key is not set in VITE_TMDB_API_KEY.');
    return [];
  }

  const cleanQuery = encodeURIComponent(query.trim());
  let endpoint = '';

  if (mediaType === 'movies') {
    endpoint = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${cleanQuery}&include_adult=false&language=en-US`;
  } else if (mediaType === 'anime') {
    // Search TV and multi for anime (Japanese animation)
    endpoint = `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${cleanQuery}&include_adult=false&language=en-US`;
  } else {
    endpoint = `${BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${cleanQuery}&include_adult=false&language=en-US`;
  }

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn('TMDB search HTTP error:', res.status);
      return [];
    }
    const data = await res.json();
    if (!data.results) return [];

    return data.results.slice(0, 10).map((item) => {
      const title = item.title || item.name || 'Untitled';
      const dateStr = item.release_date || item.first_air_date || '';
      const year = dateStr ? new Date(dateStr).getFullYear() : null;

      const genres = Array.isArray(item.genre_ids)
        ? item.genre_ids.map((id) => GENRE_MAP[id] || 'General').filter(Boolean)
        : [];

      // Generate consistent comic hue from title string
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);

      const typeLabel =
        mediaType === 'movies' ? 'Movie' : mediaType === 'anime' ? 'Anime' : 'Series';

      return {
        id: item.id,
        tmdb_id: item.id,
        title,
        year: year || 2024,
        type: mediaType,
        typeLabel,
        genres: genres.length > 0 ? genres : ['General'],
        poster: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        backdrop: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : null,
        overview: item.overview || 'No synopsis available in archives.',
        hue,
      };
    });
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return [];
  }
};

export const getTMDBDetails = async (id, mediaType = 'movies') => {
  if (!id || !isTMDBConfigured()) return null;

  const typeSegment = mediaType === 'movies' ? 'movie' : 'tv';
  const endpoint = `${BASE_URL}/${typeSegment}/${id}?api_key=${TMDB_API_KEY}&language=en-US`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    const data = await res.json();

    const title = data.title || data.name || 'Untitled';
    const dateStr = data.release_date || data.first_air_date || '';
    const year = dateStr ? new Date(dateStr).getFullYear() : 2024;

    const genres = Array.isArray(data.genres)
      ? data.genres.map((g) => g.name)
      : ['General'];

    let seasonsInfo = '';
    if (mediaType !== 'movies') {
      const sCount = data.number_of_seasons || 1;
      const epCount = data.number_of_episodes || 0;
      seasonsInfo = `${sCount} Season${sCount > 1 ? 's' : ''} • ${epCount} Episode${epCount !== 1 ? 's' : ''}`;
    }

    let duration = '';
    if (data.runtime) {
      const hrs = Math.floor(data.runtime / 60);
      const mins = data.runtime % 60;
      duration = `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
    }

    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);

    return {
      id: data.id,
      tmdb_id: data.id,
      title,
      year,
      type: mediaType,
      typeLabel: mediaType === 'movies' ? 'Movie' : mediaType === 'anime' ? 'Anime' : 'Series',
      genres,
      poster: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null,
      backdrop: data.backdrop_path ? `${IMAGE_BASE_URL}${data.backdrop_path}` : null,
      overview: data.overview || 'No synopsis available in archives.',
      seasons: seasonsInfo,
      duration,
      hue,
      tagline: data.tagline ? data.tagline.toUpperCase() : '',
    };
  } catch (err) {
    console.error('Error fetching TMDB details:', err);
    return null;
  }
};
