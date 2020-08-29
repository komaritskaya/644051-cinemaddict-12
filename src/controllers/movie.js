import FilmCardComponent from "../components/film-card.js";
import FilmDetailsComponent from "../components/film-details.js";
import Comment from "../components/comment.js";
import {render, replace, remove} from "../utils/render.js";
import {KeyCode} from '../utils/common';
import {generateComments} from '../mock/comment';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._comments = [];

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._movieCardComponent;
    const oldFilmDetailsComponent = this._movieDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._comments = generateComments(film.commentsCount);

    this._filmCardComponent.setWatchListButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isInWatchList: !film.isInWatchList,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent);
    }

    this._filmCardComponent.setDetailsOpenersClickHandler(() => {
      this._openDetails();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      this._closeDetails();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._filmCardComponent);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeDetails();
    }
  }

  _openDetails() {
    this._onViewChange();

    const bodyElement = document.querySelector(`body`);
    render(bodyElement, this._filmDetailsComponent);
    this._renderComments();
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
      remove(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _renderComments() {
    const commentsListElement = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
    this._comments.slice(0, this._comments.length)
      .forEach((comment) => render(commentsListElement, new Comment(comment)));
  }
}
