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
      <div className="min-h-screen bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding some books to your cart!
            </p>
            <button
              onClick={() => navigate('/booklist')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/booklist')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
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
                  <div className="w-20 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-1">
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
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Clear Cart
              </button>
              <button
                onClick={handlePurchaseClick}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
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
