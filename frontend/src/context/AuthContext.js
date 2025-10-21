import React, { createContext, useContext, useState, useEffect } from 'react';
import Loader from '../components/Loader';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        
        if (decoded.isAdmin) {
          setUser({
            id: decoded.userId,
            email: decoded.email,
            fullName: decoded.fullName || 'Admin',
            isAdmin: true
          });
        } else {
          fetchUserProfile(token, decoded);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async (token, decoded) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/profile/${token}`);
      if (response.ok) {
        const data = await response.json();
        setUser({ ...data, isAdmin: decoded.isAdmin || false });
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};
