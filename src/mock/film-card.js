import {nanoid} from 'nanoid';
import {generateComments} from './comment';
import {
  getSingleRandomItemFromArray,
  getMultipleRandomItemsFromArray,
  getRandomInt,
  getRandomNumberWithDecimals,
  getRandomDate,
  getRandomText,
  getRandomBool,
} from '../utils/common';

const NAMES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Great Flamarion`,
  `Made for Each Other`,
];

const POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const GENRES = [
  `Musical`,
  `Western`,
  `Drama`,
  `Comedy`,
  `Cartoon`,
  `Mystery`,
];

const DIRECTORS = [
  `Anthony Mann`,
  `Woody Allen`,
  `Pedro Almodovar`,
  `Martin Scorsese`,
  `David Lynch`,
  `Alfred Hitchcock`,
  `Takeshi Kitano`,
];

const COUNTRIES = [
  `USA`,
  `USSR`,
  `Japan`,
  `Czechoslovakia`,
  `Spain`,
  `Mexico`,
];

const WRITERS = [
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `William Shakespeare`,
  `Stephen King`,
  `Chuck Palahniuk`,
  `J. K. Rowling`,
];

const ACTORS = [
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`,
  `Jennifer Aniston`,
  `Courteney Cox`,
  `Lisa Kudrow`,
  `Matt LeBlanc`,
  `Matthew Perry`,
  `David Schwimmer`,
];

const AGE_LIMITS = [0, 6, 12, 16, 18];

const generateDuration = () => {
  const hours = getRandomInt(0, 3);
  const minutes = hours ? getRandomInt(0, 59) : getRandomInt(10, 59);
  const hoursString = hours ? `${hours}h ` : ``;
  const minutesString = minutes ? `${minutes}m` : ``;
  return `${hoursString}${minutesString}`;
};

export const generateFilm = () => ({
  id: nanoid(),
  name: getSingleRandomItemFromArray(NAMES),
  poster: getSingleRandomItemFromArray(POSTERS),
  description: getRandomText(),
  rating: getRandomNumberWithDecimals(0, 10, 1),
  duration: generateDuration(),
  genres: getMultipleRandomItemsFromArray(GENRES),
  director: getSingleRandomItemFromArray(DIRECTORS),
  writers: getMultipleRandomItemsFromArray(WRITERS),
  actors: getMultipleRandomItemsFromArray(ACTORS),
  ageLimit: getSingleRandomItemFromArray(AGE_LIMITS),
  release: getRandomDate(new Date(1900, 1, 1), new Date()),
  country: getSingleRandomItemFromArray(COUNTRIES),
  comments: generateComments(getRandomInt(0, 20)),
  isInWatchList: getRandomBool(),
  isWatched: getRandomBool(),
  isFavorite: getRandomBool(),
});

export const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};
