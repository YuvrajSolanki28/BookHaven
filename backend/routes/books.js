const express = require('express');
const Book = require('../models/Books');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin middleware
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) return res.status(403).json({ error: 'Admin access required' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Add book (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'ISBN already exists' });
        } else {
            res.status(500).json({ error: 'Failed to add book' });
        }
    }
});

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Update book (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Delete book (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

module.exports = router;
