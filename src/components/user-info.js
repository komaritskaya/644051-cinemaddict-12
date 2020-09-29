import AbstractComponent from './abstract-component';
import {getUserRank} from '../utils/user';

const createUserInfoTemplate = (watchedMoviesCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(watchedMoviesCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserInfo extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createUserInfoTemplate(this._count);
  }
}
