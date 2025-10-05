import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export const RecommendedBooks = ({ books }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount =
        direction === 'left'
          ? -current.offsetWidth / 2
          : current.offsetWidth / 2;
      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div className="absolute z-10 -translate-y-1/2 top-1/2 -left-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('left')}
          className="p-2 text-gray-800 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
        >
          <ChevronLeftIcon size={20} />
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="flex pb-4 space-x-4 overflow-x-auto hide-scrollbar"
      >
        {books.map((book) => (
          <motion.div
            key={book.id}
            whileHover={{ y: -8 }}
            className="flex-shrink-0 w-40 cursor-pointer"
          >
            <div className="w-full h-56 mb-2 overflow-hidden bg-gray-200 rounded-lg">
              <img
                src={book.cover}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {book.title}
            </h3>
            <p className="text-sm text-gray-500">{book.author}</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              ${book.price.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="absolute z-10 -translate-y-1/2 top-1/2 -right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('right')}
          className="p-2 text-gray-800 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
        >
          <ChevronRightIcon size={20} />
        </motion.button>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
