import React from "react";
import { Star } from "lucide-react";

const Bookcard = ({ title, author, price, rating, imageUrl }) => {
  return (
    <div className="transition-shadow duration-200 bg-white rounded-lg shadow-sm hover:shadow-md">
      <img
        src={imageUrl}
        alt={title}
        className="object-cover w-full h-56 rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{author}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium text-gray-900">${price.toFixed(2)}</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Bookcard;