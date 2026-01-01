const crypto = require('crypto');

class PaymentService {
    static generateTransactionId() {
        return 'txn_' + crypto.randomBytes(16).toString('hex');
    }

    static validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleaned) && this.luhnCheck(cleaned);
    }

    static luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    static validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        return expiry > new Date();
    }

    static validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    static async processPayment(paymentData) {
    const { amount, paymentMethod, cardDetails } = paymentData;
    
    // Require card details for card payments
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
        if (!cardDetails) {
            throw new Error('Card details required for card payments');
        }
        
        if (!this.validateCardNumber(cardDetails.number)) {
            throw new Error('Invalid card number');
        }
        if (!this.validateExpiryDate(cardDetails.expiry)) {
            throw new Error('Card expired');
        }
        if (!this.validateCVV(cardDetails.cvv)) {
            throw new Error('Invalid CVV');
        }
        if (!cardDetails.name || cardDetails.name.trim().length < 2) {
            throw new Error('Valid cardholder name required');
        }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // For testing: only allow specific test card numbers
    const testCards = ['4111111111111111', '4000000000000002'];
    if (cardDetails && !testCards.includes(cardDetails.number.replace(/\s/g, ''))) {
        throw new Error('Invalid card number for test environment');
    }

    return {
        success: true,
        transactionId: this.generateTransactionId(),
        status: 'completed',
        gatewayResponse: {
            authCode: crypto.randomBytes(6).toString('hex').toUpperCase(),
            timestamp: new Date().toISOString()
        }
    };
}


    static async processRefund(paymentId, amount, reason) {
        // Simulate refund processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            refundId: 'ref_' + crypto.randomBytes(8).toString('hex'),
            amount,
            reason,
            processedAt: new Date()
        };
    }
}

module.exports = PaymentService;
