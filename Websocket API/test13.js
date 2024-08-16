const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;

const acc2ApiKey = process.env.VipulApiKey;
const acc2ApiSecret = process.env.VipulApiSecret;

const wsApiAcc1 = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);
const wsApiAcc2 = new XeggexSocketClient(acc2ApiKey, acc2ApiSecret);
const retryDelay = 2000; // Delay for retrying after an error
const requestDelay = 500; // Delay between requests to avoid rate limiting

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
    console.log('WebSocket connections initialized:', isConnectedAcc1, isConnectedAcc2);

    const iterationInterval = 1000;
    const buyPrice = 0.065;
    const buyQuantity = 12;
    const sellQuantity = buyQuantity;
    var buyingAcc = 'acc1';

    try {
      while (true) {
        if (buyingAcc === 'acc1') {
          console.log('Acc1 is Buying....');
          const acc1OrderPromise = wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          const acc2OrderPromise = wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          
          try {
            const buyOrderAcc1 = await acc1OrderPromise;
            const acc1buyOrderID = buyOrderAcc1.result.id;
            console.log('Acc1 Buy Order:', acc1buyOrderID);
          } catch (buyError) {
            if (buyError.error.code === 20001) {
              console.log('Insufficient funds for buying with Acc1. Retrying with Acc2...');
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              buyingAcc = 'acc2';
            } else if (buyError.error.code === 429) {
              console.log('Too many requests at once. Retrying in 3 seconds...');
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
              throw buyError;
            }
            continue;
          }
        } else {
          console.log('Acc2 is Buying....');
          const acc2OrderPromise = wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          const acc1OrderPromise = wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          
          try {
            const buyOrderAcc2 = await acc2OrderPromise;
            const acc2buyOrderID = buyOrderAcc2.result.id;
            console.log('Acc2 Buy Order:', acc2buyOrderID);
          } catch (buyError) {
            if (buyError.error.code === 20001) {
              console.log('Insufficient funds for buying with Acc2. Retrying with Acc1...');
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              buyingAcc = 'acc1';
            } else if (buyError.error.code === 429) {
              console.log('Too many requests at once. Retrying in 3 seconds...');
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
              throw buyError;
            }
            continue;
          }
        }

        console.log('Waiting for', requestDelay, 'ms...');
        await new Promise((resolve) => setTimeout(resolve, requestDelay));

        if (buyingAcc === 'acc1') {
          console.log('Acc2 is Selling....');
          await wsApiAcc2.createorder('ARY/USDT', 'sell', buyPrice, sellQuantity);
        } else {
          console.log('Acc1 is Selling....');
          await wsApiAcc1.createorder('ARY/USDT', 'sell', buyPrice, sellQuantity);
        }

        buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';
        console.log('waiting for', iterationInterval, 'ms...');
        await new Promise((resolve) => setTimeout(resolve, iterationInterval));
      }
      
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } else {
    console.log('Connection to WebSocket API failed');
  }
})();
