import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ShoppingCartIcon, DownloadIcon, ArrowLeftIcon, ShareIcon, HeartIcon } from 'lucide-react';
import Loader from '../components/Loader';

const BookDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!book);
  const [purchased, setPurchased] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const fetchBook = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      toast.error('Book not found');
      navigate('/booklist');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const checkIfPurchased = useCallback(async () => {
    if (!user || !book) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const hasPurchased = response.data.some(order =>
        order.books.some(orderBook => orderBook.bookId === book._id)
      );
      setPurchased(hasPurchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, book]);

  useEffect(() => {
    if (!book) {
      fetchBook();
    } else {
      checkIfPurchased();
    }
  }, [book, fetchBook, checkIfPurchased]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/create`,
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
        `${process.env.REACT_APP_BACKEND_URL}/api/orders/download/${book._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

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

  const handleShare = async () => {
    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" by ${book.author} - $${book.price}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Share failed');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = isLiked ? 'DELETE' : 'POST';

      await axios({
        method,
        url: `${process.env.REACT_APP_BACKEND_URL}/api/wishlist`,
        data: { bookId: book._id },
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };


  if (loading || !book) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/booklist')}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Books
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-0"
          >
            <div className="overflow-hidden bg-gray-200 rounded-lg dark:bg-gray-700">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="object-cover w-full rounded-lg h-96"
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-200 rounded-lg dark:bg-gray-700 h-96">
                  <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                </div>
              )}
            </div>
          </motion.div>

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
                <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  Digital Book
                </span>
              )}
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center justify-center w-full px-6 py-3 rounded-lg ${isLiked
                ? 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-400'
                : 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
                } hover:bg-gray-200 dark:hover:bg-gray-600`}
            >
              <HeartIcon className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>


            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
              <div className="grid grid-cols-1 gap-3 text-sm">
                {book.category && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                    <span className="text-gray-600 dark:text-gray-400">{book.category}</span>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">ISBN:</span>
                    <span className="text-gray-600 dark:text-gray-400">{book.isbn}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Pages:</span>
                    <span className="text-gray-600 dark:text-gray-400">{book.pages}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Publisher:</span>
                    <span className="text-gray-600 dark:text-gray-400">{book.publisher}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
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

              <button
                onClick={handleShare}
                className="flex items-center justify-center w-full px-6 py-3 text-gray-700 bg-gray-100 rounded-lg dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share Book
              </button>
            </div>
          </motion.div>
        </div>

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
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          totalAmount={book.price}
          onPaymentSuccess={handlePaymentSuccess}
        />

      </main>
    </div>
  );
};

export default BookDetailsPage;
