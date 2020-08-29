import moment from 'moment';
import AbstractComponent from "./abstract-component";

const createCommentTemplate = (comment) => {
  const {id, user, emoji, date, text} = comment;
  const formattedDate = moment(date).format(`YYYY/MM/DD hh:mm`);
  return (
    `<li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${user}</span>
          <span class="film-details__comment-day">${formattedDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();

    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }
}
