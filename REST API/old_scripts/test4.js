// Assume you have an array of API keys and secrets for your 10 API accounts
const apiAccounts = [
    { apiKey: 'API_KEY_1', apiSecret: 'API_SECRET_1' },
    // Add other API accounts here
  ];
  
  const xeggexApi = require('./xeggexApi.js');
  
  async function generateVolume() {
    const symbol = 'ARY/USDT'; // Replace with the token pair you want to trade
    const numAccounts = apiAccounts.length;
    const orderSize = 0.1; // Adjust the order size based on your testing needs
  
    for (let i = 0; i < numAccounts; i++) {
      const { apiKey, apiSecret } = apiAccounts[i];
      const restApi = new xeggexApi(apiKey, apiSecret);
  
      try {
        // Fetch the current market price
        const marketData = await restApi.getMarket(symbol);
        const currentPrice = parseFloat(marketData.usdValue);
  
        // Place a buy limit order below the current price
        const buyPrice = currentPrice - 0.001; // Adjust the offset as needed
        await restApi.createLimitOrder(symbol, 'buy', orderSize, buyPrice);
  
        // Place a sell limit order above the current price
        const sellPrice = currentPrice - 0.001; // Adjust the offset as needed
        await restApi.createLimitOrder(symbol, 'sell', orderSize, sellPrice);
        
        console.log(`Orders placed for Account ${i + 1}`);
      } catch (error) {
        console.error(`Error in Account ${i + 1}:`, error.message);
      }
    }
  }
  generateVolume();  