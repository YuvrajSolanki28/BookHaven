// frontend/src/components/LoyaltyPoints.jsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoyaltyPoints = () => {
  const [points, setPoints] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchPoints();
  }, [user]);

  const fetchPoints = async () => {
    try {
      const response = await axios.get(`https://book-haven-iota.vercel.app/api/marketing/loyalty/${user.id}`);
      setPoints(response.data.points);
    } catch (error) {
      console.error('Failed to fetch points');
    }
  };

  return (
    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900">
      <div className="flex items-center">
        <Star className="w-5 h-5 mr-2 text-yellow-600" />
        <span className="font-medium">Loyalty Points: {points}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
        Earn 1 point per $1 spent
      </p>
    </div>
  );
};

export default LoyaltyPoints;
