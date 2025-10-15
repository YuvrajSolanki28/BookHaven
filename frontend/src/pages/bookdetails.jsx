import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ShoppingCartIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react';

const BookDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(location.state?.book || null);
  const [loading, setLoading] = useState(!book);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!book) {
      // If no book data, redirect back to booklist
      navigate('/booklist');
    } else {
      checkIfPurchased();
    }
  }, [book, navigate]);

  const checkIfPurchased = async () => {
    if (!user || !book) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const hasPurchased = response.data.some(order => 
        order.books.some(orderBook => orderBook.bookId === book._id)
      );
      setPurchased(hasPurchased);
    } catch (error) {
      console.error('Error checking purchase status');
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/orders/create', 
        { bookIds: [book._id] }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Purchase successful!');
      setPurchased(true);
    } catch (error) {
      toast.error('Purchase failed');
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/orders/download/${book._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = `${book.title}.pdf`;
      link.click();
      
      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  if (loading || !book) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
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
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              {book.imageUrl ? (
                <img 
                  src={book.imageUrl} 
                  alt={book.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-200 rounded-lg">
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
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">${book.price}</span>
              {book.isDigital && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Digital Book
                </span>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">{book.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">ISBN:</span>
                  <span className="ml-2 text-gray-600">{book.isbn}</span>
                </div>
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
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  Login to Purchase
                </button>
              ) : purchased ? (
                <button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
              ) : (
                <button 
                  onClick={handlePurchase}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Buy Now - ${book.price}
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
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookDetailsPage;
