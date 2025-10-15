import React, { useState } from 'react';
import { SearchIcon, BookOpenIcon, EditIcon, TrashIcon } from 'lucide-react';

export function BookTable({ books, onEditBook, onDeleteBook }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No books added yet. Use the form to add your first book.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search books by title, author or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {book.imageUrl ? (
                        <img
                          className="h-10 w-10 object-cover rounded-md"
                          src={book.imageUrl}
                          alt={book.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          <BookOpenIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">ISBN: {book.isbn}</div>
                  <div className="text-sm text-gray-500">{book.category}</div>
                  {book.pages && <div className="text-sm text-gray-500">{book.pages} pages</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${book.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditBook(book)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteBook(book._id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
