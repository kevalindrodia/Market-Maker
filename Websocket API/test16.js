function getRandomNumberWithDecimals(min, max, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.floor(Math.random() * (max - min + 1) * factor) / factor + min;
}

const minValue = 14;
const maxValue = 30;

let currentValue = getRandomNumberWithDecimals(minValue, maxValue, 2);
let iterationsRemaining = 1;
let nextValue = getRandomNumberWithDecimals(minValue, maxValue, 2);

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

(async () => {
  while (true) {
    console.log(currentValue);

    if (iterationsRemaining > 0) {
      iterationsRemaining--;
    } else {
      currentValue = nextValue;
      nextValue = getRandomNumberWithDecimals(minValue, maxValue, 2);
      iterationsRemaining = 1;
      await sleep(1000); // Wait for 3 seconds
    }
  }
})();
