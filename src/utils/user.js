export const getUserRank = (watchedMoviesCount) => {
  if (!watchedMoviesCount) {
    return ``;
  } else if (watchedMoviesCount <= 10) {
    return `Novice`;
  } else if (watchedMoviesCount > 10 && watchedMoviesCount <= 20) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};
