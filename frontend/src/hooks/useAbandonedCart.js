import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAbandonedCart = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('bookCart') || '[]');
      if (cart.length > 0) {
        // Send abandoned cart email
        fetch('http://localhost:8000/api/marketing/abandoned-cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: user.email, cartItems: cart })
        });
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearTimeout(timer);
  }, [user]);
};
