const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomNumberWithDecimals = (min, max, decimals) => {
  return ((Math.random() * (max - min)) + min).toFixed(decimals);
};

export const getRandomBool = () => {
  return Math.random() < 0.5;
};

export const getSingleRandomItemFromArray = (arr) => {
  return arr[getRandomInt(0, arr.length - 1)];
};

export const getMultipleRandomItemsFromArray = (arr) => {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (getRandomBool()) {
      newArr.push(arr[i]);
    }
  }
  if (newArr.length === 0) {
    newArr.push(getSingleRandomItemFromArray(arr));
  }
  return newArr;
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomSentences = LOREM_TEXT.split(`. `);

export const getRandomSentence = () => getSingleRandomItemFromArray(randomSentences);

export const getRandomText = () => getMultipleRandomItemsFromArray(randomSentences).join(`. `);
