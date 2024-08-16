import xeggexApi from './xeggexApi.js'
import dotenv from "dotenv";

dotenv.config();
const ApiKey = process.env.VipulApiKey;
const ApiSecret = process.env.VipulApiSecret;

const restapi = new xeggexApi(ApiKey, ApiSecret);



(async () => {




	const marketInfo = await restapi.getMarket('ARY_USDT');
	const ltp = parseFloat(marketInfo);
	console.log(ltp)


})();


