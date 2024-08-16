import xeggexApi from './xeggexApi.js'
import dotenv from "dotenv";
// import Big from 'big.js';

dotenv.config();
const ApiKey = process.env.NileshApiKey;
const ApiSecret = process.env.NileshApiSecret;

const restapi = new xeggexApi(ApiKey, ApiSecret);



(async () => {

	var balances = await restapi.getBalances();
    var info = await restapi.getAsset("ARY");

        // Define the assets you want to filter
        const targetAssets = ['ARY', 'USDT'];

        // Filter the balances array to get only the balances of the target assets
        const filteredBalances = balances.filter((balance) => targetAssets.includes(balance.asset));
        var ARYbalance = parseFloat(filteredBalances[0].available);
        var USDTbalance = parseFloat(filteredBalances[1].available);
        var ltp = parseFloat(info.usdValue);
        console.log("Current price of ARY:",ltp);
        console.log("Balance of ARY:", ARYbalance);
        console.log("Balance of USDT:", USDTbalance);
        /* 	
    var info = await restapi.getAsset('ARY');
    var ltp = info.usdValue;
    var valueAsBig = new Big(ltp);
	console.log("Market Price:",valueAsBig);
    var tokenID = info.id;
	console.log("TokenID:",tokenID);
    var MarketCap = info.marketcapNumber;
    console.log("Market Cap:",MarketCap);
*/
})();


