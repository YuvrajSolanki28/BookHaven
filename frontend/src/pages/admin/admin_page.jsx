import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookForm } from '../../components/BookForm';
import { BookTable } from '../../components/BookTable';
import { toast } from 'react-hot-toast';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';

function AdminPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
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
            const response = await axios.get('http://localhost:8000/api/books');
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
            const response = await axios.post('http://localhost:8000/api/books', bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks([response.data.book, ...books]);
            toast.success('Book added successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add book');
        }
    };

    if (loading) return <div className="flex justify-center py-20">Loading...</div>;

    return (
        <>
            <AdminNavbar />
        <div className="container px-4 mx-auto py-28">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">
                Book Management
            </h1>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-semibold">Add New Book</h2>
                        <BookForm onAddBook={addBook} />
                    </div>
                </div>
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-semibold">Book Inventory ({books.length})</h2>
                        <BookTable books={books} />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AdminPage;
