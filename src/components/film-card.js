import * as moment from 'moment';
import AbstractComponent from "./abstract-component";
import {ControlsElement} from '../utils/controls';

const MAX_DESCRIPTION_LENGTH = 140;

const createControlsElementMarkup = (element, isActive = false) => {
  const activeClass = isActive ? `film-card__controls-item--active` : ``;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${element.modifier} ${activeClass}">
      ${element.text}
    </button>`
  );
};

const createFilmCardTemplate = (film) => {
  const {
    name,
    poster,
    description,
    rating,
    release,
    duration,
    genres,
    commentsCount,
    isInWatchList,
    isWatched,
    isFavorite,
  } = film;
  const shortDescription = description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}...` : description;
  const year = moment(release).format(`YYYY`);

  const watchListButton = createControlsElementMarkup(ControlsElement.WATCHLIST, isInWatchList);
  const watchedButton = createControlsElementMarkup(ControlsElement.WATCHED, isWatched);
  const favoriteButton = createControlsElementMarkup(ControlsElement.FAVORITE, isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${watchListButton}
        ${watchedButton}
        ${favoriteButton}
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setDetailsOpenersClickHandler(handler) {
    const titleElement = this.getElement().querySelector(`.film-card__title`);
    const posterElement = this.getElement().querySelector(`.film-card__poster`);
    const commentsElement = this.getElement().querySelector(`.film-card__comments`);
    [titleElement, posterElement, commentsElement].forEach((element) => {
      element.addEventListener(`click`, handler);
    });
  }

  setWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
