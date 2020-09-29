import Movie from '../models/movie.js';

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies);

          this._store.setItems(items);

          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(storeMovies);
  }

  updateMovie(id, data) {
    if (isOnline()) {
      return this._api.updateMovie(id, data)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie);

          return newMovie;
        });
    }

    this._store.setItem(id, data);

    return Promise.resolve(data);
  }

  deleteComment(commentId, movie) {
    const localMovie = Object.assign({}, movie, {comments: movie.comments.filter(({id}) => id !== commentId)});

    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => {
          this._store.setItem(movie.id, localMovie);
        });
    }

    return Promise.reject();
  }

  addComment(movie, comment) {
    if (isOnline()) {
      return this._api.addComment(movie, comment)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie);

          return newMovie;
        });
    }

    return Promise.reject();
  }

  sync() {
    if (isOnline()) {
      const storeMovies = Object.values(this._store.getItems()).map(Movie.toRAW);

      return this._api.sync(storeMovies)
        .then((response) => {
          this._store.setItems(response);
        });
    }

    return Promise.reject(new Error(`Data sync failed`));
  }
}
