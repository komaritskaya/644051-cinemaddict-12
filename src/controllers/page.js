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
      sortedFilms = showingFilms.sort((a, b) => b.comments.length - a.comments.length);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._showedFilmControllers = [];

    this._showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._allFilmsContainerComponent = new AllFilmsContainerComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
    this._sortComponent.hide();
  }

  show() {
    this._container.show();
    this._sortComponent.show();
  }

  render() {
    const allFilmsListElement = this._allFilmsContainerComponent.getElement();

    const container = this._container.getElement();
    const films = this._filmsModel.getFilms();

    if (!films.length) {
      render(allFilmsListElement, this._noFilmsComponent);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFORE);
    render(container, this._allFilmsContainerComponent);

    this._renderFilms(films.slice(0, this._showingAllFilmsCount));

    this._renderShowMoreButton();

    // const topRatedFilms = getSortedFilms(films, SortType.RATING, 0, EXTRA_FILMS_COUNT).filter((film) => film.rating);
    // const mostCommentedFilms = getSortedFilms(films, SortType.COMMENTS, 0, EXTRA_FILMS_COUNT).filter((film) => film.comments.length);

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

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _renderFilms(films) {

    const allFilmsListElement = this._allFilmsContainerComponent.getElement();
    const filmsContainerElement = allFilmsListElement.querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsContainerElement, films, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingAllFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    const allFilmsListElement = this._allFilmsContainerComponent.getElement();
    render(allFilmsListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _updateFilms(count) {
    this._removeFilms();
    this._showingAllFilmsCount = count;
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      this._updateFilms(this._showingFilmsCount);
    }
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingAllFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_ALL_FILMS_COUNT_ON_START);
  }

  _onShowMoreButtonClick() {
    const prevAllFilmsCount = this._showingAllFilmsCount;
    const films = this._filmsModel.getFilms();
    this._showingAllFilmsCount = this._showingAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevAllFilmsCount,
        this._showingAllFilmsCount);
    this._renderFilms(sortedFilms);

    if (this._showingAllFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }
}
