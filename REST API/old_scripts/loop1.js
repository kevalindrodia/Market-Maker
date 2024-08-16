import xeggexApi from './xeggexApi.js';
import dotenv from 'dotenv';
import Big from 'big.js';

dotenv.config();
const ApiKey = process.env.VipulApiKey;
const ApiSecret = process.env.VipulApiSecret;

const restapi = new xeggexApi(ApiKey, ApiSecret);

(async () => {
  try {
    var symbol = 'ARY/USDT';
    var side = 'SELL';


    var info = await restapi.getAsset("ARY");
    var ltp = info.usdValue;
    var valueAsBig = new Big(ltp);

    // Specify the quantity and price directly
    var quantity = 0.1; // Enter the desired quantity here
    var price = 0.12; // Enter the desired price here

    console.log("Current price of ARY:", valueAsBig.toFixed(8));
    console.log("Creating", side, "order for", symbol);
    var calcValue = valueAsBig.times(quantity);
    console.log("Market Price for Current Quantity:", calcValue.toFixed(8));

    // Create the limit order with the specified quantity and price
    const newOrder = await restapi.createLimitOrder(symbol, side, parseFloat(quantity), parseFloat(price));
    console.log(newOrder);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
