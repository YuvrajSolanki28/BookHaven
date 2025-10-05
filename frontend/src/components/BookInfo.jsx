import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';

export const BookInfo = ({
  title,
  author,
  rating,
  reviewCount,
  price,
  originalPrice,
}) => {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mb-4 text-lg text-gray-600">by {author}</p>

      <div className="flex items-center mb-6">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((star) => (
            <StarIcon
              key={star}
              size={20}
              className={`${
                rating > star ? 'text-yellow-400' : 'text-gray-300'
              } flex-shrink-0`}
              fill={rating > star ? 'currentColor' : 'none'}
            />
          ))}
        </div>
        <p className="ml-3 text-sm text-gray-600">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </p>
      </div>

      <div className="flex items-center mb-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900"
        >
          ${price.toFixed(2)}
        </motion.p>

        {originalPrice && (
          <p className="ml-3 text-xl text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
          </p>
        )}

        {originalPrice && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 15,
              delay: 0.5,
            }}
            className="px-2 py-1 ml-3 text-sm font-medium text-red-800 bg-red-100 rounded-md"
          >
            Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </motion.span>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full"></div>
          <p className="ml-2 text-sm text-gray-600">
            In stock and ready to ship
          </p>
        </div>
      </div>
    </div>
  );
};
