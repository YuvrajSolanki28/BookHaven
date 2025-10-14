import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { clearAuthData } from '../utils/auth';

const LogoutButton = ({ className = '' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    toast.success('Logged out successfully');
    navigate('/login');
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors ${className}`}
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;