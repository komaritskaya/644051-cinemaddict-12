import AbstractComponent from "./abstract-component";

const createMoviesSectionTemplate = () => (
  `<section class="films"></section>`
);

export default class MoviesSection extends AbstractComponent {
  getTemplate() {
    return createMoviesSectionTemplate();
  }
}
