// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserIcon, ShoppingBagIcon, HeartIcon, CreditCardIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, MoonIcon, SunIcon, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import UserPreferences from "../components/UserPreferences";
import Loader from "../components/Loader";
import axios from "axios";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [orders, setOrders] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  // Redirect unauthorized users
  // Redirect unauthorized users
  useEffect(() => {
    if (!loading && !user && !localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);


  // Initialize edit fields
  useEffect(() => {
    if (user) {
      setEditName(user.fullName || "");
      setEditEmail(user.email || "");
    }
  }, [user]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlist([]);
    }
  };

  useEffect(() => {
    if (activeTab === "wishlist" && user) {
      fetchWishlist();
    }
  }, [activeTab, user]);

  // Edit profile
  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8000/api/auth/update-profile",
        { fullName: editName, email: editEmail, password: editPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditMessage(res.data.message || "Profile updated successfully!");
      setEditPassword("");
    } catch (error) {
      setEditMessage(error.response?.data?.error || "Error updating profile");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating password");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8001/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-20 pb-16 mx-auto lg:grid lg:grid-cols-4 lg:gap-x-8 max-w-7xl sm:px-6 lg:px-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 lg:mb-0"
        >
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            {/* User Info */}
            <div className="flex items-center mb-6 space-x-4">
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-emerald-100 dark:bg-emerald-800">
                    <UserIcon size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
              </div>
            </div>


            {/* Sidebar Nav */}
            <nav className="space-y-1">
              {[
                { key: "profile", label: "Profile Overview", icon: UserIcon },
                { key: "orders", label: "Orders", icon: ShoppingBagIcon },
                { key: "wishlist", label: "Wishlist", icon: HeartIcon },
                { key: "payment", label: "Payment Methods", icon: CreditCardIcon },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${activeTab === item.key
                    ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Settings dropdown */}
              <div>
                <button
                  onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <SettingsIcon size={18} className="mr-3" />
                  <span>Account Settings</span>
                  <ChevronDownIcon
                    size={16}
                    className={`ml-auto transition-transform duration-200 ${settingsDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {settingsDropdownOpen && (
                  <div className="mt-1 ml-6 space-y-1">
                    <button
                      onClick={() => setActiveTab("edit-profile")}
                      className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Edit Profile
                    </button>
                    {user.authProvider !== "google" && (
                      <button
                        onClick={() => setActiveTab("change-password")}
                        className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Change Password
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab("preferences")}
                      className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      preferences
                    </button>
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOutIcon size={18} className="mr-3" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {/* Profile Overview */}
          {activeTab === "profile" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Profile Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Welcome back, {user.fullName} 👋
              </p>
            </div>
          )}

          {/* Edit Profile */}
          {activeTab === "edit-profile" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
              <form className="space-y-4" onSubmit={handleEditProfile}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    disabled={user.authProvider === "google"}
                  />
                  {user.authProvider === "google" && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed for Google accounts
                    </p>
                  )}
                </div>

                {editEmail !== user.email && user.authProvider !== "google" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                )}

                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Save Changes
                </button>
                {editMessage && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    {editMessage}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Change Password */}
          {activeTab === "change-password" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Update Password
                </button>
              </form>
              {message && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {message}
                </p>
              )}
            </div>
          )}

          {/* Theme Settings */}
          {activeTab === "theme-settings" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Theme Settings
              </h2>
              <div className="space-y-4">
                {/* Light Mode */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div className="flex items-center">
                    <SunIcon className="w-5 h-5 mr-3 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Light Mode
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use light theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => isDark && toggleTheme()}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${!isDark
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300"
                      }`}
                  >
                    {!isDark ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div className="flex items-center">
                    <MoonIcon className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Dark Mode
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use dark theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => !isDark && toggleTheme()}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${isDark
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300"
                      }`}
                  >
                    {isDark ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist */}
          {activeTab === "wishlist" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                My Wishlist
              </h2>
              {wishlist.length === 0 ? (
                <div className="py-12 text-center">
                  <HeartIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No books in wishlist
                  </p>
                  <button
                    onClick={() => navigate("/booklist")}
                    className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Browse Books
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 transition-shadow border rounded-lg dark:border-gray-600 hover:shadow-md"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded dark:bg-gray-700">
                          {item.book?.imageUrl ? (
                            <img
                              src={item.book.imageUrl}
                              alt={item.book.title}
                              className="object-cover w-full h-full rounded"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <span className="text-xs text-gray-500">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate dark:text-white">
                            {item.book?.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {item.book?.author}
                          </p>
                          <p className="font-bold text-green-600">
                            ${item.book?.price}
                          </p>
                          <button
                            onClick={() =>
                              navigate(`/book/${item.book._id}`, {
                                state: { book: item.book },
                              })
                            }
                            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Order History
              </h2>
              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBagIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">No orders found</p>
                  <button
                    onClick={() => navigate("/booklist")}
                    className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="p-4 border rounded-lg dark:border-gray-600">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Order #{order._id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${order.totalAmount}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.books.map((book, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">{book.title}</span>
                            <span className="text-gray-600 dark:text-gray-400">${book.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'preferences' && <UserPreferences />}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
