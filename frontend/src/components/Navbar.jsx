import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    updateCartCount();
  }, []);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('bookCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartCount(cart.length);
    } else {
      setCartCount(0);
    }
  };

  // Listen for cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom cart update events
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div
            className="flex items-center flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo1.png"
              alt="BookHaven Logo"
              className="w-auto h-24"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="hidden text-xl font-bold text-gray-900">BookHaven</span>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            <a href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="/booklist" className="text-gray-700 hover:text-gray-900">
              Books
            </a>
            <a href="/categories" className="text-gray-700 hover:text-gray-900">
              Categories
            </a>
            <a href="/new-releases" className="text-gray-700 hover:text-gray-900">
              New Releases
            </a>
            {user && (
              <a href="/mylibrary" className="text-gray-700 hover:text-gray-900">
                My Library
              </a>
            )}
          </div>

          {/* Cart, Login/Profile, and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 hover:text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <CircleUserRound className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-gray-900"
              >
                Login
              </button>
            )}

            <button
              className="text-gray-700 md:hidden hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="/booklist" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Books
              </a>
              <a href="/categories" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                Categories
              </a>
              <a
                href="/new-releases"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900"
              >
                New Releases
              </a>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full px-3 py-2 text-left text-gray-700 hover:text-gray-900"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full px-3 py-2 text-left text-gray-700 hover:text-gray-900"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
