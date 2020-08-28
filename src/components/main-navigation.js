import AbstractComponent from "./abstract-component";

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

export default class MainNavigation extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }
}
