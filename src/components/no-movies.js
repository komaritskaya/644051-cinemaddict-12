import AbstractComponent from "./abstract-component";

const createNoMoviesTemplate = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};


export default class NoMovies extends AbstractComponent {
  getTemplate() {
    return createNoMoviesTemplate();
  }
}
