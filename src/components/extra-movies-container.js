import AbstractComponent from "./abstract-component";

const createExtraMoviesContainerTemplate = (listTitle) => (
  `<section class="films-list--extra">
    <h2 class="films-list__title">${listTitle}</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class ExtraMoviesContainer extends AbstractComponent {
  constructor(listTitle) {
    super();

    this._listTitle = listTitle;
  }

  getTemplate() {
    return createExtraMoviesContainerTemplate(this._listTitle);
  }
}
