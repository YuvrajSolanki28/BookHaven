// src/pages/ProfilePage.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserIcon, ShoppingBagIcon, HeartIcon, CreditCardIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import axios from "axios";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [editName, setEditName] = useState(user.fullName || "");
  const [editEmail, setEditEmail] = useState(user.email || "");
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
    <div className="w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="px-4 py-20 pb-16 mx-auto lg:grid lg:grid-cols-4 lg:gap-x-8 max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 lg:mb-0"
        >
          <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-6 space-x-4">
              <div className="w-16 h-16 overflow-hidden rounded-full">
                {/* <img
                  src={
                    user.profileImage ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  }
                  alt="Profile"
                  className="object-cover w-full h-full"
                /> */}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user.fullName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
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
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
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
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
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
                      className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("change-password")}
                      className="flex w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
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
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Profile Overview
              </h2>
              <p>Welcome back, {user.name} 👋</p>
            </div>
          )}

          {activeTab === "edit-profile" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Profile</h2>
              <form className="space-y-4" onSubmit={handleEditProfile}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Only show password field if email has changed */}
                {editEmail !== user.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                )}

                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Save Changes
                </button>
                {editMessage && <p className="mt-2 text-sm text-green-600">{editMessage}</p>}
              </form>


            </div>
          )}

          {activeTab === "change-password" && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Change Password
              </h2>
              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Update Password
                </button>
              </form>

              {message && <p className="mt-2 text-sm text-red-500">{message}</p>}

            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
