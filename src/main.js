import UserInfoComponent from './components/user-info';
import FilterController from "./controllers/filter.js";
import FilmsSectionComponent from './components/films-section';
import FilmsCountComponent from './components/films-count';
import FilmsModel from './models/movies';
import {render} from './utils/render';
import PageController from './controllers/page';
import {generateFilms} from './mock/film-card';

const ALL_FILMS_COUNT = 23;

const allFilms = generateFilms(ALL_FILMS_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(allFilms);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, new UserInfoComponent());

const filterController = new FilterController(mainElement, filmsModel);
filterController.render();

const filmsSectionComponent = new FilmsSectionComponent();
render(mainElement, filmsSectionComponent);

const pageController = new PageController(filmsSectionComponent, filmsModel);
pageController.render(allFilms);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FilmsCountComponent(ALL_FILMS_COUNT));
