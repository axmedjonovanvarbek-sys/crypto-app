// AI Analytics Service (Rule-based heuristics for MVP)

const analyzeTrends = (data) => {
  return data.map(coin => {
    // Basic heuristic: if 24h change is > 5% it's strong bullish
    // if < -5% strong bearish
    let trend = 'Neutral';
    let suggestion = 'Hold';
    let futurePrediction = coin.current_price;

    if (coin.price_change_percentage_24h > 5) {
      trend = 'Strong Bullish';
      suggestion = 'Buy';
      futurePrediction = coin.current_price * 1.05; // Predict 5% increase
    } else if (coin.price_change_percentage_24h > 1) {
      trend = 'Bullish';
      suggestion = 'Accumulate';
      futurePrediction = coin.current_price * 1.02; 
    } else if (coin.price_change_percentage_24h < -5) {
      trend = 'Strong Bearish';
      suggestion = 'Sell';
      futurePrediction = coin.current_price * 0.95;
    } else if (coin.price_change_percentage_24h < -1) {
      trend = 'Bearish';
      suggestion = 'Reduce';
      futurePrediction = coin.current_price * 0.98;
    }

    return {
      ...coin,
      ai_analysis: {
        trend,
        suggestion,
        previous_price: coin.current_price / (1 + (coin.price_change_percentage_24h / 100)),
        present_price: coin.current_price,
        predicted_future_price: futurePrediction,
        volatility: Math.abs(coin.price_change_percentage_24h) > 5 ? 'High' : 'Normal'
      }
    };
  });
};

module.exports = { analyzeTrends };
