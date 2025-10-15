import React, { useState } from 'react';
import { CreditCardIcon, XIcon } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            onPaymentSuccess();
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        Payment
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                        </label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                            </label>
                            <input
                                type="text"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="123"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
