import xeggexApi from './xeggexApi.js'
import dotenv from "dotenv";

dotenv.config();
const ApiKey = process.env.NileshApiKey;
const ApiSecret = process.env.NileshApiSecret;

const restapi = new xeggexApi(ApiKey, ApiSecret);



(async () => {

	

	var openOrders = await restapi.getOpenOrders();
	console.log(openOrders);


		


})();


