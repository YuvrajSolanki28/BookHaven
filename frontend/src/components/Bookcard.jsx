import React from "react";

// Add these props to your BookCard component
const BookCard = ({ title, author, price, imageUrl, category, pages, fileSize, isDigital }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {imageUrl && (
                <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
                <p className="text-gray-600 mb-2">by {author}</p>
                <p className="text-sm text-gray-500 mb-2">{category}</p>
                
                {/* Digital book info */}
                {isDigital && (
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        {pages && <span>{pages} pages</span>}
                        {fileSize && <span>{fileSize}</span>}
                    </div>
                )}
                
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">${price}</span>
                    {isDigital && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            Digital
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;