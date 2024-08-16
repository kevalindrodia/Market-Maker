import xeggexApi from './xeggexApi.js';
import dotenv from "dotenv";

dotenv.config();
const ac1ApiKey = process.env.VipulApiKey;
const ac1ApiSecret = process.env.VipulApiSecret;
const ac2ApiKey = process.env.NileshApiKey;
const ac2ApiSecret = process.env.NileshApiSecret;

const restapi1 = new xeggexApi(ac1ApiKey, ac1ApiSecret);
const restapi2 = new xeggexApi(ac2ApiKey, ac2ApiSecret);

(async () => {
  try {
    var ac1balances = await restapi1.getBalances();
    var ac2balances = await restapi2.getBalances();
    var info = await restapi1.getAsset("ARY");

    // Define the assets you want to filter
    const targetAssets = ['ARY', 'USDT'];

    // Filter the balances array to get only the balances of the target assets
    var filteredac1Balances = ac1balances.filter((balance) => targetAssets.includes(balance.asset));
    var filteredac2Balances = ac2balances.filter((balance) => targetAssets.includes(balance.asset));

    var ac1ARYbalance = parseFloat(filteredac1Balances[0].available);
    var ac1USDTbalance = parseFloat(filteredac1Balances[1].available);
    var ac2ARYbalance = parseFloat(filteredac2Balances[0].available);
    var ac2USDTbalance = parseFloat(filteredac2Balances[1].available);
    var ltp = parseFloat(info.usdValue);
    console.log("Current price of ARY:", ltp, "\n");
    console.log("Balance of ARY ac1:", ac1ARYbalance);
    console.log("Balance of USDT ac1:", ac1USDTbalance, "\n");
    console.log("Balance of ARY ac2:", ac2ARYbalance);
    console.log("Balance of USDT ac2:", ac2USDTbalance,'\n');

// Define the quantity you want to trade
const quantityToTrade = 0.1;
var calcValue = ltp * quantityToTrade;
console.log("Market Price for Current Quantity:", calcValue);

// Define the spread percentage (adjust this value based on your strategy)
const spreadPercentage = 0.14; // For example, 0.5% spread

// Calculate the buy and sell prices based on the spread
const sellPrice = calcValue * (1 + spreadPercentage / 100);
const buyPrice = calcValue * (1 - spreadPercentage / 100);

// Place limit buy order on account 2
const buyOrder = await restapi2.createLimitOrder('ARY/USDT', 'BUY', quantityToTrade, calcValue);
console.log("Limit buy order placed on account 2:", buyOrder);

// Place limit sell order on account 1
const sellOrder = await restapi1.createLimitOrder('ARY/USDT', 'SELL', quantityToTrade, sellPrice);
console.log("Limit sell order placed on account 1:", sellOrder);


var ac1balances = await restapi1.getBalances();
var ac2balances = await restapi2.getBalances();
var filteredac1Balances = ac1balances.filter((balance) => targetAssets.includes(balance.asset));
var filteredac2Balances = ac2balances.filter((balance) => targetAssets.includes(balance.asset));

var ac1ARYbalance = parseFloat(filteredac1Balances[0].available);
var ac1USDTbalance = parseFloat(filteredac1Balances[1].available);
var ac2ARYbalance = parseFloat(filteredac2Balances[0].available);
var ac2USDTbalance = parseFloat(filteredac2Balances[1].available);
var ltp = parseFloat(info.usdValue);
console.log("Current price of ARY:", ltp, "\n");
console.log("Balance of ARY ac1:", ac1ARYbalance);
console.log("Balance of USDT ac1:", ac1USDTbalance, "\n");
console.log("Balance of ARY ac2:", ac2ARYbalance);
console.log("Balance of USDT ac2:", ac2USDTbalance,'\n');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
