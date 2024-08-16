import xeggexApi from './xeggexApi.js'
import dotenv from "dotenv";
// import Big from 'big.js';

dotenv.config();
const ac1ApiKey = process.env.VipulApiKey;
const ac1ApiSecret = process.env.VipulApiSecret;
const ac2ApiKey = process.env.NileshApiKey;
const ac2ApiSecret = process.env.NileshApiSecret;

const restapi1 = new xeggexApi(ac1ApiKey, ac1ApiSecret);
const restapi2 = new xeggexApi(ac2ApiKey, ac2ApiSecret);



(async () => {

	var ac1balances = await restapi1.getBalances();
	var ac2balances = await restapi2.getBalances();
    var info = await restapi1.getAsset("ARY");

        // Define the assets you want to filter
        const targetAssets = ['ARY', 'USDT'];

        // Filter the balances array to get only the balances of the target assets
        const filteredac1Balances = ac1balances.filter((ac1balances) => targetAssets.includes(ac1balances.asset));
        const filteredac2Balances = ac2balances.filter((ac2balances) => targetAssets.includes(ac2balances.asset));

        var ac1ARYbalance = parseFloat(filteredac1Balances[0].available);
        var ac1USDTbalance = parseFloat(filteredac1Balances[1].available);
        var ac2ARYbalance = parseFloat(filteredac2Balances[0].available);
        var ac2USDTbalance = parseFloat(filteredac2Balances[1].available);
        var ltp = parseFloat(info.usdValue);
        console.log("Current price of ARY:",ltp,"\n");
        console.log("Balance of ARY ac1:", ac1ARYbalance);
        console.log("Balance of USDT ac1:", ac1USDTbalance,"\n");
        console.log("Balance of ARY ac2:", ac2ARYbalance);
        console.log("Balance of USDT ac2:", ac2USDTbalance);

})();


