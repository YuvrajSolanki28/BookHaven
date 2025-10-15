const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    publisher: { type: String },
    publicationDate: { type: Date },
    description: { type: String },
    imageUrl: { type: String },
    // Digital book fields
    isDigital: { type: Boolean, default: true },
    pdfUrl: { type: String }, // URL to PDF file
    fileSize: { type: String }, // e.g., "2.5 MB"
    pages: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
