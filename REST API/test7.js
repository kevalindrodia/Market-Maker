import fs from 'fs'; // Import the file system module
// const fs  = require('fs');
import xeggexApi from './xeggexApi.js';
// const xeggexApi = require('./xeggexApi.js');
import dotenv from 'dotenv';
// const dotenv = require('dotenv');

dotenv.config();

const acc2ApiKey = process.env.NileshApiKey;
const acc2ApiSecret = process.env.NileshApiSecret;
const acc1ApiKey = process.env.VipulApiKey;
const acc1ApiSecret = process.env.VipulApiSecret;

const restapiAcc1 = new xeggexApi(acc1ApiKey, acc1ApiSecret);
const restapiAcc2 = new xeggexApi(acc2ApiKey, acc2ApiSecret);
const iterationInterval = 1000; // Interval between iterations in milliseconds
const buySellGap = 10; // Gap between buy and sell actions in milliseconds

let initialPrice = 0.099; // Initial price
const priceChangeRate =  0.0015; // Rate of decrease per iteration
const priceChangeInterval = 120; // Number of iterations before price change

const stateFilePath = 'state.json';

function loadState() {
  try {
    const data = fs.readFileSync(stateFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('State file not found or invalid, starting from default state...');
    return {
      iterationCount: 0,
      initialPrice: 0.099,
    };
  }
}

function saveState(state) {
  try {
    fs.writeFileSync(stateFilePath, JSON.stringify(state));
    console.log('State Saved Successfully...');
  } catch (error) {
    console.error('Error Saving State:', error.message);
  }
}

(async () => {
  try {
    let buyingAcc = 'acc1'; // Start with acc1 buying and acc2 selling
    let { iterationCount, initialPrice } = loadState();

    while (initialPrice > 0.07000) {
      const marketInfo = await restapiAcc1.getMarket('ARY_USDT');

      // Calculate buy and sell quantities
      const buyQuantity = 0.5;
      const sellQuantity = buyQuantity;

      // Calculate buy and sell prices
      const buyPrice = initialPrice;
      const sellPrice = buyPrice;

      console.log(buyQuantity, buyPrice);
      console.log(sellQuantity, sellPrice);

      iterationCount++;

      if (iterationCount >= priceChangeInterval) {
        initialPrice -= priceChangeRate;
        iterationCount = 0;
      }
      saveState({ iterationCount, initialPrice });
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

      console.log('Buy and Sell orders Placed');
      // Switch roles for the next iteration
      buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';
      // Wait for the specified interval before the next iteration
      console.log("Current Volume: ",marketInfo.volume)
      console.log('Iteration Count: ',iterationCount);
      console.log('Current Price: ',initialPrice);
      await new Promise((resolve) => setTimeout(resolve, iterationInterval));
    }
    console.log("Final Price Point Reached: ", initialPrice);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();