const express = require('express');
const Book = require('../models/Books');
const SearchHistory = require('../models/SearchHistory');
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

// Get new releases
router.get('/new-releases', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const books = await Book.find({
            createdAt: { $gte: thirtyDaysAgo }
        }).sort({ createdAt: -1 });
        
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch new releases' });
    }
});

// Get all categories with book counts
router.get('/categories', async (req, res) => {
    try {
        const categories = await Book.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: "$_id",
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { category: 1 }
            }
        ]);
        
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Get books by category
router.get('/category/:category', async (req, res) => {
    try {
        const books = await Book.find({ 
            category: req.params.category 
        }).sort({ createdAt: -1 });
        
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books by category' });
    }
});

// Advanced search endpoint
router.get('/search', async (req, res) => {
    try {
        const { 
            q, 
            type = 'text', 
            isbn, 
            author, 
            genre, 
            publisher, 
            minPrice, 
            maxPrice,
            sortBy = 'relevance',
            page = 1,
            limit = 20,
            userId 
        } = req.query;

        let query = {};
        let searchQuery = q;

        // Build search query based on type
        switch (type) {
            case 'isbn':
                query.isbn = new RegExp(isbn || q, 'i');
                searchQuery = isbn || q;
                break;
            case 'author':
                query.author = new RegExp(author || q, 'i');
                searchQuery = author || q;
                break;
            case 'genre':
                query.category = new RegExp(genre || q, 'i');
                searchQuery = genre || q;
                break;
            case 'publisher':
                query.publisher = new RegExp(publisher || q, 'i');
                searchQuery = publisher || q;
                break;
            default:
                // Full-text search across multiple fields
                if (q) {
                    query.$or = [
                        { title: new RegExp(q, 'i') },
                        { author: new RegExp(q, 'i') },
                        { description: new RegExp(q, 'i') },
                        { category: new RegExp(q, 'i') },
                        { publisher: new RegExp(q, 'i') }
                    ];
                }
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Execute search
        let booksQuery = Book.find(query);

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                booksQuery = booksQuery.sort({ price: 1 });
                break;
            case 'price-desc':
                booksQuery = booksQuery.sort({ price: -1 });
                break;
            case 'title':
                booksQuery = booksQuery.sort({ title: 1 });
                break;
            case 'newest':
                booksQuery = booksQuery.sort({ createdAt: -1 });
                break;
            default:
                booksQuery = booksQuery.sort({ title: 1 });
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const books = await booksQuery.skip(skip).limit(parseInt(limit));
        const total = await Book.countDocuments(query);

        // Save search history
        if (searchQuery && userId) {
            await new SearchHistory({
                userId,
                query: searchQuery,
                searchType: type,
                resultsCount: total
            }).save();
        }

        res.json({
            books,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                count: total
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Auto-complete suggestions
router.get('/autocomplete', async (req, res) => {
    try {
        const { q, type = 'all' } = req.query;
        
        if (!q || q.length < 2) {
            return res.json([]);
        }

        const suggestions = new Set();
        const regex = new RegExp(q, 'i');

        if (type === 'all' || type === 'title') {
            const titles = await Book.find({ title: regex }).select('title').limit(5);
            titles.forEach(book => suggestions.add(book.title));
        }

        if (type === 'all' || type === 'author') {
            const authors = await Book.find({ author: regex }).select('author').limit(5);
            authors.forEach(book => suggestions.add(book.author));
        }

        if (type === 'all' || type === 'genre') {
            const genres = await Book.find({ category: regex }).select('category').limit(5);
            genres.forEach(book => suggestions.add(book.category));
        }

        if (type === 'all' || type === 'publisher') {
            const publishers = await Book.find({ publisher: regex }).select('publisher').limit(5);
            publishers.forEach(book => book.publisher && suggestions.add(book.publisher));
        }

        res.json(Array.from(suggestions).slice(0, 10));
    } catch (error) {
        res.status(500).json({ error: 'Autocomplete failed' });
    }
});

// Search history
router.get('/search-history/:userId', async (req, res) => {
    try {
        const history = await SearchHistory
            .find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch search history' });
    }
});

// Clear search history
router.delete('/search-history/:userId', async (req, res) => {
    try {
        await SearchHistory.deleteMany({ userId: req.params.userId });
        res.json({ message: 'Search history cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear search history' });
    }
});


module.exports = router;
