import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { DownloadIcon, BookOpenIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyLibrary = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.BACKEND_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch library');
    } finally {
      setLoading(false);
    }
  };

  const downloadBook = async (bookId, title) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.BACKEND_URL}/api/orders/download/${bookId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // Create blob download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  if (!user)
    return (
      <div className="container px-4 py-20 mx-auto text-center text-gray-700 dark:text-gray-300">
        Please login to view your library
      </div>
    );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen px-4 py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-4xl font-bold text-center text-gray-900 dark:text-white"
        >
          My Digital Library
        </motion.h1>

        {/* Empty State */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <BookOpenIcon className="w-20 h-20 mb-6 text-gray-400" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You haven’t purchased any books yet.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 transition-shadow duration-300 bg-white shadow-md dark:bg-gray-800 rounded-xl hover:shadow-lg"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Books List */}
                  <div className="space-y-4">
                    {order.books.map((book) => (
                      <motion.div
                        key={book.bookId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-3 transition-colors rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {book.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            ${book.price}
                          </p>
                        </div>
                        <button
                          onClick={() => downloadBook(book.bookId, book.title)}
                          className="flex items-center px-4 py-2 text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
