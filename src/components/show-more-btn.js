import AbstractComponent from './abstract-component';

const createShowMoreButtonTemplate = () => (
  `<button class="films-list__show-more">Show more</button>`
);

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
