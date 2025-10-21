import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookForm } from '../../components/BookForm';
import { BookTable } from '../../components/BookTable';
import ConfirmModal from '../../components/ConfirmModal';
import AdminNavbar from '../../components/AdminNavbar';
import Loader from '../../components/Loader';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function AddBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBook, setEditingBook] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, bookId: null, bookTitle: '' });
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.isAdmin) {
            toast.error('Unauthorized access');
            return;
        }
        fetchBooks();
    }, [user]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('https://book-haven-iota.vercel.app/api/books');
            setBooks(response.data);
        } catch (error) {
            toast.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    const addBook = async (bookData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://book-haven-iota.vercel.app/api/books', bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks([response.data.book, ...books]);
            toast.success('Book added successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add book');
        }
    };

    const editBook = async (bookData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`https://book-haven-iota.vercel.app/api/books/${editingBook._id}`, bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(books.map(book => book._id === editingBook._id ? response.data.book : book));
            setEditingBook(null);
            toast.success('Book updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update book');
        }
    };

    const deleteBook = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://book-haven-iota.vercel.app/api/books/${deleteModal.bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(books.filter(book => book._id !== deleteModal.bookId));
            toast.success('Book deleted successfully');
            setDeleteModal({ isOpen: false, bookId: null, bookTitle: '' });
        } catch (error) {
            toast.error('Failed to delete book');
        }
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
    };

    const handleCancelEdit = () => {
        setEditingBook(null);
    };

    const handleDeleteBook = (bookId) => {
    const book = books.find(b => b._id === bookId);
    setDeleteModal({
        isOpen: true,
        bookId: bookId,
        bookTitle: book?.title || 'Unknown Book'
    });
};

    const handleCancelDelete = () => {
        setDeleteModal({ isOpen: false, bookId: null, bookTitle: '' });
    };


    if (loading) return <Loader />;

    return (
        <>
            <AdminNavbar />
            <div className="container px-4 py-8 mx-auto">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">
                    Book Management
                </h1>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h2 className="mb-4 text-xl font-semibold">
                                {editingBook ? 'Edit Book' : 'Add New Book'}
                            </h2>
                            <BookForm
                                onAddBook={editingBook ? editBook : addBook}
                                editingBook={editingBook}
                                onCancel={handleCancelEdit}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h2 className="mb-4 text-xl font-semibold">Book Inventory ({books.length})</h2>
                            <BookTable
                                books={books}
                                onEditBook={handleEditBook}
                                onDeleteBook={handleDeleteBook}
                            />
                        </div>
                    </div>
                    <ConfirmModal
                        isOpen={deleteModal.isOpen}
                        onClose={handleCancelDelete}
                        onConfirm={deleteBook}
                        title="Delete Book"
                        message={`Are you sure you want to delete "${deleteModal.bookTitle}"? This action cannot be undone.`}
                        confirmText="Delete"
                        cancelText="Cancel"
                    />
                </div>
            </div>
        </>
    );
}

export default AddBooks;
