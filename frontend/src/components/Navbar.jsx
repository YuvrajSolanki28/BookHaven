import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, CircleUserRound, Search } from "lucide-react";
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdvancedSearch from './AdvancedSearch';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

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
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm dark:bg-gray-800">
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
            <span className="hidden text-xl font-bold text-gray-900 dark:text-white">BookHaven</span>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            <a href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Home
            </a>
            <a href="/booklist" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Books
            </a>
            <a href="/categories" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Categories
            </a>
            <a href="/new-releases" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              New Releases
            </a>
            {user && (
              <a href="/mylibrary" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                My Library
              </a>
            )}
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          {/* Cart, Login/Profile, and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <CircleUserRound className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Login
              </button>
            )}

            <button
              className="text-gray-700 md:hidden hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Home
              </a>
              <a href="/booklist" className="block px-3 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Books
              </a>
              <a href="/categories" className="block px-3 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Categories
              </a>
              <a
                href="/new-releases"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                New Releases
              </a>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full px-3 py-2 text-left text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full px-3 py-2 text-left text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showAdvancedSearch && (
          <AdvancedSearch
            onSearch={(params) => {
              // Handle search - you can navigate to search results page
              navigate('/search-results', { state: { searchParams: params } });
            }}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
