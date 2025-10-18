const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }
}, { timestamps: true });

wishlistSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
