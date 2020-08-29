import moment from "moment";
import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
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

const getGenres = (films) => {
  return films.reduce((acc, {genres}) => {
    [...genres].forEach((it) => {
      if (!acc.includes(it)) {
        acc.push(it);
      }
    });
    return acc;
  }, []);
};

const getFilmsByGenre = (genre, films) => {
  const filteredFilms = films.filter((film) => film.genres.includes(genre));
  return filteredFilms.length;
};

const getTopGenre = (films) => {
  return getGenres(films).reduce((acc, genre) => getFilmsByGenre(genre, films) > getFilmsByGenre(acc, films) ? genre : acc);
};

const getTotalRuntime = (films) => {
  return films.reduce((acc, {duration}) => acc.add(duration), moment.duration(0, `minutes`));
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

const getFilmsByPeriod = (films, period) => {
  const initialDate = getInitialDateByPeriod(period);
  if (initialDate) {
    return films.filter((film) => moment(film.watchDate).isSameOrAfter(initialDate));
  } else {
    return films;
  }
};

const renderChart = (ctx, films) => {
  const genres = getGenres(films);
  ctx.height = BAR_HEIGHT * genres.length;

  const myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genres.map((genre) => getFilmsByGenre(genre, films)),
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

const createStatisticsTemplate = (totalFilms, films, period) => {

  const userRank = getUserRank(totalFilms.length);
  const periodsMarkup = createPeriodsMarkup(period);

  let filmsDataMarkup;
  if (!films.length) {
    filmsDataMarkup = `<p>No movies watched during this period</p>`;
  } else {
    const totalHours = Math.floor(getTotalRuntime(films).asHours());
    const totalMinutes = getTotalRuntime(films).minutes();
    const topGenre = getTopGenre(films);
    filmsDataMarkup = (
      `<ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
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
      ${filmsDataMarkup}
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(films) {
    super();

    this._films = films;
    this._shownFilms = films;
    this._period = `all-time`;


    this._chart = null;
    this._renderChart();
    this._subscribeOnEvents();

  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this._shownFilms, this._period);
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
    const films = this._shownFilms;

    this._chart = renderChart(statisticsCtx, films);
  }

  // _resetCharts() {
  //   this._films = films;
  //   this._shownFilms = films;
  //   this._period = `all-time`;


  //   this._chart = null;
  //   this.rerender();
  // }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        evt.preventDefault();
        this._period = evt.target.value;
        this._shownFilms = getFilmsByPeriod(this._films, evt.target.value);
        this.rerender();
      });
  }

}
