import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { SearchIcon, UserIcon, TrashIcon, ShieldIcon } from 'lucide-react';
import Loader from '../../components/Loader';

function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.isAdmin) {
            toast.error('Unauthorized access');
            return;
        }
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching users with token:', token ? 'Token exists' : 'No token');
        
        const response = await axios.get('http://localhost:8000/api/auth/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Users response:', response.data);
        setUsers(response.data);
    } catch (error) {
        console.error('Fetch users error:', error.response?.data || error.message);
        toast.error('Failed to fetch users');
    } finally {
        setLoading(false);
    }
};


    const deleteUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/auth/admin/users/${deleteModal.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== deleteModal.userId));
            toast.success('User deleted successfully');
            setDeleteModal({ isOpen: false, userId: null, userName: '' });
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const toggleAdminStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/auth/admin/users/${userId}/admin`, 
                { isAdmin: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(u => u._id === userId ? { ...u, isAdmin: !currentStatus } : u));
            toast.success(`User ${!currentStatus ? 'promoted to' : 'removed from'} admin`);
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const handleDeleteUser = (user) => {
        setDeleteModal({
            isOpen: true,
            userId: user._id,
            userName: user.fullName
        });
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <>
            <AdminNavbar />
            <div className="container px-4 mx-auto py-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">User Management</h1>

                {/* Search */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">All Users ({filteredUsers.length})</h2>
                    </div>
                    
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Auth Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        {user.profilePicture ? (
                                                            <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full" />
                                                        ) : (
                                                            <UserIcon className="w-5 h-5 text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.fullName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    user.authProvider === 'google' 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.authProvider || 'Local'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    user.isVerified 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {user.isAdmin && <ShieldIcon className="w-4 h-4 text-blue-600 mr-1" />}
                                                    <span className={user.isAdmin ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                                                        {user.isAdmin ? 'Admin' : 'User'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => toggleAdminStatus(user._id, user.isAdmin)}
                                                        className={`px-3 py-1 text-xs rounded ${
                                                            user.isAdmin 
                                                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                        }`}
                                                    >
                                                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
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
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
                onConfirm={deleteUser}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
}

export default Users;
