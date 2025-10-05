import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Pagination from "../components/Pagination";
import BookCard from "../components/Bookcard";
import { SAMPLE_BOOKS } from "../data/sampleBooks"; // Ensure this is correctly imported!

function Booklist() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(SAMPLE_BOOKS || []); // Ensure default value
  const [sortBy, setSortBy] = useState("title");
  const booksPerPage = 9;
  const navigate = useNavigate();

  // Filter and sort books when search term or sort option changes
  useEffect(() => {
    if (!SAMPLE_BOOKS) return; // Prevent errors if SAMPLE_BOOKS is undefined

    let result = [...SAMPLE_BOOKS];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        book =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      } else if (sortBy === "price-high") {
        return b.price - a.price;
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const totalPages = filteredBooks?.length ? Math.ceil(filteredBooks.length / booksPerPage) : 0;

  const getCurrentPageBooks = () => {
    if (!filteredBooks?.length) return []; // Ensure it doesn't try to map over undefined
    const startIndex = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(startIndex, startIndex + booksPerPage);
  };

  const handleBookClick = (book) => {
    navigate("/bookdetails", { state: { book } });
  };

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
                  <option value="rating">Highest Rated</option>
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
                  key={book.id || index} // Ensure a unique key
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleBookClick(book)}
                  className="cursor-pointer"
                >
                  <BookCard {...book} />
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
