import moment from 'moment';
import Chart from 'chart.js';
import AbstractSmartComponent from './abstract-smart-component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank} from '../utils/user';

const BAR_HEIGHT = 50;
const PERIODS = [`All time`, `Today`, `Week`, `Month`, `Year`];

const getInitialDateByPeriod = (period) => {
  switch (period) {
    case `today`:
      return moment().startOf(`day`);
    case `week`:
      return moment().startOf(`week`);
    case `month`:
      return moment().startOf(`month`);
    case `year`:
      return moment().startOf(`year`);
    default:
      return null;
  }
};

const getGenres = (movies) => {
  return movies.reduce((acc, {genres}) => {
    [...genres].forEach((it) => {
      if (!acc.includes(it)) {
        acc.push(it);
      }
    });
    return acc;
  }, []);
};

const getMoviesByGenre = (genre, movies) => {
  const filteredMovies = movies.filter((movie) => movie.genres.includes(genre));
  return filteredMovies.length;
};

const getTopGenre = (movies) => {
  return getGenres(movies).reduce((acc, genre) => getMoviesByGenre(genre, movies) > getMoviesByGenre(acc, movies) ? genre : acc);
};

const getTotalRuntime = (movies) => {
  return movies.reduce((acc, {duration}) => acc.add(duration), moment.duration(0, `minutes`));
};

const createPeriodsMarkup = (currentPeriod) => {
  return PERIODS.map((it) => {
    const name = it.toLowerCase().replace(/\s/, `-`);
    return (
      `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${name}" value="${name}" ${name === currentPeriod ? `checked` : ``}>
      <label for="statistic-${name}" class="statistic__filters-label">${it}</label>`
    );
  }).join(`\n`);
};

const getMoviesByPeriod = (movies, period) => {
  const initialDate = getInitialDateByPeriod(period);
  if (initialDate) {
    return movies.filter((movie) => moment(movie.watchDate).isSameOrAfter(initialDate));
  } else {
    return movies;
  }
};

const renderChart = (ctx, movies) => {
  const genres = getGenres(movies);
  ctx.height = BAR_HEIGHT * genres.length;

  const myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genres.map((genre) => getMoviesByGenre(genre, movies)),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
        barThickness: 24,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

  return myChart;
};

const createStatisticsTemplate = (totalMovies, movies, period) => {

  const userRank = getUserRank(totalMovies.length);
  const periodsMarkup = createPeriodsMarkup(period);

  let moviesDataMarkup;
  if (!movies.length) {
    moviesDataMarkup = `<p>No movies watched during this period</p>`;
  } else {
    const totalHours = Math.floor(getTotalRuntime(movies).asHours());
    const totalMinutes = getTotalRuntime(movies).minutes();
    const topGenre = getTopGenre(movies);
    moviesDataMarkup = (
      `<ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${movies.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>`
    );
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${periodsMarkup}
      </form>
      ${moviesDataMarkup}
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(movies) {
    super();

    this._movies = movies;
    this._shownMovies = movies;
    this._period = `all-time`;


    this._chart = null;
    this._renderChart();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createStatisticsTemplate(this._movies, this._shownMovies, this._period);
  }

  show() {
    super.show();

    this.rerender();
  }

  hide() {
    super.hide();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._renderChart();
  }

  _renderChart() {
    const statisticsCtx = this.getElement().querySelector(`.statistic__chart`);
    const movies = this._shownMovies;

    this._chart = renderChart(statisticsCtx, movies);
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        evt.preventDefault();
        this._period = evt.target.value;
        this._shownMovies = getMoviesByPeriod(this._movies, evt.target.value);
        this.rerender();
      });
  }

}
