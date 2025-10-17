import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ShoppingCartIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react';
import Loader from '../components/Loader';

const BookDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!book);
  const [purchased, setPurchased] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ Fix: Wrap in useCallback to avoid ESLint warning
  const checkIfPurchased = useCallback(async () => {
    if (!user || !book) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const hasPurchased = response.data.some(order =>
        order.books.some(orderBook => orderBook.bookId === book._id)
      );
      setPurchased(hasPurchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
      toast.error('Failed to check purchase status');
    } finally {
      setLoading(false);
    }
  }, [user, book]);

  useEffect(() => {
    if (!book) {
      navigate('/booklist');
    } else {
      checkIfPurchased();
    }
  }, [book, navigate, checkIfPurchased]); // ✅ No ESLint warning now

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:8000/api/orders/create',
        { bookIds: [book._id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Purchase successful!');
      setPurchased(true);
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `http://localhost:8000/api/orders/download/${book._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // Important for file downloads
        }
      );

      // Create a blob link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title || 'book'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !book) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/booklist')}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Books
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Left column - Book Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-0"
          >
            <div className="overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="object-cover w-full rounded-lg h-96"
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 rounded-lg h-96">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right column - Book Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{book.title}</h1>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">by {book.author}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">${book.price}</span>
              {book.isDigital && (
                <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                  Digital Book
                </span>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {book.category && (
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{book.category}</span>
                  </div>
                )}
                {book.isbn && (
                  <div>
                    <span className="font-medium text-gray-700">ISBN:</span>
                    <span className="ml-2 text-gray-600">{book.isbn}</span>
                  </div>
                )}
                {book.pages && (
                  <div>
                    <span className="font-medium text-gray-700">Pages:</span>
                    <span className="ml-2 text-gray-600">{book.pages}</span>
                  </div>
                )}
                {book.fileSize && (
                  <div>
                    <span className="font-medium text-gray-700">File Size:</span>
                    <span className="ml-2 text-gray-600">{book.fileSize}</span>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <span className="font-medium text-gray-700">Publisher:</span>
                    <span className="ml-2 text-gray-600">{book.publisher}</span>
                  </div>
                )}
                {book.publicationDate && (
                  <div>
                    <span className="font-medium text-gray-700">Published:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(book.publicationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!user ? (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Login to Purchase
                </button>
              ) : purchased ? (
                <button
                  onClick={handleDownload}
                  disabled={actionLoading}
                  className="flex items-center justify-center w-full px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  {actionLoading ? 'Downloading...' : 'Download PDF'}
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={actionLoading}
                  className="flex items-center justify-center w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  {actionLoading ? 'Processing...' : `Buy Now - $${book.price}`}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Book Description */}
        {book.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Description</h2>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">{book.description}</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookDetailsPage;
