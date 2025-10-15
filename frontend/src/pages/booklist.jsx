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
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortBy, setSortBy] = useState("title");
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
      setFilteredBooks(response.data);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort books
  useEffect(() => {
    let result = [...books];

    if (searchTerm) {
      result = result.filter(
        book =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      } else if (sortBy === "price-high") {
        return b.price - a.price;
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [searchTerm, sortBy, books]);

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

  const totalPages = filteredBooks?.length ? Math.ceil(filteredBooks.length / booksPerPage) : 0;

  const getCurrentPageBooks = () => {
    if (!filteredBooks?.length) return [];
    const startIndex = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(startIndex, startIndex + booksPerPage);
  };

  const handleBookClick = (book) => {
    navigate("/bookdetails", { state: { book } });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Search and filter section */}
          <motion.div
            className="p-4 mb-8 bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="title">Sort by Title</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            className="mb-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Showing {filteredBooks?.length || 0} books
          </motion.div>

          {/* Book grid */}
          {filteredBooks?.length > 0 ? (
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
                    className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="py-10 text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No books found matching your search criteria.
            </motion.div>
          )}

          {/* Pagination */}
          {filteredBooks?.length > 0 && (
            <motion.div
              className="mt-6"
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
