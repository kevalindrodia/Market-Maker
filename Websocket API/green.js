const XeggexSocketClient = require('./wsapiClass.min.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;

const acc2ApiKey = process.env.VipulApiKey;
const acc2ApiSecret = process.env.VipulApiSecret;

const wsApiAcc1 = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret); // initially buying
const wsApiAcc2 = new XeggexSocketClient(acc2ApiKey, acc2ApiSecret); // initially selling;

function getRandomQuantity(min, max, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.floor(Math.random() * (max - min + 1) * factor) / factor + min;
}
function getRandomPrice(min, max, decimalPlaces) {
  const range = max - min;
  const randomValue = Math.random() * range + min;
  const factor = 10 ** decimalPlaces;
  return Math.floor(randomValue * factor) / factor;
}

wsApiAcc1.on('connected', () => {
  console.log('Connected to WebSocket API');
});

wsApiAcc1.on('notification', (notification) => {
  console.log('Received notification:', notification);
});

(async () => {
  const [isConnectedAcc1, isConnectedAcc2] = await Promise.all([
    wsApiAcc1.waitConnect(),
    wsApiAcc2.waitConnect(),
  ]);

  wsApiAcc1._initWss();
  wsApiAcc2._initWss();

  if (isConnectedAcc1 && isConnectedAcc2) {
    // const startTime = new Date().getTime();
    console.log('WebSocket connections initialized:', isConnectedAcc1, isConnectedAcc2);

    // const iterationInterval = 1500;
    const buySellGap = 200;
    const retryGap = 1000;
    // const buyPrice = 0.065;
    // const sellPrice = buyPrice;
    // const buyQuantity = 30;
    // const sellQuantity = buyQuantity;
    var buyingAcc = 'acc1';

    try {
      await Promise.all([
        wsApiAcc1.waitConnect(),
        wsApiAcc2.waitConnect(),
      ]);

      while (true) {
        var iterationInterval = getRandomQuantity(1500,2000,2)
        var buyQuantity = getRandomQuantity(41, 75, 3);
        // var buyQuantity = 96;
        var sellQuantity = buyQuantity;

        var buyPrice = getRandomPrice(0.02001, 0.02189, 4)
        var sellPrice = buyPrice

        console.log("Price:",buyPrice,"Qty:",buyQuantity)
        // const sellQuantity = buyQuantity
        if (buyingAcc === 'acc1') {
          
          try{
            console.log('Acc2 is Selling....');
            const sellOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
            const acc2sellOrderID = sellOrderAcc2.result.id;
            console.log('Acc2 Sell Order:', acc2sellOrderID);
          }catch(sellError){
            if (sellError.error.code === 20001) {
              console.log('Insufficient funds for Selling with Acc2. Retrying with Acc1...');
              await new Promise((resolve) => setTimeout(resolve, retryGap));
              console.log('Acc1 is Selling....');
          const sellOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc1sellOrderID = sellOrderAcc1.result.id;
          console.log('Acc1 Sell Order:', acc1sellOrderID);
            }
          }
        } else {
          
          try{
            console.log('Acc1 is Selling....');
            const sellOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
            const acc1sellOrderID = sellOrderAcc1.result.id;
            console.log('Acc1 Sell Order:', acc1sellOrderID);
          }catch(sellError){
            if (sellError.error.code === 20001) {
              console.log('Insufficient funds for Selling with Acc1. Retrying with Acc2...');
              await new Promise((resolve) => setTimeout(resolve, retryGap));
              console.log('Acc1 is Selling....');
          const sellOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc2sellOrderID = sellOrderAcc2.result.id;
          console.log('Acc2 Sell Order:', acc2sellOrderID);
            }
          }
        }


        console.log('Waiting for', buySellGap, 'ms...');
        await new Promise((resolve) => setTimeout(resolve, buySellGap));

        
        if (buyingAcc === 'acc1') {
          console.log('Acc1 is Buying....');
          try {
            const buyOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
            const acc1buyOrderID = buyOrderAcc1.result.id;
            console.log('Acc1 Buy Order:', acc1buyOrderID);
          } catch (buyError) {
            if (buyError.error.code === 20001) {
              console.log('Insufficient funds for buying with Acc1. Retrying with Acc2...');
              await new Promise((resolve) => setTimeout(resolve, retryGap));
              buyingAcc = 'acc2'; // Retry with acc2
              continue;
            } else if (buyError.error.code === 429) {
              console.log('Too many requests at once. Retrying in 3 seconds...');
              await new Promise((resolve) => setTimeout(resolve, 3000));
              continue;
            } else {
              throw buyError;
            }
          }
        } else {
          console.log('Acc2 is Buying....');
          try {
            const buyOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
            const acc2buyOrderID = buyOrderAcc2.result.id;
            console.log('Acc2 Buy Order:', acc2buyOrderID);
          } catch (buyError) {
            if (buyError.error.code === 20001) {
              console.log('Insufficient funds for buying with Acc2. Retrying with Acc1...');
              await new Promise((resolve) => setTimeout(resolve, retryGap));
              buyingAcc = 'acc1'; // Retry with acc1
              continue;
            } else if (buyError.error.code === 429) {
              console.log('Too many requests at once. Retrying in 3 seconds...');
              await new Promise((resolve) => setTimeout(resolve, 3000));
              continue;
            } else {
              throw buyError;
            }
          }
        }
        buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';
        console.log('waiting for', iterationInterval, 'ms...');
        await new Promise((resolve) => setTimeout(resolve, iterationInterval));
        // const endTime = new Date().getTime();
        // const iterationTime = endTime - startTime;
        // console.log('Total time:', iterationTime, 'ms');
      }
      
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } else {
    console.log('Connection to WebSocket API failed');
  }
})();
