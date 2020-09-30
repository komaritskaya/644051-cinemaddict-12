import AbstractComponent from './abstract-smart-component';
import {SortType} from '../utils/sort';

const createSortTemplate = (currentSortType) => {
  const sortOptionsMarkup = [SortType.DEFAULT, SortType.DATE, SortType.RATING].map((type) => (
    `<li>
      <a
        href="#" data-sort-type="${type}"
        class="sort__button ${type === currentSortType ? `sort__button--active` : ``}"
      >
        Sort by ${type}
      </a>
    </li>`
  )).join(``);
  return (
    `<ul class="sort">
      ${sortOptionsMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }

  changeSortType(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);

    const currentSortTypeButton = [...this.getElement().querySelectorAll(`.sort__button`)]
      .find((button) => button.dataset.sortType === sortType);
    currentSortTypeButton.classList.add(`sort__button--active`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      this.changeSortType(evt.target.dataset.sortType);
      handler(this._currentSortType);
    });
  }
}
