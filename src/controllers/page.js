import MovieController from './movie';
import NoMoviesComponent from '../components/no-movies';
import SortComponent from '../components/sort';
import ShowMoreButtonComponent from '../components/show-more-btn';
import ExtraMoviesContainerComponent from '../components/extra-movies-container';
import {render, remove, RenderPosition} from '../utils/render';
import {SortType} from '../utils/sort';

const Count = {
  SHOWING_ALL_MOVIES_COUNT_ON_START: 5,
  SHOWING_ALL_MOVIES_COUNT_BY_BUTTON: 5,
  EXTRA_MOVIES_COUNT: 2
};

const ExtraMoviesListName = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

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
    this._extraMovieControllers = [];

    this._showingAllMoviesCount = Count.SHOWING_ALL_MOVIES_COUNT_ON_START;
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

    if (!movies.length) {
      render(moviesListElement, this._noMoviesComponent);
      return;
    }

    this._renderMovies(movies.slice(0, this._showingAllMoviesCount));

    this._renderShowMoreButton();
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _renderMovies(movies, container = this._container.getElement().querySelector(`.films-list__container`)) {
    const newMovies = renderMovies(container, movies, this._onDataChange, this._onViewChange, this._onCommentDelete, this._onCommentAdd);

    if (container.parentElement === document.querySelector(`.films-list--extra`)) {
      this._extraMovieControllers = this._extraMovieControllers.concat(newMovies);
    } else {
      this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);
      this._showingMoviesCount = this._showedMovieControllers.length;
    }
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
    this._renderMovies(this._sortedMovies.slice(0, Count.SHOWING_ALL_MOVIES_COUNT_ON_START));
    this._renderShowMoreButton();
  }

  _onCommentDelete(oldData) {
    const {movie, commentId, button} = oldData;
    this._api.deleteComment(commentId, movie)
        .then(() => {
          const isSuccess = this._moviesModel.removeComment(commentId, movie);

          if (isSuccess) {
            this._showedMovieControllers
              .concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.render(this._moviesModel.getMoviesAll().find((it) => it.id === movie.id)));

            this._renderMostCommentedMovies();
          }
        })
        .catch(() => {
          button.disabled = false;
          button.textContent = `Delete`;
          this._showedMovieControllers
            .concat(this._extraMovieControllers)
            .filter(({id}) => id === movie.id)
            .forEach((movieController) => movieController.shake());
        });
  }

  _onCommentAdd(newData) {
    const {movie: newMovie, comment, onCommentFormSubmit} = newData;
    this._api.addComment(newMovie, comment)
        .then((movie) => {
          const isSuccess = this._moviesModel.addComment(movie.comments.pop(), movie);
          if (isSuccess) {
            this._showedMovieControllers
              .concat(this._extraMovieControllers)
              .filter(({id}) => id === movie.id)
              .forEach((movieController) => movieController.render(this._moviesModel.getMoviesAll()
              .find((it) => it.id === movie.id)));

            this._renderMostCommentedMovies();
          }
        })
        .catch(() => {
          document.querySelectorAll(`[disabled]`).forEach((element) => {
            element.disabled = false;
          });

          this._showedMovieControllers
            .concat(this._extraMovieControllers)
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
              .concat(this._extraMovieControllers)
              .filter(({id}) => id === oldData.id)
              .forEach((movieController) => movieController.render(movieModel));
          }
        })
        .catch(() => {
          this._showedMovieControllers
            .concat(this._extraMovieControllers)
            .filter(({id}) => id === oldData.id)
            .forEach((movieController) => movieController.shake());
        });
  }

  _onViewChange() {
    this._showedMovieControllers
      .concat(this._extraMovieControllers)
      .forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._showingAllMoviesCount = Count.SHOWING_ALL_MOVIES_COUNT_ON_START;

    this._sortedMovies = getSortedMovies(this._moviesModel.getMovies(), this._sortType);

    this._removeMovies();
    this._renderMovies(this._sortedMovies.slice(0, this._showingAllMoviesCount));

    this._sortComponent.changeSortType(sortType);

    this._renderShowMoreButton();
    this._renderMostCommentedMovies();
  }

  _onFilterChange() {
    this._updateMovies();
    this._sortType = SortType.DEFAULT;
    this._onSortTypeChange(this._sortType);
    this._renderMostCommentedMovies();
  }

  _onShowMoreButtonClick() {
    const prevAllMoviesCount = this._showingAllMoviesCount;
    this._showingAllMoviesCount = this._showingAllMoviesCount + Count.SHOWING_ALL_MOVIES_COUNT_BY_BUTTON;

    this._renderMovies(this._sortedMovies.slice(prevAllMoviesCount, this._showingAllMoviesCount));

    if (this._showingAllMoviesCount >= this._sortedMovies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderTopRatedMovies() {
    const topRatedMovies = getSortedMovies(
        this._moviesModel.getMoviesAll().filter((movie) => movie.rating),
        SortType.RATING
    ).slice(0, Count.EXTRA_MOVIES_COUNT);

    if (topRatedMovies.length) {
      const extraMoviesContainerComponent = new ExtraMoviesContainerComponent(ExtraMoviesListName.TOP_RATED);
      render(this._container.getElement(), extraMoviesContainerComponent);
      this._renderMovies(topRatedMovies, extraMoviesContainerComponent.getElement().querySelector(`.films-list__container`));
    }
  }

  _renderMostCommentedMovies() {
    const mostCommentedTitleElement = [...this._container.getElement().querySelectorAll(`.films-list__title`)].find((listTitle) => listTitle.textContent.includes(ExtraMoviesListName.MOST_COMMENTED));

    if (mostCommentedTitleElement) {
      mostCommentedTitleElement.parentElement.remove();
    }

    const mostCommentedMovies = getSortedMovies(
        this._moviesModel.getMoviesAll().filter((movie) => movie.comments.length),
        SortType.COMMENTS
    ).slice(0, Count.EXTRA_MOVIES_COUNT);

    if (mostCommentedMovies.length) {
      const extraMoviesContainerComponent = new ExtraMoviesContainerComponent(ExtraMoviesListName.MOST_COMMENTED);
      render(this._container.getElement(), extraMoviesContainerComponent);
      this._renderMovies(mostCommentedMovies, extraMoviesContainerComponent.getElement().querySelector(`.films-list__container`));
    }
  }
}
