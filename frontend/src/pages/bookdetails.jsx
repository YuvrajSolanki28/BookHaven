import React from 'react'
import { motion } from 'framer-motion'
import { ImageGallery } from '../components/ImageGallery'
import { BookInfo } from '../components/BookInfo'
import { AddToCartSection } from '../components/AddToCartSection'
import { BookDescription } from '../components/BookDescription'
import { RecommendedBooks } from '../components/RecommendedBooks'
import { bookData } from '../data/bookData'
const BookDetailsPage = () => {

  return (
    <div className="w-full bg-gray-50">
      <main className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Left column - Image gallery */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-8 lg:mb-0"
          >
            <ImageGallery images={bookData.images} />
          </motion.div>
          {/* Right column - Product info */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <BookInfo
              title={bookData.title}
              author={bookData.author}
              rating={bookData.rating}
              reviewCount={bookData.reviewCount}
              price={bookData.price}
              originalPrice={bookData.originalPrice}
            />
            <AddToCartSection
              inStock={bookData.inStock}
              availableFormats={bookData.availableFormats}
            />
          </motion.div>
        </div>
        {/* Book description, details, and reviews */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="mt-16"
        >
          <BookDescription
            description={bookData.description}
            details={bookData.details}
            reviews={bookData.reviews}
          />
        </motion.div>
        {/* Recommended books */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.6,
          }}
          className="mt-16"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recommended Books
          </h2>
          <RecommendedBooks books={bookData.recommendedBooks} />
        </motion.div>
      </main>
    </div>
  )
}
export default BookDetailsPage