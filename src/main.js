import UserInfoComponent from './components/user-info';
import FilterController from "./controllers/filter.js";
import AllMoviesContainerComponent from './components/all-movies-container';
import MoviesCountComponent from './components/movies-count';
import StatisticsComponent from "./components/statistics.js";
import MoviesModel from './models/movies';
import {render, replace} from './utils/render';
import PageController from './controllers/page';
import API from './api.js';

const AUTHORIZATION = `Basic 12345`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const showStats = (movies) => {
  const statsComponent = new StatisticsComponent(movies);
  render(mainElement, statsComponent);
  pageController.hide();
};

const hideStats = () => {
  const statsElement = bodyElement.querySelector(`.statistic`);
  statsElement.remove();
  pageController.show();
};

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const watchedMovies = moviesModel.getMoviesAll().filter(({isWatched}) => isWatched);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const allMoviesContainerComponent = new AllMoviesContainerComponent();
const pageController = new PageController(allMoviesContainerComponent, moviesModel, api);

const filterController = new FilterController(mainElement, moviesModel, () => showStats(watchedMovies), hideStats);
filterController.render();

render(mainElement, allMoviesContainerComponent);
pageController.render();

const moviesCountComponent = new MoviesCountComponent();

render(footerStatisticsElement, moviesCountComponent);

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    const watchedMoviesNew = moviesModel.getMoviesAll().filter(({isWatched}) => isWatched);
    const moviesCount = moviesModel.getMoviesAll().length;
    render(headerElement, new UserInfoComponent(watchedMoviesNew.length));

    allMoviesContainerComponent.onMoviesLoad(moviesCount);

    filterController.setStatsClickHandler(() => showStats(watchedMoviesNew));
    filterController.render();

    pageController.render();

    replace(new MoviesCountComponent(moviesCount), moviesCountComponent);
  })
  .catch(() => {
    const moviesCount = moviesModel.getMoviesAll().length;
    allMoviesContainerComponent.onMoviesLoad(moviesCount);
    pageController.render();
  });
