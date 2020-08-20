const filterNames = [
  {
    longName: `All movies`,
    shortName: `all`,
  },
  {
    longName: `Watchlist`,
    shortName: `watchlist`,
  },
  {
    longName: `History`,
    shortName: `history`,
  },
  {
    longName: `Favorites`,
    shortName: `favorites`,
  },
];

export const generateFilters = () => {
  const filters = filterNames.map((name) => (
    Object.assign(name, {count: Math.floor(Math.random() * 10)}))
  );
  return filters;
};
