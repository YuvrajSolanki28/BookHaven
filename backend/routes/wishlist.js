const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Wishlist = require('../models/Wishlist');

// Auth middleware function
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id || decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id }).populate('bookId');
    const formattedWishlist = wishlist.map(item => ({
      _id: item._id,
      book: item.bookId
    }));
    res.json(formattedWishlist);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    const wishlistItem = new Wishlist({ userId: req.user.id, bookId });
    await wishlistItem.save();
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Book already in wishlist' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/wishlist
router.delete('/', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    await Wishlist.findOneAndDelete({ userId: req.user.id, bookId });
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
