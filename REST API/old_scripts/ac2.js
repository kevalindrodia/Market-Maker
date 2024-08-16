import xeggexApi from './xeggexApi.js';
import dotenv from 'dotenv';
import readline from 'readline';
import Big from 'big.js';

dotenv.config();
const ApiKey = process.env.NileshApiKey;
const ApiSecret = process.env.NileshApiSecret;

const restapi = new xeggexApi(ApiKey, ApiSecret);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    var symbol = 'ARY/USDT';
    var side = 'BUY';
    var info = await restapi.getAsset("ARY");
    var ltp = info.usdValue;
    var valueAsBig = new Big(ltp);
    console.log("Current price of ARY:",valueAsBig);
    console.log("Creating",side,"order for",symbol)
    rl.question('Enter the quantity: ', async (quantity) => {
      var calcValue = valueAsBig.times(quantity);
      console.log("Market Price for Current Quantity:",calcValue)
      rl.question('Enter the price: ', async (price) => {
        try {
          const newOrder = await restapi.createLimitOrder(symbol, side, parseFloat(quantity), parseFloat(price));
          console.log(newOrder);
        } catch (error) {
          console.error('Error creating limit order:', error.message);
        } finally {
          rl.close();
        }
      });
    });
  } catch (error) {
    console.error('Error reading user input:', error.message);
  }
})();
