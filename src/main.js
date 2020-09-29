import UserInfoComponent from './components/user-info';
import FilterController from './controllers/filter';
import AllMoviesContainerComponent from './components/all-movies-container';
import MoviesCountComponent from './components/movies-count';
import StatisticsComponent from './components/statistics';
import MoviesModel from './models/movies';
import {render, replace} from './utils/render';
import PageController from './controllers/page';
import API from './api/index';
import Provider from './api/provider';
import Store from './api/store';

const AUTHORIZATION = `Basic 12345`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-komaritskaya-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

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
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const watchedMovies = moviesModel.getMoviesAll().filter(({isWatched}) => isWatched);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

const allMoviesContainerComponent = new AllMoviesContainerComponent();
const pageController = new PageController(allMoviesContainerComponent, moviesModel, apiWithProvider);

const filterController = new FilterController(mainElement, moviesModel, () => showStats(watchedMovies), hideStats);
filterController.render();

render(mainElement, allMoviesContainerComponent);
pageController.render();

const moviesCountComponent = new MoviesCountComponent();

render(footerStatisticsElement, moviesCountComponent);

apiWithProvider.getMovies()
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
