import xeggexApi from './xeggexApi.js';
import dotenv from 'dotenv';
import beep from 'beepbeep';
dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;
const acc2ApiKey = process.env.VipulApiKey;
const acc2ApiSecret = process.env.VipulApiSecret;

const restapiAcc1 = new xeggexApi(acc1ApiKey, acc1ApiSecret);
const restapiAcc2 = new xeggexApi(acc2ApiKey, acc2ApiSecret);
const iterationInterval = 2000; // Interval between iterations in milliseconds
const buySellGap = 1000; // Gap between buy and sell actions in milliseconds

function getRandomPriceChange(min, max) {
  return Math.random() * (max - min) + min;
}

(async () => {
  try {
    let buyingAcc = 'acc1'; // Start with acc1 buying and acc2 selling

    while (true) {
      const usdtToSpend = 0.1;
      try {
        //const ltp = parseFloat(marketInfo.lastPrice);

        // Calculate buy and sell quantities
        const buyQuantity = 7;
        const sellQuantity = buyQuantity;

        // Calculate buy and sell prices
        const buyPrice = 0.07000;
        const sellPrice = buyPrice;
        if (buyingAcc === 'acc1') {
          // Buy from acc1 and sell from acc2
          const buyOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'buy', buyQuantity, buyPrice);
          console.log('Acc1 Buy Order:', buyOrderAcc1);

          await new Promise((resolve) => setTimeout(resolve, buySellGap)); // Wait before sell action

          const sellOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'sell', sellQuantity, sellPrice);
          console.log('Acc2 Sell Order:', sellOrderAcc2);
        } else {
          // Buy from acc2 and sell from acc1
          const buyOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'buy', buyQuantity, buyPrice);
          console.log('Acc2 Buy Order:', buyOrderAcc2);

          await new Promise((resolve) => setTimeout(resolve, buySellGap)); // Wait before sell action

          const sellOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'sell', sellQuantity, sellPrice);
          console.log('Acc1 Sell Order:', sellOrderAcc1);
        }

        console.log('Buy and Sell orders executed');
        console.log("Quanity Traded:",buyQuantity)
        console.log("Traded Price:",buyPrice)
        // Switch roles for the next iteration
        buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';
        // const marketInfo = await restapiAcc1.getMarket('ARY_USDT');
        // console.log("Current Volume:",Math.round(parseFloat(marketInfo.volume)))
        // Wait for the specified interval before the next iteration
        await new Promise((resolve) => setTimeout(resolve, iterationInterval));
      } catch (error) {
        console.error('An error occurred:', error.message);
        beep(2);
        if (error.message.includes('504')) {
          console.log('Gateway Time-out occurred, waiting for 5 seconds before retrying...');
          beep(1);
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
        }else if(error.message.includes('400')){
          console.log('Bad Request occured, exiting....');
            beep(4);
            break;
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    beep(2);
  }
})();
