//just printing the price and quantity

import fs from 'fs'; // Import the file system module
import path from 'path'; 
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

let initialPrice = 0.099; // Initial price
const priceChangeRate = 0.000002; // Rate of decrease per iteration
const priceChangeInterval = 60; // Number of iterations before price change

//const stateFilePath = new URL('state.json', import.meta.url).pathname;
const stateFilePath = 'state.json'
function loadState() {
  try{
    const data = fs.readFileSync(stateFilePath,'utf-8');
    return JSON.parse(data);
  } catch(error){
    console.log('State file not found or invalid, starting from default state...');
    return{
       iterationCount: 0,
       initialPrice: 0.099,
    }
  }
}

function saveState(state){
  try{
    fs.writeFileSync(stateFilePath, JSON.stringify(state));
    console.log('State Saved Successfully...');
  } catch(error){
    console.error('Error Saving State:', error.message);
  }
}


(async () => {
  try {
   // let iterationCount = 0;
    let {iterationCount, initialPrice} = loadState();

    while (initialPrice > 0.07489) {
      const marketInfo = await restapiAcc1.getMarket('ARY_USDT');

      // Calculate buy and sell quantities
      const buyQuantity = 1;
      const sellQuantity = buyQuantity;

      // Calculate buy and sell prices
      const buyPrice = initialPrice;
      const sellPrice = buyPrice;

      console.log(buyQuantity, buyPrice);
      console.log(sellQuantity, sellPrice);

      iterationCount++;

      if(iterationCount>=priceChangeInterval){
        initialPrice -= priceChangeRate;
        iterationCount = 0;
        saveState({iterationCount, initialPrice});
      }

      //wait for specified interval before the next iteration
      await new Promise((resolve)=>setTimeout(resolve, iterationInterval))
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
