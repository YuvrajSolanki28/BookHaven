// frontend/src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { SaveIcon, SettingsIcon, ShieldIcon, MailIcon, UsersIcon } from 'lucide-react';
import Loader from '../../components/Loader';

function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const { user } = useAuth();

    const [settings, setSettings] = useState({
        siteName: 'BookHaven',
        siteDescription: 'Your favorite online bookstore',
        adminEmail: '',
        maxOrdersPerDay: 100,
        enableRegistration: true,
        requireEmailVerification: true,
        defaultShippingCost: 5.99,
        freeShippingThreshold: 50,
        taxRate: 0.08,
        enableCoupons: true,
        enableWishlist: true,
        enableReviews: true
    });

    useEffect(() => {
        if (!user?.isAdmin) {
            toast.error('Unauthorized access');
            return;
        }
        fetchSettings();
    }, [user]);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/settings`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSettings({ ...settings, ...response.data });
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/settings`,
                settings,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const tabs = [
        { id: 'general', name: 'General', icon: SettingsIcon },
        { id: 'users', name: 'Users', icon: UsersIcon },
        { id: 'orders', name: 'Orders', icon: ShieldIcon },
        { id: 'email', name: 'Email', icon: MailIcon }
    ];

    if (loading) return <Loader />;

    return (
        <>
            <AdminNavbar />
            <div className="container px-4 py-8 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4 mr-2" />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">General Settings</h3>
                                
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Site Name</label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => handleInputChange('siteName', e.target.value)}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                                        <input
                                            type="email"
                                            value={settings.adminEmail}
                                            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Site Description</label>
                                    <textarea
                                        value={settings.siteDescription}
                                        onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Default Shipping Cost ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={settings.defaultShippingCost}
                                            onChange={(e) => handleInputChange('defaultShippingCost', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Free Shipping Threshold ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={settings.freeShippingThreshold}
                                            onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={settings.taxRate * 100}
                                            onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) / 100)}
                                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">User Management</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="enableRegistration"
                                            checked={settings.enableRegistration}
                                            onChange={(e) => handleInputChange('enableRegistration', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="enableRegistration" className="ml-2 text-sm text-gray-700">
                                            Enable user registration
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="requireEmailVerification"
                                            checked={settings.requireEmailVerification}
                                            onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-gray-700">
                                            Require email verification for new accounts
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Order Management</h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Maximum Orders Per Day</label>
                                    <input
                                        type="number"
                                        value={settings.maxOrdersPerDay}
                                        onChange={(e) => handleInputChange('maxOrdersPerDay', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-1/3"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="enableCoupons"
                                            checked={settings.enableCoupons}
                                            onChange={(e) => handleInputChange('enableCoupons', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="enableCoupons" className="ml-2 text-sm text-gray-700">
                                            Enable coupon system
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'email' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Feature Settings</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="enableWishlist"
                                            checked={settings.enableWishlist}
                                            onChange={(e) => handleInputChange('enableWishlist', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="enableWishlist" className="ml-2 text-sm text-gray-700">
                                            Enable wishlist feature
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="enableReviews"
                                            checked={settings.enableReviews}
                                            onChange={(e) => handleInputChange('enableReviews', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="enableReviews" className="ml-2 text-sm text-gray-700">
                                            Enable book reviews
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminSettings;
