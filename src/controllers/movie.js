import MovieCardComponent from "../components/movie-card.js";
import MovieDetailsComponent from "../components/movie-details.js";
import MovieModel from './../models/movie.js';
import {render, replace, remove} from "../utils/render.js";
import {KeyCode} from '../utils/common';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(
      container,
      onDataChange,
      onViewChange,
      onCommentDelete,
      onCommentAdd
  ) {
    this.id = null;

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentDelete = onCommentDelete;
    this._onCommentAdd = onCommentAdd;

    this._mode = Mode.DEFAULT;

    this._movieCardComponent = null;
    this._movieDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closeDetails = this._closeDetails.bind(this);
    this._openDetails = this._openDetails.bind(this);

    this._onCommentFormSubmit = this._onCommentFormSubmit.bind(this);
  }

  render(movie) {
    this.id = movie.id;

    const oldMovieCardComponent = this._movieCardComponent;
    const oldMovieDetailsComponent = this._movieDetailsComponent;

    this._movieCardComponent = new MovieCardComponent(movie);
    this._movieDetailsComponent = new MovieDetailsComponent(movie);

    if (oldMovieCardComponent && oldMovieDetailsComponent) {
      replace(this._movieCardComponent, oldMovieCardComponent);
      replace(this._movieDetailsComponent, oldMovieDetailsComponent);
      this._subscribeOnPopupEvents(movie);
    } else {
      render(this._container, this._movieCardComponent);
    }

    this._subscribeOnCardEvents(movie);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeDetails();
    }
  }

  destroy() {
    remove(this._movieCardComponent);
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCommentFormSubmit);
  }

  shake() {

  }

  _openDetails(movie) {
    this._onViewChange();

    const bodyElement = document.querySelector(`body`);
    render(bodyElement, this._movieDetailsComponent);

    this._subscribeOnPopupEvents(movie);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.addEventListener(`keydown`, this._onCommentFormSubmit);
    this._mode = Mode.DETAILS;
  }

  _closeDetails() {
    // this._movieDetailsComponent.reset();

    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onCommentFormSubmit);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.keyCode === KeyCode.ESC_KEY;

    if (isEscKey) {
      this._closeDetails();
      // remove(this._movieDetailsComponent);
      // this._applyFormData(this._movie);
      // document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  // _applyFormData(movie) {
  //   const data = this._movieDetailsComponent.getFormData();
  //   this._onDataChange(movie, Object.assign({}, movie, data));
  // }

  _subscribeOnCardEvents(movie) {
    this._movieCardComponent.setDetailsOpenersClickHandler(() => {
      this._openDetails(movie);
    });

    this._movieCardComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onWatchlistChange(movie);
    });

    this._movieCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onAlreadyWatchedChange(movie);
    });

    this._movieCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onFavoritesChange(movie);
    });
  }

  _subscribeOnPopupEvents(movie) {
    this._movieDetailsComponent.setCloseButtonClickHandler((evt) => {
      evt.preventDefault();
      // this._applyFormData(movie);
      this._closeDetails();
      // document.removeEventListener(`keydown`, this._onEscKeyDown());
    });

    this._movieDetailsComponent.setAddToWatchlistClickHandler(() => {
      this._onWatchlistChange(movie);
    });

    this._movieDetailsComponent.setAlreadyWatchedClickHandler(() => {
      this._onAlreadyWatchedChange(movie);
    });

    this._movieDetailsComponent.setAddToFavoritesClickHandler(() => {
      this._onFavoritesChange(movie);
    });

    this._movieDetailsComponent.setCommentDeleteButtonClickHandler((commentId, button) => {
      this._onCommentDelete({movie, commentId, button});
    });

    this._movieDetailsComponent.setEmojiClickHandler();
  }

  _onWatchlistChange(movie) {
    const newMovie = MovieModel.clone(movie);
    newMovie.isInWatchList = !newMovie.isInWatchList;
    this._onDataChange(movie, newMovie);
  }

  _onAlreadyWatchedChange(movie) {
    const newMovie = MovieModel.clone(movie);
    newMovie.isWatched = !newMovie.isWatched;
    newMovie.watchDate = newMovie.watchDate ? new Date() : null;

    this._onDataChange(movie, newMovie);
  }

  _onFavoritesChange(movie) {
    const newMovie = MovieModel.clone(movie);
    newMovie.isFavorite = !movie.isFavorite;

    this._onDataChange(movie, newMovie);
  }

  _onCommentFormSubmit(evt) {
    if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER_KEY) {
      const {formElements, comment, movie} = this._movieDetailsComponent.getData();

      if (Object.values(comment).some((prop) => !prop)) {
        return;
      }

      formElements.forEach((element) => {
        element.disabled = true;

        if (element.tagName === `TEXTAREA`) {
          element.style.boxShadow = null;
        }
      });

      document.removeEventListener(`keydown`, this._onCommentFormSubmit);
      this._onCommentAdd({comment, movie, onCommentFormSubmit: this._onCommentFormSubmit});
    }
  }
}
