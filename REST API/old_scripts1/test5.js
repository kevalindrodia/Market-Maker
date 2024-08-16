import xeggexApi from './xeggexApi.js';
import dotenv from 'dotenv';

dotenv.config();

const acc2ApiKey = process.env.NileshApiKey;
const acc2ApiSecret = process.env.NileshApiSecret;
const acc1ApiKey = process.env.VipulApiKey;
const acc1ApiSecret = process.env.VipulApiSecret;

const restapiAcc1 = new xeggexApi(acc1ApiKey, acc1ApiSecret);
const restapiAcc2 = new xeggexApi(acc2ApiKey, acc2ApiSecret);
const iterationInterval = 2000; // Interval between iterations in milliseconds

function getRandomPriceChange(min, max) {
  return Math.random() * (max - min) + min;
}

(async () => {
  try {
    let buyingAcc = 'acc1'; // Start with acc1 buying and acc2 selling

    while (true) {
      const usdtToSpend = 0.1;
      const marketInfo = await restapiAcc1.getMarket('ARY_USDT');
      const ltp = parseFloat(marketInfo.lastPrice);

      // Calculate buy and sell quantities
      const buyQuantity = 1;
      const sellQuantity = buyQuantity;

      // Calculate buy and sell prices
/*       const baseBuyPrice = getRandomPriceChange(0.09100, 0.09999); // Random change within range
      const buyPriceChange = getRandomPriceChange(-0.00005, 0.00005); // Random change for price
      const buyPrice = (baseBuyPrice + buyPriceChange); */
      const buyPrice = 0.095024;
      const sellPrice = buyPrice;

      console.log(buyQuantity, buyPrice);
      console.log(sellQuantity, sellPrice);
      if (buyingAcc === 'acc1') {
        // Buy from acc1 and sell from acc2
        const buyOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'buy', buyQuantity, buyPrice);
        console.log('Acc1 Buy Order:', buyOrderAcc1);

        const sellOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'sell', sellQuantity, sellPrice);
        console.log('Acc2 Sell Order:', sellOrderAcc2);
      } else {
        // Buy from acc2 and sell from acc1
        const buyOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'buy', buyQuantity, buyPrice);
        console.log('Acc2 Buy Order:', buyOrderAcc2);

        const sellOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'sell', sellQuantity, sellPrice);
        console.log('Acc1 Sell Order:', sellOrderAcc1);
      }

      console.log('Buy and Sell orders executed');

      // Switch roles for the next iteration
      buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';

      // Wait for the specified interval before the next iteration
      await new Promise((resolve) => setTimeout(resolve, iterationInterval));
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
