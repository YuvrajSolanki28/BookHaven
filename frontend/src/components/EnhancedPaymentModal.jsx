import React, { useState } from 'react';
import {  XIcon, ShieldCheckIcon, LockIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EnhancedPaymentModal = ({ isOpen, onClose, order, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [billingAddress, setBillingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Always require card details for ALL payment methods
        if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 13) {
            newErrors.cardNumber = 'Card number required (use 4111111111111111 for testing)';
        }
        if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
            newErrors.expiry = 'Expiry date required (MM/YY format)';
        }
        if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
            newErrors.cvv = 'CVV required (3-4 digits)';
        }
        if (!cardDetails.name.trim()) {
            newErrors.name = 'Cardholder name required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] ||'';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fill in all required payment details');
            return;
        }

        setProcessing(true);
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/payments/process`,
                {
                    orderId: order._id,
                    paymentMethod,
                    cardDetails: cardDetails,
                    billingAddress
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Payment successful!');
            onPaymentSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <ShieldCheckIcon className="w-6 h-6 mr-2 text-green-600" />
                            Secure Payment
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Order Summary</h3>
                        <div className="space-y-1 text-sm">
                            {order.books.map((book, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{book.title}</span>
                                    <span>${book.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-green-600">${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Payment Method</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'credit_card', label: 'Credit Card', icon: '💳' },
                                { id: 'debit_card', label: 'Debit Card', icon: '💳' },
                                { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                                { id: 'apple_pay', label: 'Apple Pay', icon: '🍎' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                                        paymentMethod === method.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <span>{method.icon}</span>
                                    <span className="text-sm font-medium">{method.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        {/* Always show card details */}
                        <div className="space-y-4">
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm text-yellow-800">
                                    <strong>Test Mode:</strong> Use card number 4111111111111111 with any future expiry date and CVV 123
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number *
                                </label>
                                <input
                                    type="text"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({
                                        ...cardDetails,
                                        number: formatCardNumber(e.target.value)
                                    })}
                                    placeholder="4111 1111 1111 1111"
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="19"
                                    required
                                />
                                {errors.cardNumber && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date *
                                    </label>
                                    <input
                                        type="text"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({
                                            ...cardDetails,
                                            expiry: formatExpiry(e.target.value)
                                        })}
                                        placeholder="12/25"
                                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.expiry ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        maxLength="5"
                                        required
                                    />
                                    {errors.expiry && (
                                        <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({
                                            ...cardDetails,
                                            cvv: e.target.value.replace(/\D/g, '')
                                        })}
                                        placeholder="123"
                                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        maxLength="4"
                                        required
                                    />
                                    {errors.cvv && (
                                        <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cardholder Name *
                                </label>
                                <input
                                    type="text"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({
                                        ...cardDetails,
                                        name: e.target.value
                                    })}
                                    placeholder="John Doe"
                                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded">
                            <LockIcon className="w-4 h-4 text-green-600" />
                            <span>Your payment information is encrypted and secure</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <LockIcon className="w-4 h-4" />
                                    <span>Pay ${order.totalAmount.toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EnhancedPaymentModal;
