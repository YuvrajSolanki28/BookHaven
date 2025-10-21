// backend/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', couponSchema);
