import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export const ImageGallery = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const selectImage = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className="relative">
      <div className="w-full overflow-hidden bg-white rounded-lg aspect-w-1 aspect-h-1">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={`Book image ${currentImage + 1}`}
            className="object-contain object-center w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevImage}
          className="p-2 text-gray-800 bg-white bg-opacity-75 rounded-full shadow-sm hover:bg-opacity-100 focus:outline-none"
        >
          <ChevronLeftIcon size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextImage}
          className="p-2 text-gray-800 bg-white bg-opacity-75 rounded-full shadow-sm hover:bg-opacity-100 focus:outline-none"
        >
          <ChevronRightIcon size={20} />
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => selectImage(index)}
            className={`cursor-pointer overflow-hidden rounded border-2 ${
              currentImage === index ? 'border-indigo-600' : 'border-transparent'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="object-cover w-full h-16"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
