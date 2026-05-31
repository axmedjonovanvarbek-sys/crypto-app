const { getCachedData } = require('../services/cryptoDataService');

const initCryptoSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial data immediately upon connection
    const initialData = getCachedData();
    if (initialData.length > 0) {
      socket.emit('cryptoUpdate', initialData);
    }

    // Set up real-time pseudo-updates for presentation purposes
    // Since CoinGecko API is rate-limited to ~1min, we'll stream slight price fluctuations
    // every 3 seconds to give the "real-time" feel without hitting external API limits.
    const mockUpdateInterval = setInterval(() => {
      const data = getCachedData();
      if (!data || data.length === 0) return;

      const fluctuatedData = data.map(coin => {
        // Random fluctuation between -0.05% and +0.05%
        const fluctuation = 1 + (Math.random() * 0.001 - 0.0005);
        const newPrice = coin.current_price * fluctuation;
        
        return {
          ...coin,
          current_price: newPrice,
          ai_analysis: {
            ...coin.ai_analysis,
            present_price: newPrice
          }
        };
      });

      socket.emit('cryptoUpdate', fluctuatedData);
    }, 3000);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      clearInterval(mockUpdateInterval);
    });
  });
};

module.exports = { initCryptoSocket };
