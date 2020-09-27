import AbstractComponent from "./abstract-component";

// const NUMBER_TYPE = `number`;

const createTitleMarkup = (moviesCount) => {
  // let headlineMarkup = ``;
  if (typeof moviesCount === `number`) {
    return moviesCount ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>` : ``;
  } else {
    return `<h2 class="films-list__title">Loading...</h2>`;
  }
};

const createContainerMarkup = (moviesCount) => moviesCount ? `<div class="films-list__container">\n</div>` : ``;

const createAllMoviesContainerTemplate = (moviesCount) => {
  const titleMarkup = createTitleMarkup(moviesCount);
  const moviesListContainerMarkup = createContainerMarkup(moviesCount);
  return (
    `<section class="films-list">
      ${titleMarkup}
      ${moviesListContainerMarkup}
    </section>`
  );
};

export default class AllMoviesContainer extends AbstractComponent {
  constructor(moviesCount) {
    super();

    this._moviesCount = moviesCount;
  }

  getTemplate() {
    return createAllMoviesContainerTemplate(this._moviesCount);
  }

  onMoviesLoad(moviesCount) {
    const titleMarkup = createTitleMarkup(moviesCount);
    const movieListContainerMarkup = createContainerMarkup(moviesCount);

    this.getElement().firstElementChild.innerHTML = `${titleMarkup}${movieListContainerMarkup}`;
  }
}
