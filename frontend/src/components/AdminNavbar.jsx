import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, UsersIcon, BarChart3Icon, SettingsIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: BarChart3Icon, path: '/admin' },
    { name: 'Books', icon: BookOpenIcon, path: '/admin/books' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users' },
    { name: 'Settings', icon: SettingsIcon, path: '/admin/settings' }
  ];

  return (
    <nav className="text-white bg-gray-900 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">BookHaven Admin</h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden ml-10 md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-700"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="items-center hidden space-x-4 md:flex">
            <span className="text-sm">Welcome, {user?.fullName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-red-600"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-700"
            >
              {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md hover:bg-gray-700"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 mt-4 text-base font-medium rounded-md hover:bg-red-600"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
