const XeggexSocketClient = require('./wsapiClass.js');
const dotenv = require('dotenv');

dotenv.config();

const acc1ApiKey = process.env.JeetApiKey;
const acc1ApiSecret = process.env.JeetApiSecret;

var xeggexApi = new XeggexSocketClient(acc1ApiKey, acc1ApiSecret);

// events

xeggexApi.on( "notification", ( message ) => {

	console.log("Type: " + message.method)

	console.log(JSON.stringify(message, null, 4));

});


(async () => {

	let isconnected = await xeggexApi.waitConnect();
	
	console.log('connected');



	try {
	
        
        while(true){
            let marketinfo = await xeggexApi.getmarket('ARY/USDT');
            console.log(marketinfo.result.volumeNumber);

            await new Promise((resolve)=>setTimeout(resolve,100))
        }
	} catch (e) {
	
		console.log(e);
	
	}


/* 
	try {
	
		let balanceinfo = await xeggexApi.getbalances();
		
		console.log(balanceinfo);
	
	} catch (e) {
	
		console.log(e);
	
	}


	try {
	
		let tradeinfo = await xeggexApi.gettrades('ARY/USDT');
		
		console.log(JSON.stringify(tradeinfo, null, 4));
	
	} catch (e) {
	
		console.log(e);
	
	}


	try {
	
		let subticker = await xeggexApi.subscribeticker('ARY/USDT');
		
		console.log(JSON.stringify(subticker, null, 4));
	
	} catch (e) {
	
		console.log(e);
	
	}



	try {
	
		let suborderbook = await xeggexApi.subscribeorderbook('ARY/USDT', 30);
		
		console.log(JSON.stringify(suborderbook, null, 4));
	
	} catch (e) {
	
		console.log(e);
	
	}
	


	try {
	
		let subtrades = await xeggexApi.subscribetrades('ARY/USDT');
		
		console.log(JSON.stringify(subtrades, null, 4));
	
	} catch (e) {
	
		console.log(e);
	
	}
	

	try {
	
		let getorders = await xeggexApi.getorders("ARY/USDT"); 
		
		console.log(JSON.stringify(getorders, null, 4));
	
	} catch (e) {
	
		console.log(e);
	
	}


 */	
})();