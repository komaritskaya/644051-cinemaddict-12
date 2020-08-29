import UserInfoComponent from './components/user-info';
import FilterController from "./controllers/filter.js";
import FilmsSectionComponent from './components/films-section';
import FilmsCountComponent from './components/films-count';
import StatisticsComponent from "./components/statistics.js";
import FilmsModel from './models/movies';
import {render} from './utils/render';
import PageController from './controllers/page';
import {generateFilms} from './mock/film-card';

const ALL_FILMS_COUNT = 23;

const allFilms = generateFilms(ALL_FILMS_COUNT);
const watchedFilms = allFilms.filter(({isWatched}) => isWatched);
const filmsModel = new FilmsModel();
filmsModel.setFilms(allFilms);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, new UserInfoComponent(watchedFilms.length));

const filmsSectionComponent = new FilmsSectionComponent();
const pageController = new PageController(filmsSectionComponent, filmsModel);
const statisticsComponent = new StatisticsComponent(watchedFilms);
const filterController = new FilterController(mainElement, filmsModel, pageController, statisticsComponent);
filterController.render();

render(mainElement, statisticsComponent);
statisticsComponent.hide();

render(mainElement, filmsSectionComponent);

pageController.render(allFilms);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FilmsCountComponent(ALL_FILMS_COUNT));

// filterController.setStatsClickHandler(() => {
//   pageController.hide();
//   statisticsComponent.show();
// });
