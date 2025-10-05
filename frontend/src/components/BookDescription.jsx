import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from 'lucide-react';

export const BookDescription = ({ description, details, reviews }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Details' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 text-center font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="py-6"
        >
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="w-1/4 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">Publisher</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{details.publisher}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">Language</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{details.language}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">Paperback</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{details.paperback}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">ISBN</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{details.isbn}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">Dimensions</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{details.dimensions}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-8 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <StarIcon
                          key={star}
                          size={16}
                          className={`${
                            review.rating > star ? 'text-yellow-400' : 'text-gray-300'
                          } flex-shrink-0`}
                          fill={review.rating > star ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <h4 className="ml-2 text-sm font-medium text-gray-900">{review.title}</h4>
                  </div>
                  <div className="flex items-center mb-3 text-sm text-gray-500">
                    <span>{review.name}</span>
                    <span className="mx-1">•</span>
                    <span>{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
