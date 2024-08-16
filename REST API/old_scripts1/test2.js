import xeggexApi from './xeggexApi.js'
import dotenv from 'dotenv';

dotenv.config();

const acc1ApiKey = process.env.NileshApiKey;
const acc1ApiSecret = process.env.NileshApiSecret;

const restapiAcc1 = new xeggexApi(acc1ApiKey, acc1ApiSecret);



(async () => {

	

	
  const tradeQuantity = 0.2;
  // Fetch market information for the ARY/USDT trading pair
  const marketInfo = await restapiAcc1.getMarket('ARY_USDT');
  const ltp = parseFloat(marketInfo.lastPrice);
  console.log(ltp)
  // Calculate buy and sell quantities
  const buyQuantity = tradeQuantity / ltp;
  const sellQuantity = tradeQuantity / ltp;

  // Calculate buy and sell prices
  const baseBuyPrice = ltp - 0.001;
  const baseSellPrice = ltp - 0.001;
  const buyPrice = baseBuyPrice * buyQuantity;
  const sellPrice = baseSellPrice * sellQuantity;
		
	
	var neworder1 = await restapiAcc1.createLimitOrder('ARY/USDT', 'buy', buyPrice, sellPrice);
	console.log(neworder1)

})();

