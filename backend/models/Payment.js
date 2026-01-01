const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: { 
        type: String, 
        enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay'],
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending' 
    },
    transactionId: { type: String, unique: true },
    gatewayResponse: { type: Object },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    cardDetails: {
        last4: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number
    },
    refundAmount: { type: Number, default: 0 },
    refundReason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
