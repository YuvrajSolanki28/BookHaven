import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookForm } from '../../components/BookForm';
import { BookTable } from '../../components/BookTable';
import { toast } from 'react-hot-toast';

function AdminPage() {
    const [books, setBooks] = useState([]);
    const { user,  } = useAuth();  //logout

    useEffect(() => {
        if (!user?.isAdmin) {
            toast.error('Unauthorized access');
            return;
        }
    }, [user]);

    const addBook = (book) => {
        const newBook = { ...book, id: Date.now().toString() };
        setBooks([...books, newBook]);
        toast.success('Book added successfully');
    };

    // const handleLogout = () => {
    //     logout();
    //     toast.success('Logged out successfully');
    // };

  return (
    <div className="container px-4 mx-auto py-28">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Book Product Management
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Add New Book</h2>
            <BookForm onAddBook={addBook} />
          </div>
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Book Inventory</h2>
            <BookTable books={books} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminPage;