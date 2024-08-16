import xeggexApi from './xeggexApi.js';
import dotenv from 'dotenv';

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;
const acc2ApiKey = process.env.VipulApiKey;
const acc2ApiSecret = process.env.VipulApiSecret;

const restapiAcc1 = new xeggexApi(acc1ApiKey, acc1ApiSecret);
const restapiAcc2 = new xeggexApi(acc2ApiKey, acc2ApiSecret);
const iterationInterval = 1000; // Interval between iterations in milliseconds

(async () => {
  try {
    let buyingAcc = 'acc1'; // Start with acc1 buying and acc2 selling

    while (true) {
      const tradeQuantity = 0.1;
      // Fetch market information for the ARY/USDT trading pair
      const marketInfo = await restapiAcc1.getMarket('ARY_USDT');
      const ltp = parseFloat(marketInfo.lastPrice);
      console.log(ltp);
      // Calculate buy and sell quantities
      const buyQuantity = tradeQuantity / ltp;
      const sellQuantity = tradeQuantity / ltp;

      // Calculate buy and sell prices
      const baseBuyPrice = ltp - 0.001;
      const baseSellPrice = ltp - 0.001;
      const buyPrice = baseBuyPrice * buyQuantity;
      const sellPrice = baseSellPrice * sellQuantity;

      if (buyingAcc === 'acc1') {
        // Buy from acc1
        const buyOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'buy', tradeQuantity, buyPrice);
        console.log('Acc1 Buy Order:', buyOrderAcc1);
        
        // Wait for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Sell from acc2
        const sellOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'sell', tradeQuantity, sellPrice);
        console.log('Acc2 Sell Order:', sellOrderAcc2);
      } else {
        // Buy from acc2
        const buyOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'buy', tradeQuantity, buyPrice);
        console.log('Acc2 Buy Order:', buyOrderAcc2);
        
        // Wait for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Sell from acc1
        const sellOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'sell', tradeQuantity, sellPrice);
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
