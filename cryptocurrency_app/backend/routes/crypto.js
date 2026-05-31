const express = require('express');
const router = express.Router();
const { getCachedData, getCoinHistory } = require('../services/cryptoDataService');

// @route   GET /api/crypto
router.get('/', (req, res) => {
  const data = getCachedData();
  res.json(data);
});

// @route   GET /api/crypto/trending
router.get('/trending', (req, res) => {
  const data = getCachedData();
  // Sort by 24h change desc
  const trending = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5);
  res.json(trending);
});

// @route   GET /api/crypto/history/:id
router.get('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days) || 7;
    const history = await getCoinHistory(id, days);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
