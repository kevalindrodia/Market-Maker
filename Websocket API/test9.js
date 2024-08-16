const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.BhaveshApiKey;
const acc1ApiSecret = process.env.BhaveshApiSecret;

const acc2ApiKey = process.env.jety2619ApiKey;
const acc2ApiSecret = process.env.jety2619ApiSecret;

const wsApiAcc1 = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);
const wsApiAcc2 = new XeggexSocketClient(acc2ApiKey, acc2ApiSecret);

// Event handling for connected and notification
wsApiAcc1.on('connected', () => {
  console.log('Connected to WebSocket API');
});

wsApiAcc1.on('notification', (notification) => {
  console.log('Received notification:', notification);
});

(async () => {
  // Wait for WebSocket connections to open
  const [isConnectedAcc1, isConnectedAcc2] = await Promise.all([
    wsApiAcc1.waitConnect(),
    wsApiAcc2.waitConnect()
  ]);

  wsApiAcc1._initWss();
  wsApiAcc2._initWss();

  if (isConnectedAcc1 && isConnectedAcc2) {
    console.log('WebSocket connections initialized:', isConnectedAcc1, isConnectedAcc2);
    
    const iterationInterval = 1000; // Interval between iterations in milliseconds
    const buySellGap = 2000; // Gap between buy and sell actions in milliseconds
    const buyPrice = 0.07
    const sellPrice = buyPrice
    const buyQuantity = 2;
    const sellQuantity = buyQuantity;
    var buyingAcc = 'acc1';
    try {
      console.log('Entering the main loop...');
      
      // Wait for WebSocket connections to be fully established
      await Promise.all([
        wsApiAcc1.waitConnect(),
        wsApiAcc2.waitConnect()
      ]);
      while (true) {
        console.log('Iteration started...');
        
        // Now you can safely send WebSocket requests

        // const marketInfo1 = await wsApiAcc2.getmarket('ARY/USDT');
        // console.log('Fetched market info:', marketInfo1);

        if (buyingAcc === 'acc1') {
          console.log("Acc1 is Buying....");
          const buyOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          console.log('Acc1 Buy Order:', buyOrderAcc1);
        } else {
          console.log("Acc2 is Buying....");
          const buyOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          console.log('Acc2 Buy Order:', buyOrderAcc2);
        }
        console.log('Waiting for', buySellGap,'ms...');
        await new Promise((resolve) => setTimeout(resolve, buySellGap));

        if (buyingAcc === 'acc1') {
          console.log("Acc2 is Selling....");
          const sellOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          console.log('Acc2 Sell Order:', sellOrderAcc2);
        } else {
          console.log("Acc1 is Selling....");
          const sellOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          console.log('Acc1 Sell Order:', sellOrderAcc1);
        }

        buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';
        // const marketInfo = await wsApiAcc1.getmarket('ARY/USDT');
        // console.log("The last Price was:", marketInfo.result.lastPriceNumber);
        // console.log("The Current volume is:", marketInfo.result.volumeNumber);
        // await new Promise((resolve) => setTimeout(resolve, iterationInterval));
        
      }
     
      console.log('Exited the main loop.');
    } catch (error) {
      console.error('An error occurred:', error.message);
      if (error.message.includes('Insufficient funds')) {
        console.log('Insufficient funds error, switching roles...');
        buyingAcc = buyingAcc === 'acc1' ? 'acc2' : 'acc1';
      }
    }
  } else {
    console.log('Connection to WebSocket API failed');
  }
})();
