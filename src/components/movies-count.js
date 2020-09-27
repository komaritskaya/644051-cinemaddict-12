import AbstractComponent from "./abstract-component";

const createMoviesCountTemplate = (count) => (
  `<p>${count || `No`} movies inside</p>`
);

export default class MoviesCount extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createMoviesCountTemplate(this._count);
  }
}
