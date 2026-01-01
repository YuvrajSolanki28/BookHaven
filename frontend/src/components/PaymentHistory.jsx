import React, { useState, useEffect } from 'react';
import { CreditCardIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/payments/history`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPayments(response.data);
        } catch (error) {
            toast.error('Failed to fetch payment history');
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async (paymentId) => {
        if (!window.confirm('Are you sure you want to request a refund?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/payments/refund/${paymentId}`,
                { reason: 'Customer requested refund' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Refund processed successfully');
            fetchPaymentHistory();
        } catch (error) {
            toast.error('Refund request failed');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: 'text-green-600 bg-green-100',
            pending: 'text-yellow-600 bg-yellow-100',
            failed: 'text-red-600 bg-red-100',
            refunded: 'text-gray-600 bg-gray-100'
        };
        return colors[status] || 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            
            {payments.length === 0 ? (
                <div className="text-center py-8">
                    <CreditCardIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No payments found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {payments.map((payment) => (
                        <div key={payment._id} className="bg-white border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        Order #{payment.orderId._id.slice(-8)}
                                    </h3>
                                    <p className="text-gray-600">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600">
                                        ${payment.amount.toFixed(2)}
                                    </p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                                        {payment.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-medium">{payment.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                                </div>
                                {payment.transactionId && (
                                    <div>
                                        <p className="text-sm text-gray-600">Transaction ID</p>
                                        <p className="font-mono text-sm">{payment.transactionId}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    {payment.orderId.books.length} book(s) purchased
                                </div>
                                <div className="space-x-2">
                                    {payment.paymentStatus === 'completed' && (
                                        <button
                                            onClick={() => handleRefund(payment._id)}
                                            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                                        >
                                            Request Refund
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
