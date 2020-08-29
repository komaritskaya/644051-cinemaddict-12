import {nanoid} from 'nanoid';
import {
  getSingleRandomItemFromArray,
  getRandomDate,
  getRandomSentence,
} from '../utils/common';

const EMOJI = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const USERS = [
  `Tim Macoveev`,
  `John Doe`,
  `Elon Musk`,
  `Boris Yeltsin`,
  `Johnny Knoxville`,
  `Che Guevara`,
  `Che Burashka`,
];

export const generateComment = () => ({
  id: nanoid(),
  user: getSingleRandomItemFromArray(USERS),
  emoji: getSingleRandomItemFromArray(EMOJI),
  date: getRandomDate(new Date(2019, 1, 1), new Date()),
  text: getRandomSentence(),
});

export const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};
