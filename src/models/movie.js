import moment from 'moment';

export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`];
    this.alternativeName = data[`film_info`][`alternative_title`];
    this.poster = data[`film_info`][`poster`];
    this.description = data[`film_info`][`description`];
    this.rating = data[`film_info`][`total_rating`];
    this.duration = moment.duration(data[`film_info`][`runtime`], `minutes`);
    this.genres = data[`film_info`][`genre`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.ageLimit = data[`film_info`][`age_rating`];
    this.release = new Date(data[`film_info`][`release`][`date`]);
    this.country = data[`film_info`][`release`][`release_country`];
    this.comments = data[`comments`];
    this.isInWatchList = data[`user_details`][`watchlist`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.watchDate = new Date(data[`user_details`][`watching_date`]);
    this.isFavorite = data[`user_details`][`favorite`];
  }

  toRAW(clone = false) {
    return {
      "id": this.id,
      "comments": clone ? this.comments : this.comments.map(({id}) => id),
      // "comments": [],
      "film_info": {
        "title": this.name,
        "alternative_title": this.alternativeName,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageLimit,
        "director": this.director,
        "writers": [...this.writers],
        "actors": [...this.actors],
        "release": {
          "date": this.release.toISOString(),
          "release_country": this.country,
        },
        "runtime": this.duration.asMinutes(),
        "genre": [...this.genres],
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.isInWatchList,
        "already_watched": this.isWatched,
        "watching_date": this.watchDate.toISOString(),
        "favorite": this.isFavorite,
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW(true));
  }
}
