import {createElement} from "../utils.js";

const createExtraFilmsContainerTemplate = (listTitle) => (
  `<section class="films-list--extra">
    <h2 class="films-list__title">${listTitle}</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class ExtraFilmsContainer {
  constructor(listTitle) {
    this._listTitle = listTitle;
    this._element = null;
  }

  getTemplate() {
    return createExtraFilmsContainerTemplate(this._listTitle);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
