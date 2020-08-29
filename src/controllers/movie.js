import FilmCardComponent from "../components/film-card.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, replace, remove} from "../utils/render.js";
import {KeyCode} from '../utils/common';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._film = null;

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._movieCardComponent;
    const oldFilmDetailsComponent = this._movieDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }

    this._subscribeOnCardEvents(film);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeDetails();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openDetails() {
    this._onViewChange();

    const bodyElement = document.querySelector(`body`);
    render(bodyElement, this._filmDetailsComponent);
    this._mode = Mode.DETAILS;
  }

  _closeDetails() {
    this._filmDetailsComponent.reset();

    remove(this._filmDetailsComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.keyCode === KeyCode.ESC_KEY;

    if (isEscKey) {
      // remove(this._filmDetailsComponent);
      this._applyFormData(this._film);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _applyFormData(film) {
    const data = this._filmDetailsComponent.getFormData();
    this._onDataChange(film, Object.assign({}, film, data));
  }

  _subscribeOnCardEvents(film) {
    this._filmCardComponent.setDetailsOpenersClickHandler(() => {
      this._openDetails();
      this._subscribeOnPopupEvents(film);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmCardComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isInWatchList: !film.isInWatchList,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isWatched: !film.isWatched,
        watchDate: !film.isWatched ? new Date() : null,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });
  }

  _subscribeOnPopupEvents(film) {
    this._filmDetailsComponent.setCloseButtonClickHandler((evt) => {
      evt.preventDefault();
      this._applyFormData(film);

      document.removeEventListener(`keydown`, this._onEscKeyDown());
    });
  }
}
