// frontend/src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/Bookcard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const searchParams = location.state?.searchParams || {};

  useEffect(() => {
    performSearch();
  }, [currentPage, searchParams]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...searchParams,
        page: currentPage,
        limit: 12
      });
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/books/search?${params}`);
      setResults(response.data.books);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen px-4 pt-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results for "{searchParams.q}"
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {pagination.count} books found
          </p>
        </div>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((book) => (
                <BookCard key={book._id} {...book} />
              ))}
            </div>
            
            {pagination.total > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No books found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
