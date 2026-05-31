const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hasAdmin = (await User.exists({ role: 'admin' })) !== null;
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: hasAdmin ? 'user' : 'admin',
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      const hasAdmin = (await User.exists({ role: 'admin' })) !== null;

      if (!hasAdmin) {
        user.role = 'admin';
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        watchlist: user.watchlist,
        portfolio: user.portfolio
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/watchlist
router.get('/watchlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.watchlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/watchlist
router.post('/watchlist', protect, async (req, res) => {
  try {
    const { coinId } = req.body;
    if (!coinId) {
      return res.status(400).json({ message: 'Coin ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user.watchlist.includes(coinId)) {
      user.watchlist.push(coinId);
      await user.save();
    }
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/auth/watchlist/:coinId
router.delete('/watchlist/:coinId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter((coinId) => coinId !== req.params.coinId);
    await user.save();

    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/portfolio
router.get('/portfolio', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.portfolio || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/portfolio
router.post('/portfolio', protect, async (req, res) => {
  try {
    const { coinId, amount, buyPrice } = req.body;
    const parsedAmount = Number(amount);
    const parsedBuyPrice = buyPrice === undefined || buyPrice === '' ? 0 : Number(buyPrice);

    if (!coinId) {
      return res.status(400).json({ message: 'Coin ID is required' });
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (!Number.isFinite(parsedBuyPrice) || parsedBuyPrice < 0) {
      return res.status(400).json({ message: 'Buy price cannot be negative' });
    }

    const user = await User.findById(req.user._id);
    const existingHolding = user.portfolio.find((holding) => holding.coinId === coinId);

    if (existingHolding) {
      existingHolding.amount = parsedAmount;
      existingHolding.buyPrice = parsedBuyPrice;
    } else {
      user.portfolio.push({
        coinId,
        amount: parsedAmount,
        buyPrice: parsedBuyPrice,
      });
    }

    await user.save();
    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/auth/portfolio/:coinId
router.delete('/portfolio/:coinId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.portfolio = user.portfolio.filter((holding) => holding.coinId !== req.params.coinId);
    await user.save();

    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
