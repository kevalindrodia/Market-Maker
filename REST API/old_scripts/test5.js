import xeggexApi from '../xeggexApi';
import dotenv from 'dotenv';

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;
const acc2ApiKey = process.env.VipulApiKey;
const acc2ApiSecret = process.env.VipulApiSecret;

const restapiAcc1 = new xeggexApi(acc1ApiKey, acc1ApiSecret);
const restapiAcc2 = new xeggexApi(acc2ApiKey, acc2ApiSecret);

const iterationInterval = 10000; // Interval between iterations in milliseconds

(async () => {
  try {
    while (true) {
      // Fetch market information for the ARY/USDT trading pair
      const marketInfo = await restapiAcc1.getMarket('ARY/USDT');
      const currentPrice = parseFloat(marketInfo.last_price);

      // Calculate buy and sell prices
      const buyPrice = currentPrice + 0.01;
      const sellPrice = currentPrice - 0.01;

      // Get balances for Acc1
      const acc1Balances = await restapiAcc1.getBalances();
      const acc1ARYBalance = parseFloat(acc1Balances.find((balance) => balance.asset === 'ARY').available);
      const acc1USDTBalance = parseFloat(acc1Balances.find((balance) => balance.asset === 'USDT').available);

      // Calculate buy quantity based on balance
      const buyQuantity = Math.min(acc1USDTBalance * 0.2, acc1ARYBalance * 0.2);

      // Account 1 (Acc1) places a buy limit order slightly above the current price
      const buyOrderAcc1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'buy', buyQuantity, buyPrice);
      console.log('Acc1 Buy Order:', buyOrderAcc1);

      // Account 2 (Acc2) places a sell limit order slightly below the current price
      const sellOrderAcc2 = await restapiAcc2.createLimitOrder('ARY/USDT', 'sell', 1, sellPrice);
      console.log('Acc2 Sell Order:', sellOrderAcc2);

      // Wait for the specified interval before the next iteration
      await new Promise((resolve) => setTimeout(resolve, iterationInterval));
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
