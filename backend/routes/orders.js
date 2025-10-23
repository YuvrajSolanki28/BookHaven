const express = require('express');
const Order = require('../models/Order');
const Book = require('../models/Books');
const jwt = require('jsonwebtoken');
const { sendOrderConfirmation } = require('../utils/sendemail');


const router = express.Router();

// Verify user middleware
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

// Create order
router.post('/create', verifyUser, async (req, res) => {
    try {
        const { bookIds } = req.body;
        
        const books = await Book.find({ _id: { $in: bookIds } });
        if (books.length !== bookIds.length) {
            return res.status(400).json({ error: 'Some books not found' });
        }

        const totalAmount = books.reduce((sum, book) => sum + book.price, 0);
        
        const order = new Order({
            userId: req.user.userId,
            books: books.map(book => ({
                bookId: book._id,
                title: book.title,
                price: book.price,
                pdfUrl: book.pdfUrl
            })),
            totalAmount,
            paymentStatus: 'completed', // Simulate successful payment
            paymentId: 'pay_' + Date.now()
        });

        await order.save();
        res.json({ message: 'Order created successfully', orderId: order._id });

        // Send order confirmation email
        await sendOrderConfirmation(req.user.email, {
            orderId: order._id,
            total: totalAmount,
            books: books.map(book => ({
                title: book.title,
                price: book.price
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get user orders
router.get('/my-orders', verifyUser, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Download book (only if purchased)
router.get('/download/:bookId', verifyUser, async (req, res) => {
    try {
        const order = await Order.findOne({
            userId: req.user.userId,
            'books.bookId': req.params.bookId,
            paymentStatus: 'completed'
        });

        if (!order) {
            return res.status(403).json({ error: 'Book not purchased' });
        }

        const book = order.books.find(b => b.bookId.toString() === req.params.bookId);
        res.json({ downloadUrl: book.pdfUrl, title: book.title });
    } catch (error) {
        res.status(500).json({ error: 'Download failed' });
    }
});

// Add to backend/routes/orders.js
router.get('/all-orders', verifyUser, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});


module.exports = router;
