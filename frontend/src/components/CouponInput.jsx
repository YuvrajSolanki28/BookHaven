import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CouponInput = ({ totalAmount, onDiscountApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/marketing/apply-coupon', {
        code: couponCode,
        amount: totalAmount
      });
      
      onDiscountApplied(response.data.discount, response.data.finalAmount);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <div className="flex-1">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={applyCoupon}
        disabled={loading || !couponCode.trim()}
        className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        <Tag className="w-4 h-4 mr-2" />
        {loading ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
};

export default CouponInput;
