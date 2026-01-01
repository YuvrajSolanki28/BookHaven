const express = require('express');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const PaymentService = require('../services/paymentService');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Process payment
router.post('/process', verifyUser, async (req, res) => {
    try {
        const { orderId, paymentMethod, cardDetails, billingAddress } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID format' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Create payment record
        const payment = new Payment({
            orderId,
            userId: req.user.userId,
            amount: order.totalAmount,
            paymentMethod,
            billingAddress,
            cardDetails: cardDetails ? {
                last4: cardDetails.number.slice(-4),
                brand: cardDetails.brand || 'Unknown',
                expiryMonth: parseInt(cardDetails.expiry.split('/')[0]),
                expiryYear: parseInt(cardDetails.expiry.split('/')[1])
            } : undefined,
            paymentStatus: 'processing'
        });

        await payment.save();

        // Process payment
        const result = await PaymentService.processPayment({
            amount: order.totalAmount,
            paymentMethod,
            cardDetails
        });

        // Update payment and order
        payment.paymentStatus = 'completed';
        payment.transactionId = result.transactionId;
        payment.gatewayResponse = result.gatewayResponse;
        payment.updatedAt = new Date();
        await payment.save();

        order.paymentStatus = 'completed';
        order.paymentId = payment._id;
        await order.save();

        res.json({
            success: true,
            paymentId: payment._id,
            transactionId: result.transactionId,
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('Payment processing error:', error);
        
        // Update payment status to failed if payment exists and orderId is valid
        if (req.body.orderId && mongoose.Types.ObjectId.isValid(req.body.orderId)) {
            await Payment.findOneAndUpdate(
                { orderId: req.body.orderId, paymentStatus: 'processing' },
                { paymentStatus: 'failed', updatedAt: new Date() }
            );
        }

        res.status(400).json({ 
            error: error.message || 'Payment processing failed' 
        });
    }
});

// Get payment history
router.get('/history', verifyUser, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.userId })
            .populate('orderId')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

// Process refund
router.post('/refund/:paymentId', verifyUser, async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { reason } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (payment.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (payment.paymentStatus !== 'completed') {
            return res.status(400).json({ error: 'Payment cannot be refunded' });
        }

        const refundResult = await PaymentService.processRefund(
            paymentId, 
            payment.amount, 
            reason
        );

        payment.paymentStatus = 'refunded';
        payment.refundAmount = payment.amount;
        payment.refundReason = reason;
        payment.updatedAt = new Date();
        await payment.save();

        res.json({
            success: true,
            refundId: refundResult.refundId,
            message: 'Refund processed successfully'
        });

    } catch (error) {
        res.status(500).json({ error: 'Refund processing failed' });
    }
});

module.exports = router;
