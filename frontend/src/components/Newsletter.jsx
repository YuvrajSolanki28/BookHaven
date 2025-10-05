import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
const Newsletter = () => {
  return (
    <motion.section
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      viewport={{
        once: true,
      }}
      className="bg-blue-600 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter for the latest releases and exclusive
            offers
          </p>
          <motion.form
            initial={{
              y: 20,
            }}
            whileInView={{
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 flex items-center"
              >
                Subscribe
                <Send className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};
export default Newsletter;