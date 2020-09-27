import FilterComponent from "../components/main-navigation.js";
import {FilterType} from "../utils/filter.js";
import {render, replace} from "../utils/render.js";
import {getMoviesByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, moviesModel, pageController, statsComponent) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._mode = `page`;

    this._pageController = pageController;
    // this._sortComponent = sortComponent;
    this._statsComponent = statsComponent;

    this._activeFilterType = FilterType.ALL.shortName;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    // this.setStatsClickHandler = this.setStatsClickHandler.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
    // this._subscribeOnEvents();
  }

  render(mode) {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allMovies, filterType.shortName).length,
        checked: filterType.shortName === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters, mode);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (this._statsClickHandler) {
      this._filterComponent.setStatsClickHandler(this._statsClickHandler);
    }

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent);
    }

    this._subscribeOnEvents();
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  _subscribeOnEvents() {
    this._filterComponent.setStatsClickHandler(() => {

      switch (this._mode) {
        case `page`:
          this._pageController.hide();
          this._statsComponent.show();
          this._mode = `stats`;
          break;
        case `stats`:
          this._pageController.show();
          this._statsComponent.hide();
          this._mode = `page`;
          break;
      }
      this.render(this._mode);
    });
  }
}
