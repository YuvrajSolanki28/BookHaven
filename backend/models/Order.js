const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    books: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        pdfUrl: { type: String }
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: { type: String },
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
