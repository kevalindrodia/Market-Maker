//to test the prices and quantity
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
      const usdtToSpend = 0.1;
      const marketInfo = await restapiAcc1.getMarket('ARY_USDT');
      const ltp = parseFloat(marketInfo.lastPrice);
      // const buyQuantity = usdtToSpend * ltp;
      // const sellQuantity = buyQuantity;
      // const buyPrice = 0.05
      // const sellPrice = buyPrice;
      const buyQuantity = 0.5;
      const sellQuantity = buyQuantity
      const buyPrice = ltp * 0.5; // as the quantity is half the price will also be half
      const sellPrice = buyPrice;
    //   // Calculate buy and sell quantities
    //   const buyQuantity = usdtToSpend / (ltp - 0.04);
    //   const sellQuantity = usdtToSpend / (ltp - 0.04);

    //   // Calculate corresponding quantity in ARY
    //   const arQuantity = usdtToSpend / (ltp - 0.04);

    //   // Calculate buy and sell prices
    //   const buyPrice = (arQuantity * (ltp - 0.01));
    //   const sellPrice = (arQuantity * (ltp - 0.04));

      console.log('Acc1 Buy Order:');
      console.log('  Quantity:', buyQuantity);
      console.log('  Price:', buyPrice);

      console.log('Acc2 Sell Order:');
      console.log('  Quantity:', sellQuantity);
      console.log('  Price:', sellPrice);

      // Wait for the specified interval before the next iteration
      await new Promise((resolve) => setTimeout(resolve, iterationInterval));
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();