import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import { Send } from "lucide-react";
import axios from 'axios';
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/marketing/newsletter', { email });
      toast.success('Subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };
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
      className="py-16 bg-blue-600"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Stay Updated</h2>
          <p className="mb-8 text-blue-100">
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
            <form onSubmit={subscribe} className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center px-6 py-2 text-blue-600 bg-white rounded-md hover:bg-blue-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};
export default Newsletter;