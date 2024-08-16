import xeggexApi from './xeggexApi.js';
import dotenv from "dotenv";

dotenv.config();
const ac1ApiKey = process.env.VipulApiKey;
const ac1ApiSecret = process.env.VipulApiSecret;
const ac2ApiKey = process.env.NileshApiKey;
const ac2ApiSecret = process.env.NileshApiSecret;

const restapi1 = new xeggexApi(ac1ApiKey, ac1ApiSecret);
const restapi2 = new xeggexApi(ac2ApiKey, ac2ApiSecret);

const tradeIntervalMs = 2500; // Set the interval between trades in milliseconds
const delayBetweenBuyAndSellMs = 1000; // Set the delay between buy and sell orders in milliseconds

(async () => {
    try {
        while (true) {
            try {
                var ac2balances = await restapi2.getBalances();
                var info = await restapi1.getAsset("ARY");

                // Define the assets you want to filter
                const targetAssets = ['ARY', 'USDT'];

                // Filter the balances array to get only the balances of the target asset
                var filteredac2Balances = ac2balances.filter((balance) => targetAssets.includes(balance.asset));

                var ac2ARYbalance = parseFloat(filteredac2Balances.find((balance) => balance.asset === 'ARY').available);
                var ac2USDTbalance = parseFloat(filteredac2Balances.find((balance) => balance.asset === 'USDT').available);
                var ltp = parseFloat(info.usdValue);
                console.log("Current price of ARY:", ltp, "\n");
                console.log("Balance of ARY ac2:", ac2ARYbalance);
                console.log("Balance of USDT ac2:", ac2USDTbalance, '\n');

                // Calculate the quantity to trade as a percentage of the available balance (adjust the percentage based on your strategy)
                const tradePercentage = 5; // For example, trade 5% of available balance
                const quantityToTrade = (tradePercentage / 100) * ac2USDTbalance;

                // Place market buy order on account 2 using createMarketOrder function
                const buyOrder = await restapi2.createMarketOrder('ARY/USDT', 'BUY', quantityToTrade);
                console.log("Market buy order placed on account 2:", buyOrder);

                // Add a delay before placing the sell order
                await new Promise(resolve => setTimeout(resolve, delayBetweenBuyAndSellMs));

                // Fetch the latest market price after the delay
                // const updatedInfo = await restapi1.getAsset("ARY");
                // const sellPrice = parseFloat(updatedInfo.usdValue);

                // Place market sell order on account 2 using createMarketOrder function
                const sellOrder = await restapi2.createMarketOrder('ARY/USDT', 'SELL', quantityToTrade);
                console.log("Market sell order placed on account 2:", sellOrder);

            } catch (error) {
                console.error('Error:', error.message);
            }

            await new Promise(resolve => setTimeout(resolve, tradeIntervalMs)); // Add a delay between trades

        }
    } catch (error) {
        console.error('Error in while loop:', error.message);
    }
})();
