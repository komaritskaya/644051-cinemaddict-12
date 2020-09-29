import FilterComponent from '../components/main-navigation';
import {FilterType} from '../utils/filter';
import {render, replace} from '../utils/render';
import {getMoviesByFilter} from '../utils/filter';

export default class FilterController {
  constructor(container, moviesModel, statsClickHandler, statsBlurHandler) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._mode = `page`;

    this._statsClickHandler = statsClickHandler;
    this._statsBlurHandler = statsBlurHandler;

    this._activeFilterType = FilterType.ALL.shortName;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
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

    this._filterComponent = new FilterComponent(filters, this._mode);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (this._statsClickHandler) {
      this._filterComponent.setStatsClickHandler(() => {
        this._statsClickHandler();
        this._mode = `stats`;
      });
    }

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    if (this._mode === `stats`) {
      this._statsBlurHandler();
      this._mode = `page`;
    }

    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  setStatsClickHandler(handler) {
    this._statsClickHandler = handler;
    this._filterComponent.setStatsClickHandler(() => {
      this._statsClickHandler();
      this._mode = `stats`;
    });
  }
}
