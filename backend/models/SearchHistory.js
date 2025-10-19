// backend/models/SearchHistory.js
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    query: { type: String, required: true },
    searchType: { type: String, enum: ['text', 'isbn', 'author', 'genre', 'publisher'], default: 'text' },
    resultsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

searchHistorySchema.index({ userId: 1, createdAt: -1 });
searchHistorySchema.index({ query: 'text' });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
