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

export const getFilmsInWatchList = (films) => {
  return films.filter((film) => film.isInWatchList);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL.shortName:
      return films;
    case FilterType.WATCHLIST.shortName:
      return getFilmsInWatchList(films);
    case FilterType.HISTORY.shortName:
      return getWatchedFilms(films);
    case FilterType.FAVORITES.shortName:
      return getFavoriteFilms(films);
  }
  return films;
};
