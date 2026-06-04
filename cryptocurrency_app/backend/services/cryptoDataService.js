const axios = require('axios');
const NodeCache = require('node-cache');
const { analyzeTrends } = require('./aiAnalyticsService');

let cachedCryptoData = [];

const COINS = [
  { id: 'bitcoin', symbol: 'BTCUSDT', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETHUSDT', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOLUSDT', name: 'Solana' },
  { id: 'binancecoin', symbol: 'BNBUSDT', name: 'BNB' },
  { id: 'ripple', symbol: 'XRPUSDT', name: 'XRP' },
  { id: 'dogecoin', symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ADAUSDT', name: 'Cardano' },
  { id: 'polkadot', symbol: 'DOTUSDT', name: 'Polkadot' }
];

const fetchCoinGecko = async () => {
  try {
    const ids = COINS.map(c => c.id).join(',');
    const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = {};
    res.data.forEach(coin => {
      data[coin.id] = coin.current_price;
    });
    return { prices: data, raw: res.data };
  } catch (error) {
    console.error('CoinGecko fetch error:', error.message);
    return null;
  }
};

const fetchCoinCap = async () => {
  try {
    const ids = COINS.map(c => c.id).join(',');
    let coinCapData = null;
    
    try {
      const res = await axios.get(`https://api.coincap.io/v2/assets?ids=${ids}`, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const data = {};
      res.data.data.forEach(coin => {
        data[coin.id] = parseFloat(coin.priceUsd);
      });
      coinCapData = data;
    } catch (error) {
      console.log("CoinCap vaqtincha ishlamayapti, lekin muammo yo'q!");
      coinCapData = {}; // Xato bo'lsa bo'sh object qaytarib yuboraveramiz
    }
    
    return coinCapData;
  } catch (error) {
    console.error('CoinCap fetch error:', error.message);
    return null;
  }
};

const fetchBinance = async () => {
  try {
    const symbols = COINS.map(c => c.symbol);
    // Binance API-ga to'g'ri formatda so'rov
    const res = await axios.get(`https://api.binance.com/api/v3/ticker/price`, {
      params: {
        symbols: JSON.stringify(symbols)
      },
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const data = {};
    if (Array.isArray(res.data)) {
      res.data.forEach(coin => {
        const matched = COINS.find(c => c.symbol === coin.symbol);
        if (matched) {
          data[matched.id] = parseFloat(coin.price);
        }
      });
    }
    return data;
  } catch (error) {
    console.error('Binance fetch error:', error.message);
    return null;
  }
};

const getMedian = (values) => {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

const fetchCryptoData = async () => {
  try {
    const [coinGeckoRes, coinCapRes, binanceRes] = await Promise.all([
      fetchCoinGecko(),
      fetchCoinCap(),
      fetchBinance()
    ]);

    if (!coinGeckoRes || !coinGeckoRes.raw) return cachedCryptoData; // Fallback if main source fails

    const aggregatedData = coinGeckoRes.raw.map(coin => {
      const prices = [];
      const sources = [];

      if (coinGeckoRes.prices[coin.id]) {
        prices.push(coinGeckoRes.prices[coin.id]);
        sources.push({ name: 'CoinGecko', price: coinGeckoRes.prices[coin.id], url: `https://www.coingecko.com/en/coins/${coin.id}` });
      }
      if (coinCapRes && coinCapRes[coin.id]) {
        prices.push(coinCapRes[coin.id]);
        sources.push({ name: 'CoinCap', price: coinCapRes[coin.id], url: `https://coincap.io/assets/${coin.id}` });
      }
      if (binanceRes && binanceRes[coin.id]) {
        prices.push(binanceRes[coin.id]);
        const matchedSymbol = COINS.find(c => c.id === coin.id)?.symbol || 'BTCUSDT';
        sources.push({ name: 'Binance', price: binanceRes[coin.id], url: `https://www.binance.com/en/trade/${matchedSymbol.replace('USDT', '_USDT')}?type=spot` });
      }

      const reliablePrice = getMedian(prices);
      
      return {
        ...coin,
        current_price: reliablePrice || coin.current_price,
        data_sources: prices.length,
        source_breakdown: sources // Array of { name, price }
      };
    });

    cachedCryptoData = analyzeTrends(aggregatedData);
    return cachedCryptoData;
  } catch (error) {
    console.error('Error in aggregated fetch:', error.message);
    return cachedCryptoData;
  }
};

const historyCache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL
const staleCache = {}; // Eskirgan ma'lumotlarni saqlash (429 xatosi uchun)
const activeRequests = {}; // Cache stampede (bir vaqtda bir nechta bir xil so'rov) oldini olish

const getCoinHistory = async (id, days = 7) => {
  const cacheKey = `${id}_${days}`;
  const cachedData = historyCache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  // Agar xuddi shu coin uchun so'rov ketayotgan bo'lsa, o'shani kutamiz (Stampede oldini olish)
  if (activeRequests[cacheKey]) {
    return activeRequests[cacheKey];
  }

  activeRequests[cacheKey] = (async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
        params: { 
          vs_currency: 'usd', 
          days: days 
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      historyCache.set(cacheKey, response.data);
      staleCache[cacheKey] = response.data; // Zaxiraga olamiz
      
      return response.data;
    } catch (error) {
      const isRateLimit = error?.response?.status === 429;
      
      // Agar 429 xatosi bersa va zaxira kesh (stale) bo'lsa, shuni qaytaramiz
      if (isRateLimit && staleCache[cacheKey]) {
        console.warn(`CoinGecko 429 xatosi: ${cacheKey} uchun eski zaxira kesh qaytarilmoqda.`);
        return staleCache[cacheKey];
      }

      console.error(`Error fetching history for ${id}:`, error.message);
      throw error;
    } finally {
      delete activeRequests[cacheKey]; // So'rov tugagach, tozalaymiz
    }
  })();

  return activeRequests[cacheKey];
};

const getCachedData = () => cachedCryptoData;

const startCryptoPolling = (io) => {
  fetchCryptoData().then(data => {
    if (io) io.emit('cryptoUpdate', data);
  });

  // 60 sekund o'rniga 120 sekunda ko'proq kutamiz, rate limiting kamaytirish uchun
  setInterval(async () => {
    const data = await fetchCryptoData();
    if (io && data.length > 0) {
      io.emit('cryptoUpdate', data);
    }
  }, 120000);
};

module.exports = {
  fetchCryptoData,
  getCachedData,
  getCoinHistory,
  startCryptoPolling
};
