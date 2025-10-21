import React from 'react';
import { Package } from 'lucide-react';

const BulkDiscount = ({ cartCount, totalAmount }) => {
  const getBulkDiscount = () => {
    if (cartCount >= 5) return { percent: 15, message: '15% off for 5+ books' };
    if (cartCount >= 3) return { percent: 10, message: '10% off for 3+ books' };
    return null;
  };

  const discount = getBulkDiscount();
  if (!discount) return null;

  const discountAmount = (totalAmount * discount.percent) / 100;

  return (
    <div className="p-4 mb-4 rounded-lg bg-orange-50 dark:bg-orange-900">
      <div className="flex items-center">
        <Package className="w-5 h-5 mr-2 text-orange-600" />
        <div>
          <p className="font-medium text-orange-800 dark:text-orange-200">
            Bulk Discount Applied!
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-300">
            {discount.message} - Save ${discountAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BulkDiscount;
