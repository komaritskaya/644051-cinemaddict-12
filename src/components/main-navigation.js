import {createElement} from "../utils.js";

const createFilterMarkup = (filter, isActive) => {
  const {longName, shortName, count} = filter;
  const countMarkup = shortName === `all` ? `` : `<span class="main-navigation__item-count">${count}</span>`;
  const activeClass = isActive ? `main-navigation__item--active` : ``;
  return (
    `<a href="#${shortName}" class="main-navigation__item ${activeClass}">${longName} ${countMarkup}</a>`
  );
};

const createMainNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter)).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
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
