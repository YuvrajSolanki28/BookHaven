import React from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../context/CartContext";
const BookCart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  if (items.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-600">
          Start adding some books to your cart!
        </p>
      </div>
    );
  }
  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart</h2>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 border-b"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.author}</p>
                <p className="mt-1 font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>
          <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
export default BookCart;