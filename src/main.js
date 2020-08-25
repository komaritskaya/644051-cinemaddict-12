import UserInfoComponent from './components/user-info';
import MainNavigationComponent from './components/main-navigation';
import SortComponent from './components/sort';
import Comment from './components/comment';
import FilmsSectionComponent from './components/films-section';
import AllFilmsContainerComponent from './components/all-films-container';
import ExtraFilmsContainerComponent from './components/extra-films-container';
import FilmCardComponent from './components/film-card';
import ShowMoreButtonComponent from './components/show-more-btn';
import FilmsCountComponent from './components/films-count';
import FilmDetailsComponent from './components/film-details';
import NoFilmsComponent from './components/no-films';
import {generateFilms} from './mock/film-card';
import {generateFilters} from './mock/filter';
import {generateComments} from './mock/comment';
import {render, RenderPosition, KeyCode} from "./utils.js";

const ALL_FILMS_COUNT = 23;
const SHOWING_ALL_FILMS_COUNT_ON_START = 5;
const SHOWING_ALL_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_FILMS_COUNT = 2;
const EXTRA_FILMS_LISTS = [`Top rated`, `Most commented`];

const renderComments = (filmDetailsComponent, film) => {
  const comments = generateComments(film.commentsCount);
  const commentsListElement = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  comments.slice(0, comments.length)
  .forEach((comment) => render(commentsListElement, new Comment(comment).getElement(), RenderPosition.BEFOREEND));
};

const renderFilm = (filmsListElement, film) => {
  const onOpenButtonClick = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onCloseButtonClick = () => {
    bodyElement.removeChild(filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.keyCode === KeyCode.ESC_KEY;

    if (isEscKey) {
      bodyElement.removeChild(filmDetailsComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmCardComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const filmTitleElement = filmCardComponent.getElement().querySelector(`.film-card__title`);
  filmTitleElement.addEventListener(`click`, onOpenButtonClick);

  const filmPosterElement = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  filmPosterElement.addEventListener(`click`, onOpenButtonClick);

  const filmCommentsElement = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  filmCommentsElement.addEventListener(`click`, onOpenButtonClick);

  const closeButtonElement = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButtonElement.addEventListener(`click`, onCloseButtonClick);

  renderComments(filmDetailsComponent, film);

  render(filmsListElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderAllFilmsList = (filmsContainerComponent, films) => {
  let showingAllFilmsCount = SHOWING_ALL_FILMS_COUNT_ON_START;
  const filmsContainerElement = filmsContainerComponent.getElement().querySelector(`.films-list__container`);

  films.slice(0, showingAllFilmsCount)
  .forEach((film) => renderFilm(filmsContainerElement, film));

  const allFilmsListElement = filmsSectionElement.querySelector(`.films-list`);

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(allFilmsListElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevAllFilmsCount = showingAllFilmsCount;
    showingAllFilmsCount = prevAllFilmsCount + SHOWING_ALL_FILMS_COUNT_BY_BUTTON;

    allFilms.slice(prevAllFilmsCount, showingAllFilmsCount)
    .forEach((film) => renderFilm(filmsContainerElement, film));

    if (showingAllFilmsCount >= allFilms.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
};

const renderExtraFilmsList = (filmsContainerComponent, films) => {
  let showingExtraFilmsCount = EXTRA_FILMS_COUNT;
  const filmsContainerElement = filmsContainerComponent.getElement().querySelector(`.films-list__container`);

  films.slice(0, showingExtraFilmsCount)
    .forEach((film) => renderFilm(filmsContainerElement, film));
};

const allFilms = generateFilms(ALL_FILMS_COUNT);
const filters = generateFilters();

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);

render(headerElement, new UserInfoComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new MainNavigationComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsSectionComponent().getElement(), RenderPosition.BEFOREEND);

const filmsSectionElement = mainElement.querySelector(`.films`);

const allFilmsContainerComponent = new AllFilmsContainerComponent();
const noFilmsComponent = new NoFilmsComponent();
render(filmsSectionElement, allFilmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

if (allFilms.length) {
  renderAllFilmsList(allFilmsContainerComponent, allFilms);

  EXTRA_FILMS_LISTS.forEach((list) => {
    const extraFilmsContainerComponent = new ExtraFilmsContainerComponent(list);
    const extraFilms = generateFilms(EXTRA_FILMS_COUNT);
    render(filmsSectionElement, extraFilmsContainerComponent.getElement(), RenderPosition.BEFOREEND);
    renderExtraFilmsList(extraFilmsContainerComponent, extraFilms);
  });
} else {
  render(filmsSectionElement, noFilmsComponent.getElement(), RenderPosition.BEFOREEND);
}

const footerStatisticsElement = document.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new FilmsCountComponent(ALL_FILMS_COUNT).getElement(), RenderPosition.BEFOREEND);
