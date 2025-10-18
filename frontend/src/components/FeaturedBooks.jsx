import React from "react";
import { motion } from "framer-motion";
const books = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    image:
      "https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
];
const FeaturedBooks = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.h2
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mb-12 text-3xl font-bold text-center text-gray-900 dark:text-white"
        >
          Featured Books
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                scale: 1.05,
              }}
              className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-700"
            >
              <img
                src={book.image}
                alt={book.title}
                className="object-cover w-full h-64"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {book.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{book.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedBooks;