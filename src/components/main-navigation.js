const createFilterMarkup = (filter, isActive) => {
  const {longName, shortName, count} = filter;
  return (
    `<a href="#${shortName}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${longName} ${shortName === `all` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

export const createMainNavigationTemplate = (filters) => {
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
