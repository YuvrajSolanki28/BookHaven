import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { BookOpenIcon, UsersIcon, ShoppingCartIcon, DollarSignIcon } from 'lucide-react';
import Loader from '../../components/Loader';

function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.isAdmin) {
            toast.error('Unauthorized access');
            return;
        }
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Use existing routes
        const [booksRes, ordersRes] = await Promise.all([
            axios.get(`${import.meta.env.BACKEND_URL}/api/books`),
            axios.get(`${import.meta.env.BACKEND_URL}/api/orders/all-orders`, { headers }) // Use existing route
        ]);

        const books = booksRes.data;
        const orders = ordersRes.data;

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const uniqueUsers = [...new Set(orders.map(order => order.userId))].length;

        setStats({
            totalBooks: books.length,
            totalUsers: uniqueUsers,
            totalOrders: orders.length,
            totalRevenue: totalRevenue
        });

        setRecentOrders(orders.slice(0, 5));

    } catch (error) {
        console.error('Dashboard error:', error);
        toast.error('Failed to fetch dashboard data');
    } finally {
        setLoading(false);
    }
};


    if (loading) return <Loader />;

    return (
        <>
            <AdminNavbar />
            <div className="container px-4 py-8 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Books"
                        value={stats.totalBooks}
                        icon={BookOpenIcon}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={UsersIcon}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={ShoppingCartIcon}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toFixed(2)}`}
                        icon={DollarSignIcon}
                        color="bg-yellow-500"
                    />
                </div>

                {/* Recent Orders */}
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                            Books
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                #{order._id.slice(-6)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.books.length} book(s)
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                ${order.totalAmount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center">
            <div className={`${color} rounded-lg p-3`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

export default Dashboard;
