// backend/routes/marketing.js
const express = require('express');
const Coupon = require('../models/Coupon');
const Users = require('../models/User');
const router = express.Router();

// Apply coupon
router.post('/apply-coupon', async (req, res) => {
    try {
        const { code, amount } = req.body;
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(), 
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        });

        if (!coupon) return res.status(404).json({ error: 'Invalid coupon' });
        if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon expired' });
        if (amount < coupon.minAmount) return res.status(400).json({ error: `Minimum amount $${coupon.minAmount}` });

        let discount = coupon.type === 'percentage' ? (amount * coupon.value / 100) : coupon.value;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

        res.json({ discount, finalAmount: amount - discount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to apply coupon' });
    }
});

// Newsletter subscription
router.post('/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        await Users.findOneAndUpdate({ email }, { 'preferences.newsletter': true });
        res.json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// Get user loyalty points
router.get('/loyalty/:userId', async (req, res) => {
    try {
        const user = await Users.findById(req.params.userId).select('loyaltyPoints');
        res.json({ points: user.loyaltyPoints || 0 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch points' });
    }
});

module.exports = router;
