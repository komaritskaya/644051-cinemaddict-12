import FilmCardComponent from '../components/film-card';
import FilmDetailsComponent from '../components/film-details';
import NoFilmsComponent from '../components/no-films';
import Comment from '../components/comment';
import ShowMoreButtonComponent from '../components/show-more-btn';
import AllFilmsContainerComponent from '../components/all-films-container';
import ExtraFilmsContainerComponent from '../components/extra-films-container';
import {render, remove} from "../utils/render";
import {KeyCode} from "../utils/common";
import {generateComments} from '../mock/comment';

const SHOWING_ALL_FILMS_COUNT_ON_START = 5;
const SHOWING_ALL_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_COUNT = 2;

const ExtraFilmsListName = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

const bodyElement = document.querySelector(`body`);

const renderComments = (filmDetailsComponent, film) => {
  const comments = generateComments(film.commentsCount);
  const commentsListElement = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  comments.slice(0, comments.length)
    .forEach((comment) => render(commentsListElement, new Comment(comment)));
};

const renderFilm = (filmsListElement, film) => {
  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const onOpenButtonClick = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
    renderComments(filmDetailsComponent, film);
  };

  const onCloseButtonClick = () => {
    remove(filmDetailsComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.keyCode === KeyCode.ESC_KEY;

    if (isEscKey) {
      remove(filmDetailsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  filmCardComponent.setDetailsOpenersClickHandler(onOpenButtonClick);
  filmDetailsComponent.setCloseButtonClickHandler(onCloseButtonClick);

  render(filmsListElement, filmCardComponent);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._allFilmsContainerComponent = new AllFilmsContainerComponent();
  }

  render(films) {
    const container = this._container.getElement();
    render(container, this._allFilmsContainerComponent);
    const allFilmsListElement = this._allFilmsContainerComponent.getElement();

    if (!films.length) {
      render(allFilmsListElement, this._noFilmsComponent);
      return;
    }

    let showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;
    const filmsContainerElement = allFilmsListElement.querySelector(`.films-list__container`);
    films.slice(0, showingAllFilmsCount)
      .forEach((film) => renderFilm(filmsContainerElement, film));

    render(allFilmsListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevAllFilmsCount = showingAllFilmsCount;
      showingAllFilmsCount = prevAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

      films.slice(prevAllFilmsCount, showingAllFilmsCount)
        .forEach((film) => renderFilm(filmsContainerElement, film));

      if (showingAllFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    const topRatedFilms = films.filter((film) => film.rating).sort((a, b) => b.rating - a.rating)
      .slice(0, EXTRA_FILMS_COUNT);
    const mostCommentedFilms = films.filter((film) => film.commentsCount)
      .sort((a, b) => b.commentsCount - a.commentsCount)
      .slice(0, EXTRA_FILMS_COUNT);

    if (topRatedFilms.length) {
      const extraFilmsContainerComponent = new ExtraFilmsContainerComponent(ExtraFilmsListName.TOP_RATED);
      const extraFilmsContainerElement = extraFilmsContainerComponent.getElement().querySelector(`.films-list__container`);
      render(container, extraFilmsContainerComponent);
      topRatedFilms.forEach((film) => renderFilm(extraFilmsContainerElement, film));
    }

    if (mostCommentedFilms.length) {
      const extraFilmsContainerComponent = new ExtraFilmsContainerComponent(ExtraFilmsListName.MOST_COMMENTED);
      const extraFilmsContainerElement = extraFilmsContainerComponent.getElement().querySelector(`.films-list__container`);
      render(container, extraFilmsContainerComponent);
      mostCommentedFilms.forEach((film) => renderFilm(extraFilmsContainerElement, film));
    }
  }
}
