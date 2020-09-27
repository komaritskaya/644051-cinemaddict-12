export const FilterType = {
  ALL: {
    longName: `All movies`,
    shortName: `all`,
  },
  WATCHLIST: {
    longName: `Watchlist`,
    shortName: `watchlist`,
  },
  HISTORY: {
    longName: `History`,
    shortName: `history`,
  },
  FAVORITES: {
    longName: `Favorites`,
    shortName: `favorites`,
  },
};

export const getMoviesInWatchList = (movies) => {
  return movies.filter((movie) => movie.isInWatchList);
};

export const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.isWatched);
};

export const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.isFavorite);
};

export const getMoviesByFilter = (movies, filterType) => {
  switch (filterType) {
    case FilterType.ALL.shortName:
      return movies;
    case FilterType.WATCHLIST.shortName:
      return getMoviesInWatchList(movies);
    case FilterType.HISTORY.shortName:
      return getWatchedMovies(movies);
    case FilterType.FAVORITES.shortName:
      return getFavoriteMovies(movies);
  }
  return movies;
};
