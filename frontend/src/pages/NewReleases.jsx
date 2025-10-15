import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import BookCard from "../components/Bookcard";
import Loader from "../components/Loader";
import { CalendarIcon, TrendingUpIcon } from "lucide-react";

function NewReleases() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchNewReleases();
  }, []);

  const fetchNewReleases = async () => {
    try {
        // Temporarily get all books sorted by newest first
        const response = await axios.get('http://localhost:8000/api/books');
        
        // Sort by creation date and take first 12 books
        const sortedBooks = response.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 12);
            
        setBooks(sortedBooks);
    } catch (error) {
        toast.error('Failed to fetch new releases');
    } finally {
        setLoading(false);
    }
};


  const addToCart = (book) => {
    if (!user) {
      toast.error('Please login to add books to cart');
      return;
    }
    
    const savedCart = localStorage.getItem('bookCart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    if (!cart.find(item => item._id === book._id)) {
      cart.push(book);
      localStorage.setItem('bookCart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Added to cart');
    } else {
      toast.info('Book already in cart');
    }
  };

  const handleBookClick = (book) => {
    navigate("/bookdetails", { state: { book } });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <TrendingUpIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">New Releases</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest books added to our collection. Fresh stories, new adventures, and cutting-edge knowledge await you.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-white rounded-lg shadow p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-600">
                {books.length} new books added in the last 30 days
              </span>
            </div>
          </motion.div>

          {/* Books Grid */}
          {books.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {books.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* New Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      NEW
                    </span>
                  </div>
                  
                  <div onClick={() => handleBookClick(book)} className="cursor-pointer">
                    <BookCard {...book} />
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(book);
                    }}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUpIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No New Releases</h3>
              <p className="text-gray-600 mb-6">Check back soon for the latest books!</p>
              <button
                onClick={() => navigate('/booklist')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Browse All Books
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NewReleases;
