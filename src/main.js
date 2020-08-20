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

const ALL_FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;
const EXTRA_FILMS_LISTS = [`Top rated`, `Most commented`];

const render = (container, template, count = 1, place = `beforeend`) => {
  let resultTemplate = ``;
  for (let i = 0; i < count; i++) {
    resultTemplate = resultTemplate + template;
  }
  container.insertAdjacentHTML(place, resultTemplate);
};

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, createUserInfoTemplate());
render(mainElement, createMainNavigationTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createFilmsSectionTemplate());

const filmsSectionElement = mainElement.querySelector(`.films`);

render(filmsSectionElement, createAllFilmsContainerTemplate());

const allFilmsContainerElement = mainElement.querySelector(`.films-list__container`);
render(allFilmsContainerElement, createFilmCardTemplate(), ALL_FILMS_COUNT);

const allFilmsListElement = filmsSectionElement.querySelector(`.films-list`);
render(allFilmsListElement, createShowMoreButtonTemplate());

EXTRA_FILMS_LISTS.forEach((list) => {
  render(filmsSectionElement, createExtraFilmsContainerTemplate(list));
});

const extraFilmsContainerElements = mainElement.querySelectorAll(`.films-list--extra .films-list__container`);
extraFilmsContainerElements.forEach((element) => {
  render(element, createFilmCardTemplate(), EXTRA_FILMS_COUNT);
});

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFilmsCountTemplate());

render(bodyElement, createFilmDetailsTemplate());
const filmDetailsElement = bodyElement.querySelector(`.film-details`);
filmDetailsElement.style.display = `none`;
