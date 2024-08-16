const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.JeetApiKey;
const acc1ApiSecret = process.env.JeetApiSecret;
const acc2ApiKey = process.env.jety2619ApiKey;
const acc2ApiSecret = process.env.jety2619ApiSecret;

const wsApiAcc1 = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);
const wsApiAcc2 = new XeggexSocketClient(acc2ApiKey, acc2ApiSecret);

const xeggexApi = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);
const iterationInterval = 500; // Interval between iterations in milliseconds
const buySellGap = 1000; // Gap between buy and sell actions in milliseconds
var buyingAcc = 'acc1';

(async () => {
  let isConnected = await xeggexApi.waitConnect();

  if (isConnected) {
    console.log('Connected to WebSocket API');

    try {
      while (true) {
        const marketInfo = await xeggexApi.getmarket('ARY/USDT');
        console.log('Market Info for ARY/USDT:');
        const lastPrice = marketInfo.result.lastPriceNumber;
        const volume = marketInfo.result.volumeNumber;
        const buyQuantity = 1;
        const sellQuantity = buyQuantity;
        const buyPrice = 0.07;
        const sellPrice = buyPrice;

        console.log("Current Trade Quantity:", buyQuantity);
        console.log("Current Trade Price:", buyPrice);

        if (buyingAcc === 'acc1') {
          console.log("Acc1 is Buying....");
        } else {
          console.log("Acc2 is Buying....");
        }

        await new Promise((resolve) => setTimeout(resolve, buySellGap));
        console.log(buySellGap, 'ms have passed...');

        if (buyingAcc === 'acc1') {
          console.log("Acc2 is Selling....");
        } else {
          console.log("Acc1 is Selling....");
        }

        buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';

        await new Promise((resolve) => setTimeout(resolve, iterationInterval));
        console.log("The last Price was:", lastPrice);
        console.log("The Current volume is:", volume);
      }
    } catch (error) {
      console.error('Error fetching market info:', error);
    }
  } else {
    console.log('Connection to WebSocket API failed');
  }
})();
