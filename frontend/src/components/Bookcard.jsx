import React from "react";

// Add these props to your BookCard component
const BookCard = ({ title, author, price, imageUrl, category, pages, fileSize, isDigital }) => {
    return (
        <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg dark:bg-gray-800">
            {imageUrl && (
                <img src={imageUrl} alt={title} className="object-cover w-full h-48" />
            )}
            <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold line-clamp-2 dark:text-white">{title}</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-400">by {author}</p>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{category}</p>
                
                {/* Digital book info */}
                {isDigital && (
                    <div className="flex justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
                        {pages && <span>{pages} pages</span>}
                        {fileSize && <span>{fileSize}</span>}
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">${price}</span>
                    {isDigital && (
                        <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
                            Digital
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;