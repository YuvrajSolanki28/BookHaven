import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { DownloadIcon, BookOpenIcon } from 'lucide-react';

const MyLibrary = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/orders/my-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch library');
        } finally {
            setLoading(false);
        }
    };

    const downloadBook = async (bookId, title) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/orders/download/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Create download link
            const link = document.createElement('a');
            link.href = response.data.downloadUrl;
            link.download = `${title}.pdf`;
            link.click();
            
            toast.success('Download started');
        } catch (error) {
            toast.error('Download failed');
        }
    };

    if (!user) return <div className="container mx-auto px-4 py-20 text-center">Please login to view library</div>;
    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-8">My Digital Library</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No books purchased yet</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                                    <p className="text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    ${order.totalAmount.toFixed(2)}
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                {order.books.map(book => (
                                    <div key={book.bookId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <h4 className="font-medium">{book.title}</h4>
                                            <p className="text-sm text-gray-600">${book.price}</p>
                                        </div>
                                        <button 
                                            onClick={() => downloadBook(book.bookId, book.title)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                                        >
                                            <DownloadIcon className="w-4 h-4 mr-2" />
                                            Download PDF
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLibrary;
