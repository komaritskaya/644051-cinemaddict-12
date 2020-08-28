import AbstractComponent from "./abstract-component";

const createFilmsSectionTemplate = () => (
  `<section class="films"></section>`
);

export default class FilmsSection extends AbstractComponent {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
