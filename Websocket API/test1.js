const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;

const acc2ApiKey = process.env.jety2619ApiKey;
const acc2ApiSecret = process.env.jety2619ApiSecret;

const acc3ApiKey = process.env.BhaveshApiKey;
const acc3ApiSecret = process.env.BhaveshApiSecret;

const acc4ApiKey = process.env.AaryaNetworkApiKey;
const acc4ApiSecret = process.env.AaryaNetworkApiSecret;

const wsApiAcc1 = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);
const wsApiAcc2 = new XeggexSocketClient(acc2ApiKey, acc2ApiSecret);
const wsApiAcc3 = new XeggexSocketClient(acc3ApiKey, acc3ApiSecret);
const wsApiAcc4 = new XeggexSocketClient(acc4ApiKey, acc4ApiSecret);

// Event handling for connected and notification
/* wsApiAcc1.on('connected', () => {
  console.log('Connected to WebSocket API');
});

wsApiAcc1.on('notification', (notification) => {
  console.log('Received notification:', notification);
}); */

(async () => {
  // Wait for WebSocket connections to open
  const [isConnectedAcc1, isConnectedAcc2, isConnectedAcc3, isConnectedAcc4] = await Promise.all([
    wsApiAcc1.waitConnect(),
    wsApiAcc2.waitConnect(),
    wsApiAcc3.waitConnect(),
    wsApiAcc4.waitConnect(),
  ]);

  wsApiAcc1._initWss();
  wsApiAcc2._initWss();
  wsApiAcc3._initWss();
  wsApiAcc4._initWss();

  if (isConnectedAcc1 && isConnectedAcc2 && isConnectedAcc3 && isConnectedAcc4) {
    console.log('WebSocket connections initialized:', isConnectedAcc1, isConnectedAcc2, isConnectedAcc2, isConnectedAcc4);
    
    const iterationInterval = 1000; // Interval between iterations in milliseconds
    const buySellGap = 1000; // Gap between buy and sell actions in milliseconds
    const buyPrice = 0.07
    const sellPrice = buyPrice
    const buyQuantity = 14.28;
    const sellQuantity = buyQuantity;
    var isBuyingPhase = true;
    try {
      
      // Wait for WebSocket connections to be fully established
      await Promise.all([
        wsApiAcc1.waitConnect(),
        wsApiAcc2.waitConnect(),
        wsApiAcc3.waitConnect(),
        wsApiAcc4.waitConnect()
      ]);
    //   let isBuyingPhase = true;
      while (true) {
        // Determine the role and action for each account
        const acc1Role = isBuyingPhase ? 'Buyer' : 'Seller';
        const acc2Role = isBuyingPhase ? 'Buyer' : 'Seller';
        const acc3Role = isBuyingPhase ? 'Seller' : 'Buyer';
        const acc4Role = isBuyingPhase ? 'Seller' : 'Buyer';
        
        const balance1 = await wsApiAcc1.getbalances();
        const balance2 = await wsApiAcc2.getbalances();
        const balance3 = await wsApiAcc3.getbalances();
        const balance4 = await wsApiAcc4.getbalances();

        const parseBalance = (balanceArray, asset) => {
            const balanceObj = balanceArray.find(balance => balance.asset === asset);
            if (balanceObj) {
              return parseFloat(balanceObj.available);
            }
            return NaN;
          };
        
          const acc1USDTBalance = parseBalance(balance1.result, 'USDT');
          const acc2USDTBalance = parseBalance(balance2.result, 'USDT');
          const acc1ARYBalance = parseBalance(balance1.result, 'ARY');
          const acc2ARYBalance = parseBalance(balance2.result, 'ARY');
          const acc3ARYBalance = parseBalance(balance3.result, 'ARY');
          const acc4ARYBalance = parseBalance(balance4.result, 'ARY');
          const acc3USDTBalance = parseBalance(balance3.result, 'USDT');
          const acc4USDTBalance = parseBalance(balance4.result, 'USDT');
          console.log('USDT balance of Acc1:', acc1USDTBalance);
          console.log('USDT balance of Acc2:', acc2USDTBalance);
          console.log('ARY balance of Acc1:', acc1ARYBalance);
          console.log('ARY balance of Acc2:', acc2ARYBalance);
          console.log('ARY balance of Acc3:', acc3ARYBalance);
          console.log('ARY balance of Acc4:', acc4ARYBalance);
          console.log('USDT balance of Acc3:', acc3USDTBalance);
          console.log('USDT balance of Acc4:', acc4USDTBalance);

        isBuyingPhase = !isBuyingPhase;
        console.log("waiting for",iterationInterval,"ms...")
        await new Promise((resolve) => setTimeout(resolve, iterationInterval));
        
      } 
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } else {
    console.log('Connection to WebSocket API failed');
  }
})();