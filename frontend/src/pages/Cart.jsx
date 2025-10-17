import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaymentModal from "../components/PaymentModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { X, ShoppingCartIcon, ArrowLeftIcon } from "lucide-react";

const BookCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('bookCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('bookCart', JSON.stringify(newCart));
  };

  const removeFromCart = (bookId) => {
    const newCart = cart.filter(item => item._id !== bookId);
    updateCart(newCart);
    toast.success('Book removed from cart');
  };

  const clearCart = () => {
    updateCart([]);
  };

  const purchaseBooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const bookIds = cart.map(book => book._id);

      await axios.post('http://localhost:8000/api/orders/create',
        { bookIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Purchase successful! Check My Library');
      clearCart();
      setShowPaymentModal(false);
      navigate('/mylibrary');
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setShowPaymentModal(true);
  };

  const totalPrice = cart.reduce((sum, book) => sum + book.price, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl px-4 mx-auto">
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mb-6 text-gray-600">
              Start adding some books to your cart!
            </p>
            <button
              onClick={() => navigate('/booklist')}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/booklist')}
              className="flex items-center mr-4 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <span className="text-lg text-gray-600">{cart.length} items</span>
        </div>

        <div className="bg-white rounded-lg shadow">

          {/* Cart Items */}
          <div className="p-6">
            <div className="space-y-4">
              {cart.map((book) => (
                <div key={book._id} className="flex items-center gap-4 py-4 border-b last:border-b-0">

                  {/* Book Image */}
                  <div className="flex-shrink-0 w-20 h-24 overflow-hidden bg-gray-200 rounded">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <ShoppingCartIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-sm text-gray-500">{book.category}</p>
                    {book.isDigital && (
                      <span className="inline-block px-2 py-1 mt-1 text-xs text-blue-800 bg-blue-100 rounded">
                        Digital Book
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      ${book.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(book._id)}
                    className="p-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-3 font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Cart
              </button>
              <button
                onClick={handlePurchaseClick}
                disabled={loading}
                className="flex-1 px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : `Purchase All - $${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            totalAmount={totalPrice}
            onPaymentSuccess={purchaseBooks}
          />
        </div>
      </div>
    </div>
  );
};

export default BookCart;
