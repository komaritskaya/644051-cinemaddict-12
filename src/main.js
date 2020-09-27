import UserInfoComponent from './components/user-info';
import FilterController from "./controllers/filter.js";
import MoviesSectionComponent from './components/movies-section';
import MoviesCountComponent from './components/movies-count';
import StatisticsComponent from "./components/statistics.js";
import MoviesModel from './models/movies';
import {render} from './utils/render';
import PageController from './controllers/page';
import API from './api.js';

const AUTHORIZATION = `Basic 12345`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    const watchedMovies = moviesModel.getMoviesAll().filter(({isWatched}) => isWatched);

    const bodyElement = document.querySelector(`body`);
    const headerElement = bodyElement.querySelector(`.header`);
    const mainElement = bodyElement.querySelector(`.main`);

    render(headerElement, new UserInfoComponent(watchedMovies.length));

    const moviesSectionComponent = new MoviesSectionComponent();

    const pageController = new PageController(moviesSectionComponent, moviesModel, api);
    const statisticsComponent = new StatisticsComponent(watchedMovies);
    const filterController = new FilterController(mainElement, moviesModel, pageController, statisticsComponent);
    filterController.render();

    render(mainElement, statisticsComponent);
    statisticsComponent.hide();

    render(mainElement, moviesSectionComponent);

    pageController.render();

    const footerStatisticsElement = document.querySelector(`.footer__statistics`);
    render(footerStatisticsElement, new MoviesCountComponent(moviesModel.getMoviesAll().length));


    // filterController.setStatsClickHandler(() => {
    //   pageController.hide();
    //   statisticsComponent.show();
    // });

  });
