function getRandomPriceGenerator(min, max, stepValue, decimalPlaces) {
    let currentValue = min;
    let isIncreasing = true;

    return function () {
        if (isIncreasing) {
            currentValue += stepValue;
            if (currentValue >= max) {
                currentValue = max;
                isIncreasing = false;
            }
        } else {
            currentValue -= stepValue;
            if (currentValue <= min) {
                currentValue = min;
                isIncreasing = true;
            }
        }

        return parseFloat(currentValue.toFixed(decimalPlaces));
    };
}
function getRandomQuantity(min, max, decimalPlaces) {
    const factor = 10 ** decimalPlaces;
    return Math.floor(Math.random() * (max - min + 1) * factor) / factor + min;
  }
const getBuyPrice = getRandomPriceGenerator(0.05140, 0.05295, 0.00003, 5);

(async () => {
    while (true) {
        var buySellGap = 1000;
        var buyPrice = getBuyPrice(); // Call the function to get the calculated price
       
        var buyQuantity =  getRandomQuantity(1, 200, 2);
        console.log("Buying",buyQuantity,"ARY for",buyPrice,"USDT");
        console.log('Waiting for', buySellGap, 'ms...');
        await new Promise((resolve) => setTimeout(resolve, buySellGap));
    }
})();
