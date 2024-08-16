const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const accountConfigs = [
  {
    apiKey: process.env.NileshApiKey,
    apiSecret: process.env.NileshApiSecret
  },
  {
    apiKey: process.env.VipulApiKey,
    apiSecret: process.env.VipulApiSecret
  },
  {
    apiKey: process.env.BhaveshApiKey,
    apiSecret: process.env.BhaveshApiSecret
  },
  {
    apiKey: process.env.jety2619ApiKey,
    apiSecret: process.env.jety2619ApiSecret
  }
];

const wsApiAccounts = accountConfigs.map(config => new XeggexSocketClient(config.apiKey, config.apiSecret));

async function initializeConnections() {
  const isConnected = await Promise.all(wsApiAccounts.map(account => account.waitConnect()));
  wsApiAccounts.forEach(account => account._initWss());
  return isConnected.every(connection => connection);
}

async function executeOrder(account, side, symbol, price, quantity) {
  const order = await account.createorder(symbol, side, price, quantity);
  if (order.result) {
    await account.cancelorder(order.result.id);
  }
  return order.result ? null : order.result.id;
}

(async function () {
  const isConnected = await initializeConnections();

  if (isConnected) {
    console.log('All WebSocket connections are initialized');

    const iterationInterval = 1000;
    const USDTQty = 0.65;
    const buyPrice = 0.065;
    const sellPrice = buyPrice;
    const ARYQty = 10;
    const buyQuantity = ARYQty;
    const sellQuantity = buyQuantity;
    const delayBuyOrders = 100;
    const delaySellOrders = delayBuyOrders;
    const intraPhaseGap = 250;
    const interPhaseGap = 1000;

    try {
      while (true) {
        const startTime = new Date().getTime();
        const balances = await Promise.all(wsApiAccounts.map(account => account.getbalances()));
        const accountBalances = balances.map(balance => ({
          usdt: parseFloat(balance.result[0].available),
          ary: parseFloat(balance.result[1].available)
        }));

        const [Acc1bUSDT, Acc1bARY, Acc2bUSDT, Acc2bARY, Acc3bUSDT, Acc3bARY, Acc4bUSDT, Acc4bARY] = accountBalances;

        // Phase 1 conditions check
        if (Acc1bUSDT >= USDTQty && Acc2bUSDT >= USDTQty && Acc3bARY >= ARYQty && Acc4bARY >= ARYQty) {
          console.log("Phase 1 - Acc1, Acc2 Buys");

          // Execute orders for Phase 1
          console.log("acc3 sells.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc3, 'sell', 'ARY/USDT', sellPrice, sellQuantity);

          console.log("Waiting for 100ms before placing sell orders");
          await new Promise(resolve => setTimeout(resolve, delaySellOrders));

          console.log("acc4 sells.", ARYQty + " ARY goes into open");
          await executeOrder(wsApiAcc4, 'sell', 'ARY/USDT', sellPrice, sellQuantity);

          console.log("Waiting for 500ms before placing buy orders");
          await new Promise(resolve => setTimeout(resolve, intraPhaseGap));

          console.log("acc1 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc1, 'buy', 'ARY/USDT', buyPrice, buyQuantity);

          console.log("Waiting for 100ms before placing next buy order");
          await new Promise(resolve => setTimeout(resolve, delayBuyOrders));

          console.log("acc2 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc2, 'buy', 'ARY/USDT', buyPrice, buyQuantity);
        } else {
          console.log("Phase 1 - Insufficient Balance");
          console.log("acc3 buys.", ARYQty + " ARY goes into open");
          const buyOrderAcc3 = await executeOrder(wsApiAcc3, 'buy', 'ARY/USDT', sellPrice, buyQuantity);
          if (buyOrderAcc3) {
            console.log(JSON.stringify(buyOrderAcc3, null, 4));
            continue;
          }

          console.log("Waiting for 100ms before placing sell orders");
          await new Promise(resolve => setTimeout(resolve, delaySellOrders));

          console.log("acc4 buy.", ARYQty + " ARY goes into open");
          await executeOrder(wsApiAcc4, 'buy', 'ARY/USDT', sellPrice, buyQuantity);

          console.log("Waiting for 500ms before placing buy orders");
          await new Promise(resolve => setTimeout(resolve, intraPhaseGap));

          console.log("acc1 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc1, 'buy', 'ARY/USDT', sellPrice, buyQuantity);

          console.log("Waiting for 100ms before placing next buy order");
          await new Promise(resolve => setTimeout(resolve, delayBuyOrders));

          console.log("acc2 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc2, 'buy', 'ARY/USDT', sellPrice, sellQuantity);

          console.log("Insufficient Balance Phase 1. Retrying after 1 second...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue; // Continue to the next iteration
        }

        // Phase 2 conditions check
        if (Acc1bARY >= ARYQty && Acc2bARY >= ARYQty && Acc3bUSDT >= USDTQty && Acc4bUSDT >= USDTQty) {
          console.log("Phase 2 - Acc1, Acc2 Sells");

          // Execute orders for Phase 2
          console.log("acc1 sells.", ARYQty + " ARY goes into open");
          await executeOrder(wsApiAcc1, 'sell', 'ARY/USDT', sellPrice, sellQuantity);

          console.log("Waiting for 100ms before placing sell orders");
          await new Promise(resolve => setTimeout(resolve, delaySellOrders));

          console.log("acc2 sells.", ARYQty + " ARY goes into open");
          await executeOrder(wsApiAcc2, 'sell', 'ARY/USDT', sellPrice, sellQuantity);

          console.log("Waiting for 500ms before placing sell orders");
          await new Promise(resolve => setTimeout(resolve, intraPhaseGap));

          console.log("acc3 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc3, 'buy', 'ARY/USDT', buyPrice, buyQuantity);

          console.log("Waiting for 100ms before placing next buy order");
          await new Promise(resolve => setTimeout(resolve, delayBuyOrders));

          console.log("acc4 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc4, 'buy', 'ARY/USDT', buyPrice, buyQuantity);

          console.log("Insufficient Balance Phase 2. Retrying after 2 seconds...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log("Phase 2 - Insufficient Balance");
          console.log("acc1 buys.", USDTQty + " USDT goes into open");
          const buyOrderAcc1 = await executeOrder(wsApiAcc1, 'buy', 'ARY/USDT', buyPrice, buyQuantity);
          if (buyOrderAcc1) {
            console.log(JSON.stringify(buyOrderAcc1, null, 4));
          }
          
          console.log("Waiting for 100ms before placing sell orders");
          await new Promise(resolve => setTimeout(resolve, delaySellOrders));

          console.log("acc2 sells.", ARYQty + " ARY goes into open");
          await executeOrder(wsApiAcc2, 'sell', 'ARY/USDT', sellPrice, buyQuantity);

          console.log("Waiting for 500ms before placing sell orders");
          await new Promise(resolve => setTimeout(resolve, intraPhaseGap));

          console.log("acc3 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc3, 'buy', 'ARY/USDT', sellPrice, buyQuantity);

          console.log("Waiting for 100ms before placing next buy order");
          await new Promise(resolve => setTimeout(resolve, delayBuyOrders));

          console.log("acc4 buys.", USDTQty + " USDT goes into open");
          await executeOrder(wsApiAcc4, 'buy', 'ARY/USDT', sellPrice, sellQuantity);

          console.log("Insufficient Balance Phase 2. Retrying after 2 seconds...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue; // Continue to the next iteration
        }

        const endTime = new Date().getTime();
        const iterationTime = endTime - startTime;
        console.log('Iteration time:', iterationTime, 'ms');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } else {
    console.log('Connection to WebSocket API failed for some accounts');
  }
})();
