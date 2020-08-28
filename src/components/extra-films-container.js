import AbstractComponent from "./abstract-component";

const createExtraFilmsContainerTemplate = (listTitle) => (
  `<section class="films-list--extra">
    <h2 class="films-list__title">${listTitle}</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class ExtraFilmsContainer extends AbstractComponent {
  constructor(listTitle) {
    super();

    this._listTitle = listTitle;
  }

  getTemplate() {
    return createExtraFilmsContainerTemplate(this._listTitle);
  }
}
