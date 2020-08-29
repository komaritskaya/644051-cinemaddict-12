import AbstractComponent from "./abstract-component";

const createFilterMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const countMarkup = name.shortName === `all` ? `` : `<span class="main-navigation__item-count">${count}</span>`;
  const activeClass = isActive ? `main-navigation__item--active` : ``;
  return (
    `<a href="#${name.shortName}" data-name="${name.shortName}" class="main-navigation__item ${activeClass}">${name.longName} ${countMarkup}</a>`
  );
};

const createMainNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const target = evt.target;

      if ((target.tagName !== `A` && target.tagName !== `SPAN`) ||
        target.classList.contains(`main-navigation__item--active`) ||
        target.parentElement.classList.contains(`main-navigation__item--active`)) {
        return;
      }

      if (this.getElement().querySelector(`.main-navigation__item--active`)) {
        this.getElement().querySelector(`.main-navigation__item--active`).classList.remove(`main-navigation__item--active`);
      }

      const filterElement = target.tagName === `A` ? target : target.parentElement;
      const filterName = filterElement.dataset.name;

      filterElement.classList.add(`main-navigation__item--active`);
      handler(filterName);
    });
  }
}
