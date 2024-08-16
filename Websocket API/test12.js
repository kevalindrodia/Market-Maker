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

    const iterationInterval = 1500;
    const interPhaseGap = 2000;
    const buySellGap = 500;
    const retryGap = 1500;
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
        // const buyQuantity = getRandomNumber(9, 12);
        // var buyQuantity = 91;
        var buyQuantity = getRandomQuantity(55, 60, 2);

        var sellQuantity = buyQuantity;

        var buyPrice = getRandomPrice(0.05140, 0.05290, 4)
        var sellPrice = buyPrice

        console.log("Price:",buyPrice,"Qty:",buyQuantity)

            console.log('Acc2 is Selling....');
            const sellOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
            const acc2sellOrderID = sellOrderAcc2.result.id;
            console.log('Acc2 Sell Order:', acc2sellOrderID);

            console.log('Waiting for', buySellGap, 'ms...');
            await new Promise((resolve) => setTimeout(resolve, buySellGap));

            console.log('Acc1 is Buying....');
            const buyOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
            const acc1buyOrderID = buyOrderAcc1.result.id;
            console.log('Acc1 Buy Order:', acc1buyOrderID);



            console.log('Waiting for', interPhaseGap, 'ms...');
            await new Promise((resolve) => setTimeout(resolve, interPhaseGap));

            var buyQuantity = getRandomQuantity(55, 60, 2);

            var sellQuantity = buyQuantity;
    
            var buyPrice = getRandomPrice(0.05140, 0.05290, 4)
            var sellPrice = buyPrice

            console.log('Acc1 is Selling....');
            const sellOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
            const acc1sellOrderID = sellOrderAcc1.result.id;
            console.log('Acc1 Sell Order:', acc1sellOrderID);

            console.log('Waiting for', buySellGap, 'ms...');
            await new Promise((resolve) => setTimeout(resolve, buySellGap));

            const buyOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
            const acc2buyOrderID = buyOrderAcc2.result.id;
            console.log('Acc2 Buy Order:', acc2buyOrderID);


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