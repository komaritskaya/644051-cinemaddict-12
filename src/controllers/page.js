import FilmCardComponent from '../components/film-card';
import FilmDetailsComponent from '../components/film-details';
import NoFilmsComponent from '../components/no-films';
import SortComponent from '../components/sort';
import Comment from '../components/comment';
import ShowMoreButtonComponent from '../components/show-more-btn';
import AllFilmsContainerComponent from '../components/all-films-container';
import ExtraFilmsContainerComponent from '../components/extra-films-container';
import {render, remove, RenderPosition} from '../utils/render';
import {SortType} from '../utils/sort';
import {KeyCode} from '../utils/common';
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

const renderFilms = (filmsListElement, films) => {
  films.forEach((film) => {
    renderFilm(filmsListElement, film);
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.release - a.release);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS:
      sortedFilms = showingFilms.sort((a, b) => b.commentsCount - a.commentsCount);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._allFilmsContainerComponent = new AllFilmsContainerComponent();
  }

  render(films) {
    const renderShowMoreButton = () => {
      if (showingAllFilmsCount >= films.length) {
        return;
      }

      render(allFilmsListElement, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevAllFilmsCount = showingAllFilmsCount;
        showingAllFilmsCount = prevAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

        const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevAllFilmsCount, showingAllFilmsCount);
        renderFilms(filmsContainerElement, sortedFilms);

        if (showingAllFilmsCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFORE);
    render(container, this._allFilmsContainerComponent);

    const allFilmsListElement = this._allFilmsContainerComponent.getElement();

    let showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;

    if (!films.length) {
      render(allFilmsListElement, this._noFilmsComponent);
      return;
    }

    const filmsContainerElement = allFilmsListElement.querySelector(`.films-list__container`);

    renderFilms(filmsContainerElement, films.slice(0, showingAllFilmsCount));
    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_BY_BUTTON;
      const sortedFilms = getSortedFilms(films, sortType, 0, showingAllFilmsCount);

      filmsContainerElement.innerHTML = ``;

      renderFilms(filmsContainerElement, sortedFilms);

      renderShowMoreButton();
    });

    const topRatedFilms = getSortedFilms(films, SortType.RATING, 0, EXTRA_FILMS_COUNT).filter((film) => film.rating);
    const mostCommentedFilms = getSortedFilms(films, SortType.COMMENTS, 0, EXTRA_FILMS_COUNT).filter((film) => film.commentsCount);

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
