import moment from 'moment';
import he from 'he';
import {nanoid} from 'nanoid';
import {render} from '../utils/render';
import Comment from './comment';
import AbstractSmartComponent from "./abstract-smart-component";
import {ControlsElement} from '../utils/controls';
import {KeyCode} from '../utils/common';

const EMOJI = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const createControlsElementMarkup = (element, isActive = false) => {
  const activeAttribute = isActive ? `checked` : ``;
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${element.name}" name="${element.name}" ${activeAttribute}>
    <label for="${element.name}" class="film-details__control-label film-details__control-label--${element.name}">${element.text}</label>`
  );
};

const createEmojiMarkup = (emoji, currentEmoji) => {
  return emoji
    .map((item) => {
      return (
        `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${item}" value="${item} ${currentEmoji === item ? `checked` : ``}">
        <label class="film-details__emoji-label" for="emoji-${item}">
          <img src="./images/emoji/${item}.png" width="30" height="30" alt="emoji">
        </label>`
      );
    })
    .join(`\n`);
};

const createCurrentEmojiMarkup = (currentEmoji) => {
  return (
    `<div for="add-emoji" class="film-details__add-emoji-label">
      ${currentEmoji ? `<img src="./images/emoji/${currentEmoji.trim()}.png" width="55" height="55"  alt="emoji">` : ``}
    </div>`
  );
};

const parseFormData = (formData) => {
  return {
    isInWatchList: formData.get(ControlsElement.WATCHLIST.name) === `on`,
    isWatched: formData.get(ControlsElement.WATCHED.name) === `on`,
    isFavorite: formData.get(ControlsElement.FAVORITE.name) === `on`,
  };
};

const createFilmDetailsTemplate = (film, options = {}) => {
  const {
    name,
    poster,
    description,
    rating,
    release,
    duration,
    genres,
    director,
    writers,
    actors,
    ageLimit,
    country,
  } = film;

  const {
    isInWatchList,
    isWatched,
    isFavorite,
    currentEmoji,
    comments,
  } = options;

  const releaseDateString = moment(release).format(`DD MMMM YYYY`);
  const writersString = writers.join(`, `);
  const actorsString = actors.join(`, `);
  const genresTitle = genres.length > 1 ? `Genres` : `Genre`;
  const genresMarkup = genres.map((genre) => (
    `<span class="film-details__genre">${genre}</span>`
  )).join(`\n`);
  const emojiMarkup = createEmojiMarkup(EMOJI, currentEmoji);
  const currentEmojiMarkup = createCurrentEmojiMarkup(currentEmoji);

  const watchListInput = createControlsElementMarkup(ControlsElement.WATCHLIST, isInWatchList);
  const watchedInput = createControlsElementMarkup(ControlsElement.WATCHED, isWatched);
  const favoriteInput = createControlsElementMarkup(ControlsElement.FAVORITE, isFavorite);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
              <p class="film-details__age">${ageLimit}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${name}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writersString}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actorsString}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateString}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genresTitle}</td>
                  <td class="film-details__cell">
                    ${genresMarkup}
                </tr>
              </table>
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            ${watchListInput}
            ${watchedInput}
            ${favoriteInput}
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list"></ul>
            <div class="film-details__new-comment">
              ${currentEmojiMarkup}
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
                ${emojiMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();

    this._film = film;
    this._isInWatchList = film.isInWatchList;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;
    this._comments = film.comments;
    this._closeHandler = null;
    this._currentEmoji = ``;
    this._newComment = ``;

    this._renderComments();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, {
      isInWatchList: this._isInWatchList,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      comments: this._comments,
      currentEmoji: this._currentEmoji,
    });
  }

  getFormData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return Object.assign({}, parseFormData(formData), {
      comments: this._comments,
    });
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this.getElement().scrollTop = this._elementScrollTop;
    this._renderComments();
  }

  reset() {
    const film = this._film;
    this._isInWatchList = film.isInWatchList;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;
    this._currentEmoji = ``;
    this._newComment = ``;

    this.rerender();
  }

  setCloseButtonClickHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  _renderComments() {
    const commentsListElement = this.getElement().querySelector(`.film-details__comments-list`);
    this._comments.slice(0, this._comments.length)
      .forEach((comment) => render(commentsListElement, new Comment(comment)));
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        this._elementScrollTop = this.getElement().scrollTop;
        this._isInWatchList = !this._isInWatchList;
        this.rerender();
      });

    element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        this._elementScrollTop = this.getElement().scrollTop;
        this._isWatched = !this._isWatched;
        this.rerender();
      });

    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        this._elementScrollTop = this.getElement().scrollTop;
        this._isFavorite = !this._isFavorite;
        this.rerender();
      });

    const emojiListElement = element.querySelector(`.film-details__emoji-list`);
    emojiListElement.addEventListener(`click`, (evt) => {
      this._elementScrollTop = this.getElement().scrollTop;
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      if (this._currentEmoji === evt.target.value) {
        this._currentEmoji = ``;
      } else {
        this._currentEmoji = evt.target.value.trim();
      }

      this.rerender();
    });

    const commentsListElement = element.querySelector(`.film-details__comments-list`);
    commentsListElement.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._elementScrollTop = this.getElement().scrollTop;
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }

      const commentElement = evt.target.closest(`.film-details__comment`);
      const commentId = commentElement.dataset.commentId;

      const index = this._comments.findIndex((it) => it.id === commentId);
      this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));

      this.rerender();
    });

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._newComment = evt.target.value;
    });

    element.addEventListener(`keydown`, (evt) => {
      if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER_KEY) {
        if (this._currentEmoji && this._newComment) {
          this._elementScrollTop = this.getElement().scrollTop;

          const newComment = {
            id: nanoid(),
            text: he.encode(this._newComment),
            emoji: this._currentEmoji,
            user: `You`,
            date: new Date(),
          };

          this._comments.push(newComment);
          this._currentEmoji = ``;
          this._newComment = ``;
          this.rerender();
        }
      }
    });
  }
}
