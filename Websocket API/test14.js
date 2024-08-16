const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;

const acc2ApiKey = process.env.VipulApiKey;
const acc2ApiSecret = process.env.VipulApiSecret;

const acc3ApiKey = process.env.BhaveshApiKey;
const acc3ApiSecret = process.env.BhaveshApiSecret;

const acc4ApiKey = process.env.jety2619ApiKey;
const acc4ApiSecret = process.env.jety2619ApiSecret;

const wsApiAcc1 = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);
const wsApiAcc2 = new XeggexSocketClient(acc2ApiKey, acc2ApiSecret);
const wsApiAcc3 = new XeggexSocketClient(acc3ApiKey, acc3ApiSecret);
const wsApiAcc4 = new XeggexSocketClient(acc4ApiKey, acc4ApiSecret);
wsApiAcc1.on('connected', () => {
  console.log('Connected to WebSocket API');
});

wsApiAcc1.on('notification', (notification) => {
  console.log('Received notification:', notification);
});

(async () => {

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
    // console.log('WebSocket connections initialized:', isConnectedAcc1, isConnectedAcc2);
    console.log('All WebSocket connections are initialized');

    const iterationInterval = 1000; // Interval between iterations in milliseconds
    const USDTQty = 0.65;
    const buyPrice = 0.065;
    const sellPrice = buyPrice;
    const ARYQty = 10;
    const buyQuantity = ARYQty;
    const sellQuantity = buyQuantity;
    const delayBuyOrders = 100;
    const delaySellOrders = delayBuyOrders;
    const intraPhaseGap = 250;// Interval b/w 2buy & 2sell in phase 1 and phase 2
    const interPhaseGap = 1000;//Interval b/w the two phases
    // var isBuyingPhase = true;

    try {
      await Promise.all([
        wsApiAcc1.waitConnect(),
        wsApiAcc2.waitConnect(),
        wsApiAcc3.waitConnect(),
        wsApiAcc4.waitConnect()
      ]);
      while (true) {
        const startTime = new Date().getTime();
        var balance1 = await wsApiAcc1.getbalances();
        var balance2 = await wsApiAcc2.getbalances();
        var balance3 = await wsApiAcc3.getbalances();
        var balance4 = await wsApiAcc4.getbalances();

        var Acc1bUSDT = parseFloat(balance1.result[0].available);
        var Acc1bARY = parseFloat(balance1.result[1].available);
        var Acc2bUSDT = parseFloat(balance2.result[0].available);
        var Acc2bARY = parseFloat(balance2.result[1].available);
        var Acc3bUSDT = parseFloat(balance3.result[0].available);
        var Acc3bARY = parseFloat(balance3.result[1].available);
        var Acc4bUSDT = parseFloat(balance4.result[0].available);
        var Acc4bARY = parseFloat(balance4.result[1].available);

        // Acc1bUSDT===1.5 && Acc2bUSDT===1.5 && Acc3bARY===44 && Acc4bARY===44
        if(Acc1bUSDT>=USDTQty && Acc2bUSDT>=USDTQty && Acc3bARY>=ARYQty && Acc4bARY>=ARYQty){
          
            console.log("Phase 1 - Acc1,Acc2 Buys")

            console.log("acc3 sells.", USDTQty+"USDT goes into open")
            const sellOrderAcc3 = await wsApiAcc3.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
            const acc3sellOrderID = sellOrderAcc3.result.id;
            console.log('Acc3 Sell Order:', acc3sellOrderID);
            
            if (sellOrderAcc3 && sellOrderAcc3.result)
              {
                cancelorder = await wsApiAcc3.cancelorder(acc3sellOrderID);
                console.log(JSON.stringify(cancelorder, null, 4));
              }
            console.log("Waiting for 100ms before placing sell orders")
            await new Promise((resolve)=>setTimeout(resolve,delaySellOrders))
  
            console.log("acc4 sells.", ARYQty+"ARY goes into open")
            const sellOrderAcc4 = await wsApiAcc4.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
            const acc4sellOrderID = sellOrderAcc4.result.id;
            console.log('Acc2 Sell Order:', acc4sellOrderID);
  
            console.log("Waiting for 500ms before placing buy orders")
            await new Promise((resolve)=>setTimeout(resolve,intraPhaseGap))
    
            console.log("acc1 buys.", USDTQty+"USDT goes into open")
            const buyOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
            const acc1buyOrderID = buyOrderAcc1.result.id;
            console.log('Acc1 Buy Order:', acc1buyOrderID);
  
            console.log("Waiting for 100ms before placing next buy order")
            await new Promise((resolve)=>setTimeout(resolve,delayBuyOrders));
  
            console.log("acc2 buys.", USDTQty+"USDT goes into open")
            const buyOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
            const acc2buyOrderID = buyOrderAcc2.result.id;
            console.log('Acc2 Buy Order:', acc2buyOrderID);
          
        }else{
          console.log(Acc1bUSDT>=USDTQty, Acc2bUSDT>=USDTQty, Acc3bARY>=ARYQty, Acc4bARY>=ARYQty)
          console.log("acc3 buys.", ARYQty+"ARY goes into open")
          const buyOrderAcc3 = await wsApiAcc3.createorder('ARY/USDT', 'buy', sellPrice, buyQuantity);
          const acc3buyOrderID = buyOrderAcc3.result.id;
          console.log('Acc3 Sell Order:', acc3buyOrderID);
          if (buyOrderAcc3 && buyOrderAcc3.result)
          {
            cancelorder = await wsApiAcc3.cancelorder(acc3buyOrderID);
            console.log(JSON.stringify(cancelorder, null, 4));
            continue
          }
          console.log("Waiting for 100ms before placing sell orders")
          await new Promise((resolve)=>setTimeout(resolve,delaySellOrders))

          console.log("acc4 buy.", ARYQty+"ARY goes into open")
          const buyOrderAcc4 = await wsApiAcc4.createorder('ARY/USDT', 'buy', sellPrice, buyQuantity);
          const acc4buyOrderID = buyOrderAcc4.result.id;
          console.log('Acc2 Sell Order:', acc4buyOrderID);

          console.log("Waiting for 500ms before placing buy orders")
          await new Promise((resolve)=>setTimeout(resolve,intraPhaseGap))
  
          console.log("acc1 buys.", USDTQty+"USDT goes into open")
          const sellOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'sell', sellPrice, buyQuantity);
          const acc1sellOrderID = sellOrderAcc1.result.id;
          console.log('Acc1 Buy Order:', acc1sellOrderID);

          console.log("Waiting for 100ms before placing next buy order")
          await new Promise((resolve)=>setTimeout(resolve,delayBuyOrders));

          console.log("acc2 buys.", USDTQty+"USDT goes into open")
          const sellOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc2sellOrderID = sellOrderAcc2.result.id;
          console.log('Acc2 Buy Order:', acc2sellOrderID);
          console.log(
            "Insufficient Balance Phase 1. Retrying after 1 second..."
          );
          await new Promise((resolve)=>setTimeout(resolve,2000))
          continue; // Continue to the next iteration
        }

        //Now we need to check the balances to know that the orders were placed

        var balance1 = await wsApiAcc1.getbalances();
        var balance2 = await wsApiAcc2.getbalances();
        var balance3 = await wsApiAcc3.getbalances();
        var balance4 = await wsApiAcc4.getbalances();

        
        var Acc1bUSDT = parseFloat(balance1.result[0].available);
        var Acc1bARY = parseFloat(balance1.result[1].available);
        var Acc2bUSDT = parseFloat(balance2.result[0].available);
        var Acc2bARY = parseFloat(balance2.result[1].available);
        var Acc3bUSDT = parseFloat(balance3.result[0].available);
        var Acc3bARY = parseFloat(balance3.result[1].available);
        var Acc4bUSDT = parseFloat(balance4.result[0].available);
        var Acc4bARY = parseFloat(balance4.result[1].available);
        
        
        //wait for 2s to fetch all the balances
        console.log("wait for 1000ms to fetch all the balances")
        await new Promise((resolve)=>setTimeout(resolve,interPhaseGap));

        if(Acc1bARY>=ARYQty && Acc2bARY>=ARYQty && Acc3bUSDT>=USDTQty && Acc4bUSDT>=USDTQty){
          console.log("Phase 2 - Acc1,Acc2 Sells")

          console.log("acc1 sells.", ARYQty+"ARY goes into open")
          const sellOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc1sellOrderID = sellOrderAcc1.result.id;
          console.log('Acc1 Sell Order:', acc1sellOrderID);

          if (sellOrderAcc1 && sellOrderAcc1.result)
              {
                cancelorder = await wsApiAcc1.cancelorder(acc1sellOrderID);
                console.log(JSON.stringify(cancelorder, null, 4));
                continue;
              }

          console.log("Waiting for 100ms before placing sell orders")
          await new Promise((resolve)=>setTimeout(resolve,delaySellOrders))

          console.log("acc2 sells.", ARYQty+"ARY goes into open")
          const sellOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc2sellOrderID = sellOrderAcc2.result.id;
          console.log('Acc2 Sell Order:', acc2sellOrderID);

          console.log("Waiting for 500ms before placing sell orders")
          await new Promise((resolve)=>setTimeout(resolve,intraPhaseGap))
 
  
          console.log("acc3 buys.", USDTQty+"USDT goes into open")
          const buyOrderAcc3 = await wsApiAcc3.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          const acc3buyOrderID = buyOrderAcc3.result.id;
          console.log('Acc3 Buy Order:', acc3buyOrderID);

          console.log("Waiting for 100ms before placing next buy order")
          await new Promise((resolve)=>setTimeout(resolve,delayBuyOrders));

          console.log("acc4 buys.", USDTQty+"USDTgoes into open")
          const buyOrderAcc4 = await wsApiAcc4.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          const acc4buyOrderID = buyOrderAcc4.result.id;
          console.log('Acc4 Buy Order:', acc4buyOrderID);
          await new Promise((resolve)=>setTimeout(resolve,2000))
          // continue;
        }else{
          console.log(Acc1bARY>=ARYQty,Acc2bARY>=ARYQty,Acc3bUSDT>=USDTQty, Acc4bUSDT>=USDTQty)
          console.log("acc1 buys.", USDTQty+"USDT goes into open")
          const buyOrderAcc1 = await wsApiAcc1.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          const acc1buyOrderID = buyOrderAcc1.result.id;
          console.log('Acc1 Sell Order:', acc1buyOrderID);
          if (buyOrderAcc1 && buyOrderAcc1.result)
              {
                cancelorder = await wsApiAcc1.cancelorder(acc1buyOrderID);
                console.log(JSON.stringify(cancelorder, null, 4));
              }
          console.log("Waiting for 100ms before placing sell orders")
          await new Promise((resolve)=>setTimeout(resolve,delaySellOrders))

          console.log("acc2 sells.", ARYQty+"ARY goes into open")
          const buyOrderAcc2 = await wsApiAcc2.createorder('ARY/USDT', 'buy', buyPrice, buyQuantity);
          const acc2buyOrderID = buyOrderAcc2.result.id;
          console.log('Acc2 Sell Order:', accbuyOrderID);

          console.log("Waiting for 500ms before placing sell orders")
          await new Promise((resolve)=>setTimeout(resolve,intraPhaseGap))
 
  
          console.log("acc3 buys.", USDTQty+"USDT goes into open")
          const sellOrderAcc3 = await wsApiAcc3.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc3sellOrderID = sellOrderAcc3.result.id;
          console.log('Acc3 Buy Order:', acc3sellOrderID);

          console.log("Waiting for 100ms before placing next buy order")
          await new Promise((resolve)=>setTimeout(resolve,delayBuyOrders));

          console.log("acc4 buys.", USDTQty+"USDTgoes into open")
          const sellOrderAcc4 = await wsApiAcc4.createorder('ARY/USDT', 'sell', sellPrice, sellQuantity);
          const acc4sellOrderID = sellOrderAcc4.result.id;
          console.log('Acc4 Buy Order:', acc4sellOrderID);
          await new Promise((resolve)=>setTimeout(resolve,2000))
          console.log(
            "Insufficient Balance Phase 2. Retrying after 2 second..."
          );
          await new Promise((resolve)=>setTimeout(resolve,2000))
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
