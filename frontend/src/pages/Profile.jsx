// src/pages/ProfilePage.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserIcon, ShoppingBagIcon, HeartIcon, CreditCardIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";
import Loader from "../components/Loader";
import axios from "axios";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editMessage, setEditMessage] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8000/api/auth/update-profile",
        { fullName: editName, email: editEmail, password: editPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditMessage(res.data.message);
      setEditPassword("");
    } catch (error) {
      setEditMessage(error.response?.data?.error || "Error updating profile");
    }
  };

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

      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating password");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="px-4 py-20 pb-16 mx-auto lg:grid lg:grid-cols-4 lg:gap-x-8 max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 lg:mb-0"
        >
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-6 space-x-4">
              <div className="w-16 h-16 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
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
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>

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

              {/* Settings */}
              <div>
                <button
                  onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${activeTab === "settings"
                    ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
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
                    {user.authProvider !== 'google' && (
                      <button
                        onClick={() => setActiveTab("change-password")}
                        className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Change Password
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab("theme-settings")}
                      className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Theme Settings
                    </button>
                  </div>
                )}
              </div>

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

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {activeTab === "profile" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Profile Overview
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">Welcome back, {user.fullName} 👋</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Account Type</h3>
                    <p className="text-sm text-gray-600 capitalize dark:text-gray-400">
                      {user.authProvider || 'Local'} Account
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Status</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.isVerified ? '✅ Verified' : '❌ Not Verified'}
                    </p>
                  </div>

                  {user.googleId && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">Google Account</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "edit-profile" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
              <form className="space-y-4" onSubmit={handleEditProfile}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={user.authProvider === 'google'}
                  />
                  {user.authProvider === 'google' && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed for Google accounts
                    </p>
                  )}
                </div>

                {editEmail !== user.email && user.authProvider !== 'google' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                )}

                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Save Changes
                </button>
                {editMessage && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{editMessage}</p>}
              </form>
            </div>
          )}

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
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Update Password
                </button>
              </form>

              {message && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{message}</p>}
            </div>
          )}

          {activeTab === "theme-settings" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Theme Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div className="flex items-center">
                    <SunIcon className="w-5 h-5 mr-3 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Light Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use light theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => !isDark || toggleTheme()}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!isDark
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      }`}
                  >
                    {!isDark ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div className="flex items-center">
                    <MoonIcon className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => isDark || toggleTheme()}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      }`}
                  >
                    {isDark ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
