import xeggexApi from './xeggexApi.js'
import dotenv from 'dotenv';

dotenv.config();
const yourApiKey = process.env.NileshApiKey;
const yourApiSecret = process.env.NileshApiSecret;

const restapi = new xeggexApi(yourApiKey, yourApiSecret);



(async () => {

	

	
	//var balances = await restapi.getBalances();
	//console.log(balances);
	
	//var openorders = await restapi.getCancelledOrders();
	//console.log(openorders);
	
	// var tradehistory = await restapi.getTradeHistory();
	// console.log(tradehistory);
		
	
	//var neworder1 = await restapi.createLimitOrder('XGX/USDC', 'buy', 1, 0.01);
	//console.log(neworder1)

	const marketInfo = await restapi.getMarket('ARY_USDT');
	const currentPrice = parseFloat(marketInfo.lastPrice);
	console.log((currentPrice>1));


})();


