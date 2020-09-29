import MovieController from './movie';
import NoMoviesComponent from '../components/no-movies';
import SortComponent from '../components/sort';
import ShowMoreButtonComponent from '../components/show-more-btn';
// import AllMoviesContainerComponent from '../components/all-movies-container';
// import ExtraMoviesContainerComponent from '../components/extra-movies-container';
import {render, remove, RenderPosition} from '../utils/render';
import {SortType} from '../utils/sort';

const SHOWING_ALL_MOVIES_COUNT_ON_START = 5;
const SHOWING_ALL_MOVIES_COUNT_BY_BUTTON = 5;
// const EXTRA_MOVIES_COUNT = 2;

// const ExtraMoviesListName = {
//   TOP_RATED: `Top rated`,
//   MOST_COMMENTED: `Most commented`,
// };

const renderMovies = (moviesListElement, movies, onDataChange, onViewChange, onCommentDelete, onCommentAdd) => {
  return movies.map((movie) => {
    const movieController = new MovieController(moviesListElement, onDataChange, onViewChange, onCommentDelete, onCommentAdd);
    movieController.render(movie);
    return movieController;
  });
};

const getSortedMovies = (movies, sortType) => {
  let sortedMovies = [];
  const showingMovies = movies.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedMovies = showingMovies.sort((a, b) => b.release - a.release);
      break;
    case SortType.RATING:
      sortedMovies = showingMovies.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.COMMENTS:
      sortedMovies = showingMovies.sort((a, b) => b.comments.length - a.comments.length);
      break;
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies;
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._showedMovieControllers = [];

    this._showingAllMoviesCount = SHOWING_ALL_MOVIES_COUNT_ON_START;
    this._noMoviesComponent = new NoMoviesComponent();
    this._sortComponent = new SortComponent();
    this._sortType = SortType.DEFAULT;
    this._sortedMovies = this._moviesModel.getMovies();


    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCommentAdd = this._onCommentAdd.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
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
    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFORE);
    const isLoading = !!document.querySelector(`.films-list__title:not(.visually-hidden)`);

    if (isLoading) {
      return;
    }

    const movies = this._moviesModel.getMovies();
    this._sortedMovies = movies;

    const moviesListElement = container.querySelector(`.films-list`);
    // console.log(container);
    // console.log(moviesListElement);

    if (!movies.length) {
      render(moviesListElement, this._noMoviesComponent);
      return;
    }

    this._renderMovies(movies.slice(0, this._showingAllMoviesCount));

    this._renderShowMoreButton();

    // const topRatedMovies = getSortedMovies(movies, SortType.RATING, 0, EXTRA_MOVIES_COUNT).filter((movie) => movie.rating);
    // const mostCommentedMovies = getSortedMovies(movies, SortType.COMMENTS, 0, EXTRA_MOVIES_COUNT).filter((movie) => movie.comments.length);

    // if (topRatedMovies.length) {
    //   const extraMoviesContainerComponent = new ExtraMoviesContainerComponent(ExtraMoviesListName.TOP_RATED);
    //   const extraMoviesContainerElement = extraMoviesContainerComponent.getElement().querySelector(`.films-list__container`);
    //   render(container, extraMoviesContainerComponent);
    //   topRatedMovies.forEach((movie) => renderMovie(extraMoviesContainerElement, movie));
    // }

    // if (mostCommentedMovies.length) {
    //   const extraMoviesContainerComponent = new ExtraMoviesContainerComponent(ExtraMoviesListName.MOST_COMMENTED);
    //   const extraMoviesContainerElement = extraMoviesContainerComponent.getElement().querySelector(`.films-list__container`);
    //   render(container, extraMoviesContainerComponent);
    //   mostCommentedMovies.forEach((movie) => renderMovie(extraMoviesContainerElement, movie));
    // }
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _renderMovies(movies) {
    const moviesContainerElement = this._container.getElement().querySelector(`.films-list__container`);

    const newMovies = renderMovies(moviesContainerElement, movies, this._onDataChange, this._onViewChange, this._onCommentDelete, this._onCommentAdd);
    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _updateMovie(movie) {
    this._sortedMovies = this._sortedMovies.map((it) => {
      if (it.id === movie.id) {
        return movie;
      }
      return it;
    });
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingAllMoviesCount >= this._sortedMovies.length) {
      return;
    }

    const allMoviesListElement = this._container.getElement().querySelector(`.films-list`);
    render(allMoviesListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _updateMovies() {
    this._removeMovies();
    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), this._sortType);
    this._renderMovies(this._sortedMovies.slice(0, SHOWING_ALL_MOVIES_COUNT_ON_START));
    this._renderShowMoreButton();
  }

  _onCommentDelete(oldData) {
    const {movie, commentId, button} = oldData;
    this._api.deleteComment(commentId, movie)
        .then(() => {
          const isSuccess = this._moviesModel.removeComment(commentId, movie);

          if (isSuccess) {
            this._showedMovieControllers
            // .concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.render(this._moviesModel.getMoviesAll().find((it) => it.id === movie.id)));

            // this._renderMostCommentedMovies();
          }
        })
        .catch(() => {
          button.disabled = false;
          button.textContent = `Delete`;
          this._showedMovieControllers.concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.shake());
        });

  }

  _onCommentAdd(newData) {
    const {movie: newMovie, comment, onCommentFormSubmit} = newData;
    this._api.addComment(newMovie.id, comment)
        .then((movie) => {
          const isSuccess = this._moviesModel.addComment(movie.comments.pop(), movie);

          if (isSuccess) {
            this._showedMovieControllers
            // .concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.render(this._moviesModel.getMoviesAll()
              .find((it) => it.id === movie.id)));

            // this._renderMostCommentedMovies();
          }
        })
        .catch(() => {
          document.querySelectorAll(`[disabled]`).forEach((element) => {
            element.disabled = false;

            if (element.tagName === `TEXTAREA`) {
              element.style.boxShadow = `0 0 0 3px red`;
            }
          });

          this._showedMovieControllers
          // .concat(this._extraMovieControllers)
              .filter(({id}) => id === newMovie.id)
              .forEach((movieController) => movieController.shake());
        });

    document.addEventListener(`keydown`, onCommentFormSubmit);
  }

  _onDataChange(oldData, newData) {
    this._api.updateMovie(oldData.id, newData)
        .then((movieModel) => {
          const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);

          if (isSuccess) {
            this._updateMovie(movieModel);
            this._showedMovieControllers
            // .concat(this._extraMovieControllers)
            .filter(({id}) => id === oldData.id)
            .forEach((movieController) => movieController.render(movieModel));
          }
        });
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._showingAllMoviesCount = SHOWING_ALL_MOVIES_COUNT_ON_START;

    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), this._sortType);

    this._removeMovies();
    this._renderMovies(this._sortedMovies.slice(0, this._showingAllMoviesCount));

    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateMovies();
    // this._onSortTypeChange(SortType.DEFAULT);
  }

  _onShowMoreButtonClick() {
    const prevAllMoviesCount = this._showingAllMoviesCount;
    this._showingAllMoviesCount = this._showingAllMoviesCount + SHOWING_ALL_MOVIES_COUNT_BY_BUTTON;

    this._renderMovies(this._sortedMovies.slice(prevAllMoviesCount, this._showingAllMoviesCount));

    if (this._showingAllMoviesCount >= this._sortedMovies.length) {
      remove(this._showMoreButtonComponent);
    }
  }
}
