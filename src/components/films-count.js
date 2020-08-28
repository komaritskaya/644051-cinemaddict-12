import AbstractComponent from "./abstract-component";

const createFilmsCountTemplate = (count) => (
  `<p>${count} movies inside</p>`
);

export default class FilmsCount extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFilmsCountTemplate(this._count);
  }
}
