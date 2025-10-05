import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, HeartIcon, CheckIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const AddToCartSection = ({ inStock, availableFormats }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState(availableFormats[0].id);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleFormatChange = (id) => {
    setSelectedFormat(id);
  };

  const handleAddToCart = () => {
    const selected = availableFormats.find(f => f.id === selectedFormat);

    const product = {
      id: selected.id,
      title: 'The Art of Programming',
      author: 'Robert C. Martin',
      price: selected.price,
      format: selected.name,
      quantity,
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
      stock: inStock,
    };

    addToCart(product);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="pt-8 mt-8 border-t border-gray-200">
      {/* Format selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900">Format</h3>
        <div className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-2">
          {availableFormats.map((format) => (
            <motion.div
              key={format.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFormatChange(format.id)}
              className={`cursor-pointer border rounded-md p-4 flex items-center justify-between ${
                selectedFormat === format.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300'
              }`}
            >
              <div>
                <p
                  className={`font-medium ${
                    selectedFormat === format.id
                      ? 'text-indigo-600'
                      : 'text-gray-900'
                  }`}
                >
                  {format.name}
                </p>
                <p className="text-sm text-gray-500">
                  ${format.price.toFixed(2)}
                </p>
              </div>
              {selectedFormat === format.id && (
                <CheckIcon size={20} className="text-indigo-600" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="mb-6">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <select
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {[...Array(8)].map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {idx + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Add to cart and Save buttons */}
      <div className="sm:flex sm:space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={!inStock || isAddedToCart}
          className={`relative w-full flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            !inStock
              ? 'bg-gray-400 cursor-not-allowed'
              : isAddedToCart
              ? 'bg-green-600'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isAddedToCart ? (
            <>
              <CheckIcon size={20} className="mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCartIcon size={20} className="mr-2" />
              Add to Cart
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-full px-6 py-3 mt-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md sm:mt-0 sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <HeartIcon size={20} className="mr-2" />
          Save
        </motion.button>
      </div>
    </div>
  );
};
