import moment from 'moment';
import he from 'he';
import AbstractSmartComponent from './abstract-smart-component';
import {ControlsElement} from '../utils/controls';

const EMOJI = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const createCommentsMarkup = (comments) => {
  return comments.map((comment) => {
    const {id, author, emotion, date} = comment;
    const text = comment.comment;
    const formattedDate = moment(date).format(`YYYY/MM/DD hh:mm`);
    return (
      `<li class="film-details__comment" data-comment-id="${id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${formattedDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  }).join(``);
};

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
    `${currentEmoji ? `<img src="./images/emoji/${currentEmoji.trim()}.png" width="55" height="55"  alt="emoji">` : ``}`
  );
};

const parseFormData = (formData) => {
  return {
    comment: he.encode(formData.get(`comment`)),
    date: new Date().toISOString(),
    emotion: formData.get(`comment-emoji`).trim(),
  };
};

const createMovieDetailsTemplate = (movie, options = {}) => {
  const {
    name,
    alternativeName,
    poster,
    description,
    rating,
    duration,
    genres,
    director,
    writers,
    actors,
    ageLimit,
    release,
    country,
    comments,
    isInWatchList,
    isWatched,
    isFavorite,
  } = movie;

  const {
    currentEmoji,
  } = options;
  const releaseDateString = moment(release).format(`DD MMMM YYYY`);
  const writersString = writers.join(`, `);
  const actorsString = actors.join(`, `);
  const genresTitle = genres.length > 1 ? `Genres` : `Genre`;
  const genresMarkup = genres.map((genre) => (
    `<span class="film-details__genre">${genre}</span>`
  )).join(`\n`);
  const commentsMarkup = comments.length ? createCommentsMarkup(comments) : ``;
  const emojiMarkup = createEmojiMarkup(EMOJI, currentEmoji);
  const currentEmojiMarkup = createCurrentEmojiMarkup(currentEmoji);

  const watchListInput = createControlsElementMarkup(ControlsElement.WATCHLIST, isInWatchList);
  const watchedInput = createControlsElementMarkup(ControlsElement.WATCHED, isWatched);
  const favoriteInput = createControlsElementMarkup(ControlsElement.FAVORITE, isFavorite);

  const hoursString = duration.hours() ? `${duration.hours()}h ` : ``;
  const minutesString = duration.minutes() ? `${duration.minutes()}m` : ``;
  const durationString = `${hoursString}${minutesString}`;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">
              <p class="film-details__age">${ageLimit}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${alternativeName}</p>
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
                  <td class="film-details__cell">${durationString}</td>
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
          <ul class="film-details__comments-list">${commentsMarkup}</ul>
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${currentEmojiMarkup}
              </div>
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

export default class MovieDetails extends AbstractSmartComponent {
  constructor(movie) {
    super();

    this._movie = movie;
    this.getData = this.getData.bind(this);

    this._currentEmoji = null;
  }

  getTemplate() {
    return createMovieDetailsTemplate(this._movie);
  }

  setCloseButtonClickHandler(handler) {
    const closeButtonElement = this.getElement().querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, handler);

    this._currentEmoji = null;
    this._closeHandler = handler;
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`#watchlist`)
      .addEventListener(`click`, handler);

    this._addToWatchlistClickHandler = handler;
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`#watched`)
      .addEventListener(`click`, handler);

    this._alreadyWatchedClickHandler = handler;
  }

  setAddToFavoritesClickHandler(handler) {
    this.getElement().querySelector(`#favorite`)
      .addEventListener(`click`, handler);

    this._addToFavoritesClickHandler = handler;
  }

  setCommentDeleteButtonClickHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`)
      .forEach((button) => button.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        button.disabled = true;
        button.textContent = `Deleting...`;
        const commentId = button.closest(`.film-details__comment`).dataset.commentId;
        handler(commentId, button);
      }));

    this._commentDeleteClickHandler = handler;
  }

  setEmojiClickHandler() {
    const emojiListElement = this.getElement().querySelector(`.film-details__emoji-list`);
    emojiListElement.addEventListener(`click`, (evt) => {
      this._elementScrollTop = this.getElement().scrollTop;
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      if (this._currentEmoji === evt.target.value) {
        this._currentEmoji = null;
      } else {
        this._currentEmoji = evt.target.value.trim();
      }
      this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = createCurrentEmojiMarkup(this._currentEmoji);
    });
  }

  getData() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);
    return {
      formElements: form.querySelectorAll(`input, textarea, button`),
      comment: parseFormData(formData),
      movie: this._movie
    };
  }
}
