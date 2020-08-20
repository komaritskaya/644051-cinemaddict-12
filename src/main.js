import {createUserInfoTemplate} from './components/user-info';
import {createMainNavigationTemplate} from './components/main-navigation';
import {createSortTemplate} from './components/sort';
import {createFilmsSectionTemplate} from './components/films-section';
import {createAllFilmsContainerTemplate} from './components/all-films-container';
import {createExtraFilmsContainerTemplate} from './components/extra-films-container';
import {createFilmCardTemplate} from './components/film-card';
import {createShowMoreButtonTemplate} from './components/show-more-btn';
import {createFilmsCountTemplate} from './components/films-count';
import {createFilmDetailsTemplate} from './components/film-details';
import {generateFilm, generateFilms} from './mock/film-card';
import {generateFilters} from './mock/filter';

const ALL_FILMS_COUNT = 23;
const SHOWING_ALL_FILMS_COUNT_ON_START = 5;
const SHOWING_ALL_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_COUNT = 2;
const EXTRA_FILMS_LISTS = [`Top rated`, `Most commented`];

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const allFilms = generateFilms(ALL_FILMS_COUNT);
const filters = generateFilters();

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, createUserInfoTemplate());
render(mainElement, createMainNavigationTemplate(filters));
render(mainElement, createSortTemplate());
render(mainElement, createFilmsSectionTemplate());

const filmsSectionElement = mainElement.querySelector(`.films`);

render(filmsSectionElement, createAllFilmsContainerTemplate());

const allFilmsContainerElement = mainElement.querySelector(`.films-list__container`);
let showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;

allFilms.slice(0, showingAllFilmsCount)
  .forEach((film) => render(allFilmsContainerElement, createFilmCardTemplate(film)));

const allFilmsListElement = filmsSectionElement.querySelector(`.films-list`);
render(allFilmsListElement, createShowMoreButtonTemplate());

const showMoreButtonElement = allFilmsListElement.querySelector(`.films-list__show-more`);

showMoreButtonElement.addEventListener(`click`, () => {
  const prevAllFilmsCount = showingAllFilmsCount;
  showingAllFilmsCount = prevAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

  allFilms.slice(prevAllFilmsCount, showingAllFilmsCount)
    .forEach((film) => render(allFilmsContainerElement, createFilmCardTemplate(film)));

  if (showingAllFilmsCount >= allFilms.length) {
    showMoreButtonElement.remove();
  }
});

EXTRA_FILMS_LISTS.forEach((list) => {
  render(filmsSectionElement, createExtraFilmsContainerTemplate(list));
});

const extraFilmsContainerElements = mainElement.querySelectorAll(`.films-list--extra .films-list__container`);
extraFilmsContainerElements.forEach((element) => {
  const extraFilms = generateFilms(EXTRA_FILMS_COUNT);
  extraFilms.slice(0, EXTRA_FILMS_COUNT)
    .forEach((film) => render(element, createFilmCardTemplate(film)));
});

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsCountTemplate(ALL_FILMS_COUNT));

render(bodyElement, createFilmDetailsTemplate(generateFilm()));
const filmDetailsElement = bodyElement.querySelector(`.film-details`);
filmDetailsElement.style.display = `none`;
