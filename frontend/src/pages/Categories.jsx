import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import BookCard from "../components/Bookcard";
import Loader from "../components/Loader";
import { BookOpenIcon, GridIcon } from "lucide-react";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBooksByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/books/categories`);
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].category);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksByCategory = async (category) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/books/category/${category}`);
      setBooks(response.data);
    } catch (error) {
      toast.error('Failed to fetch books');
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
    navigate(`/book/${book._id}`, { state: { book } });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <GridIcon className="w-8 h-8 mr-3 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Book Categories</h1>
            </div>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Explore books by category. Find your favorite genres and discover new ones.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-4 rounded-lg text-center transition-all ${
                  selectedCategory === cat.category
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 shadow'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <BookOpenIcon className="w-6 h-6 mx-auto mb-2" />
                <h3 className="text-sm font-medium">{cat.category}</h3>
                <p className="text-xs opacity-75">{cat.count} books</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Selected Category Books */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory} ({books.length})
                </h2>
              </div>

              {books.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {books.map((book, index) => (
                    <motion.div
                      key={book._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative"
                    >
                      <div onClick={() => handleBookClick(book)} className="cursor-pointer">
                        <BookCard {...book} />
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(book);
                        }}
                        className="absolute px-3 py-1 text-sm text-white bg-purple-600 rounded bottom-4 right-4 hover:bg-purple-700"
                      >
                        Add to Cart
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <BookOpenIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Books Found</h3>
                  <p className="text-gray-600 dark:text-gray-300">No books available in this category yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Categories;
