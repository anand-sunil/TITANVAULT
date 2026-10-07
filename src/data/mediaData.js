export const MEDIA_DATA = [];

export const getByTitle = (title) => MEDIA_DATA.find((item) => item.t === title);

export const WATCHLIST_TITLES = [];
export const WATCHLIST = [];

export const RECENTLY_WATCHED_TITLES = [];
export const RECENTLY_WATCHED = [];

export const CURRENTLY_WATCHING = [];

export const PAGES_CONFIG = {
  movies: {
    t: "MOVIES",
    tag: "DIFFERENT WORLDS. SAME EMOTIONS.",
    h: 355,
    genres: ["All", "Action", "Sci-Fi", "Thriller", "Drama", "Fantasy", "Animation", "Comedy"],
    defaultSort: "Rating"
  },
  anime: {
    t: "ANIME",
    tag: "MORE THAN JUST AN ANIME.",
    h: 275,
    genres: ["All", "Action", "Adventure", "Fantasy", "Slice of Life", "Romance", "Mystery", "Drama"],
    defaultSort: "Rating"
  },
  series: {
    t: "SERIES",
    tag: "EPISODES THAT STAY WITH YOU.",
    h: 215,
    genres: ["All", "Drama", "Thriller", "Sci-Fi", "Fantasy", "Mystery", "Comedy"],
    defaultSort: "Rating"
  },
  watchlist: {
    t: "MY WATCHLIST",
    tag: "STORIES I'M LOOKING FORWARD TO.",
    h: 0,
    isWatchlist: true,
    genres: ["All", "Movies", "Anime", "Series"],
    defaultSort: "Recently Added"
  },
  favorites: {
    t: "FAVORITES",
    tag: "THE ONES I LOVE.",
    h: 350,
    genres: ["All", "Movies", "Anime", "Series"],
    defaultSort: "Rating"
  }
};

export const NAV_ITEMS = [
  { path: "/home", key: "home", label: "Home", icon: "⌂" },
  { path: "/movies", key: "movies", label: "Movies", icon: "▦" },
  { path: "/anime", key: "anime", label: "Anime", icon: "☺" },
  { path: "/series", key: "series", label: "Series", icon: "▣" },
  { path: "/watchlist", key: "watchlist", label: "Watchlist", icon: "♡" },
  { path: "/favorites", key: "favorites", label: "Favorites", icon: "♥" },
  { path: "/add", key: "add", label: "Add to Vault", icon: "+" }
];
