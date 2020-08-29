import MovieController from './movie';
import NoFilmsComponent from '../components/no-films';
import SortComponent from '../components/sort';
import ShowMoreButtonComponent from '../components/show-more-btn';
import AllFilmsContainerComponent from '../components/all-films-container';
// import ExtraFilmsContainerComponent from '../components/extra-films-container';
import {render, remove, RenderPosition} from '../utils/render';
import {SortType} from '../utils/sort';
// import {generateComments} from '../mock/comment';

const SHOWING_ALL_FILMS_COUNT_ON_START = 5;
const SHOWING_ALL_FILMS_COUNT_BY_BUTTON = 5;
// const EXTRA_FILMS_COUNT = 2;

// const ExtraFilmsListName = {
//   TOP_RATED: `Top rated`,
//   MOST_COMMENTED: `Most commented`,
// };

// const bodyElement = document.querySelector(`body`);

const renderFilms = (filmListElement, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(filmListElement, onDataChange, onViewChange);
    movieController.render(film);
    return movieController;
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

    this._films = [];
    this._showedFilmControllers = [];

    this._showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._allFilmsContainerComponent = new AllFilmsContainerComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(films) {
    this._films = films;

    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFORE);
    render(container, this._allFilmsContainerComponent);

    const allFilmsListElement = this._allFilmsContainerComponent.getElement();

    if (!this._films.length) {
      render(allFilmsListElement, this._noFilmsComponent);
      return;
    }

    const filmsContainerElement = allFilmsListElement.querySelector(`.films-list__container`);
    const newFilms = renderFilms(filmsContainerElement, this._films.slice(0, this._showingAllFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderShowMoreButton();

    // const topRatedFilms = getSortedFilms(films, SortType.RATING, 0, EXTRA_FILMS_COUNT).filter((film) => film.rating);
    // const mostCommentedFilms = getSortedFilms(films, SortType.COMMENTS, 0, EXTRA_FILMS_COUNT).filter((film) => film.commentsCount);

    // if (topRatedFilms.length) {
    //   const extraFilmsContainerComponent = new ExtraFilmsContainerComponent(ExtraFilmsListName.TOP_RATED);
    //   const extraFilmsContainerElement = extraFilmsContainerComponent.getElement().querySelector(`.films-list__container`);
    //   render(container, extraFilmsContainerComponent);
    //   topRatedFilms.forEach((film) => renderFilm(extraFilmsContainerElement, film));
    // }

    // if (mostCommentedFilms.length) {
    //   const extraFilmsContainerComponent = new ExtraFilmsContainerComponent(ExtraFilmsListName.MOST_COMMENTED);
    //   const extraFilmsContainerElement = extraFilmsContainerComponent.getElement().querySelector(`.films-list__container`);
    //   render(container, extraFilmsContainerComponent);
    //   mostCommentedFilms.forEach((film) => renderFilm(extraFilmsContainerElement, film));
    // }
  }

  _renderShowMoreButton() {
    if (this._showingAllFilmsCount >= this._films.length) {
      return;
    }

    const allFilmsListElement = this._allFilmsContainerComponent.getElement();
    render(allFilmsListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevAllFilmsCount = this._showingAllFilmsCount;
      const filmsContainerElement = allFilmsListElement.querySelector(`.films-list__container`);
      this._showingAllFilmsCount = this._showingAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType(), prevAllFilmsCount, this._showingAllFilmsCount);

      const newFilms = renderFilms(filmsContainerElement, sortedFilms, this._onDataChange, this._onViewChange);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingAllFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    movieController.render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingAllFilmsCount);

    const allFilmsListElement = this._allFilmsContainerComponent.getElement();
    const filmsContainerElement = allFilmsListElement.querySelector(`.films-list__container`);
    filmsContainerElement.innerHTML = ``;

    const newFilms = renderFilms(filmsContainerElement, sortedFilms, this._onDataChange, this._onViewChange);

    this._showedFilmControllers = newFilms;

    // this._renderShowMoreButton();
  }
}
