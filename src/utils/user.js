export const getUserRank = (watchedFilmsCount) => {
  if (!watchedFilmsCount) {
    return ``;
  } else if (watchedFilmsCount <= 10) {
    return `Novice`;
  } else if (watchedFilmsCount > 10 && watchedFilmsCount <= 20) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};
