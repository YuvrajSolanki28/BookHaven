import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import Pagination from "../components/Pagination";
import BookCard from "../components/Bookcard";
import Loader from "../components/Loader";

function Booklist() {
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const booksPerPage = 9;
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

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

      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success('Added to cart');
    } else {
      toast.info('Book already in cart');
    }
  };

  const totalPages = books?.length ? Math.ceil(books.length / booksPerPage) : 0;

  const getCurrentPageBooks = () => {
    if (!books?.length) return [];
    const startIndex = (currentPage - 1) * booksPerPage;
    return books.slice(startIndex, startIndex + booksPerPage);
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book._id}`, { state: { book } });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Results count */}
          <motion.div
            className="mb-4 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Showing {books?.length || 0} books
          </motion.div>

          {/* Book grid */}
          {books?.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {getCurrentPageBooks().map((book, index) => (
                <motion.div
                  key={book._id || index}
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
                    className="absolute px-3 py-1 text-sm text-white bg-blue-600 rounded bottom-4 right-4 hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="py-10 text-center text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No books found.
            </motion.div>
          )}

          {/* Pagination */}
          {books?.length > 0 && (
            <motion.div
              className="flex justify-center mt-6 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Booklist;
