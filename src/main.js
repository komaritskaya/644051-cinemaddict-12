import UserInfoComponent from './components/user-info';
import MainNavigationComponent from './components/main-navigation';
import SortComponent from './components/sort';
import FilmsSectionComponent from './components/films-section';
import FilmsCountComponent from './components/films-count';
import {render} from "./utils/render";
import PageController from "./controllers/page.js";
import {generateFilms} from './mock/film-card';
import {generateFilters} from './mock/filter';

const ALL_FILMS_COUNT = 23;

const allFilms = generateFilms(ALL_FILMS_COUNT);
const filters = generateFilters();

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, new UserInfoComponent());
render(mainElement, new MainNavigationComponent(filters));
render(mainElement, new SortComponent());

const filmsSectionComponent = new FilmsSectionComponent();
render(mainElement, filmsSectionComponent);

const pageController = new PageController(filmsSectionComponent);
pageController.render(allFilms);

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FilmsCountComponent(ALL_FILMS_COUNT));
