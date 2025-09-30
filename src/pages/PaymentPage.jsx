import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentPage() {
    const { items, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [selectedPayment, setSelectedPayment] = useState('credit-card');
    const [formData, setFormData] = useState({
        // Billing Address
        firstName: user?.name || '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        
        // Credit Card
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        
        // PayPal
        paypalEmail: '',
        
        // Bank Details for other payments
        bankName: '',
        accountNumber: ''
    });
    
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const paymentOptions = [
        {
            id: 'credit-card',
            name: 'Credit Card',
            icon: '💳',
            description: 'Visa, Mastercard, American Express'
        },
        {
            id: 'debit-card',
            name: 'Debit Card',
            icon: '🏦',
            description: 'Direct debit from your bank account'
        },
        {
            id: 'paypal',
            name: 'PayPal',
            icon: '🅿️',
            description: 'Pay with your PayPal account'
        },
        {
            id: 'klarna',
            name: 'Klarna',
            icon: '🔷',
            description: 'Buy now, pay later in installments'
        },
        {
            id: 'google-pay',
            name: 'Google Pay',
            icon: '🟡',
            description: 'Quick payment with Google'
        },
        {
            id: 'apple-pay',
            name: 'Apple Pay',
            icon: '🍎',
            description: 'Secure payment with Touch ID'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Basic validation
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        
        // Payment method specific validation
        if (selectedPayment === 'credit-card' || selectedPayment === 'debit-card') {
            if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
            if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
            if (!formData.cvv) newErrors.cvv = 'CVV is required';
            if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
        }
        
        if (selectedPayment === 'paypal' && !formData.paypalEmail) {
            newErrors.paypalEmail = 'PayPal email is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Clear cart and redirect to success page
            clearCart();
            navigate('/payment-success', {
                state: {
                    orderId: 'ORD-' + Date.now(),
                    items: items,
                    total: getTotalPrice(),
                    paymentMethod: selectedPayment
                }
            });
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">No Items to Checkout</h1>
                <p className="text-gray-600 mb-4">Your cart is empty. Add some items before proceeding to payment.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Payment Method Selection */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                                selectedPayment === option.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedPayment(option.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{option.icon}</span>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{option.name}</h3>
                                                    <p className="text-sm text-gray-600">{option.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Billing Information */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State/Province
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ZIP/Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Australia">Australia</option>
                                            <option value="Germany">Germany</option>
                                            <option value="France">France</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            {(selectedPayment === 'credit-card' || selectedPayment === 'debit-card') && (
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        {selectedPayment === 'credit-card' ? 'Credit Card' : 'Debit Card'} Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Date *
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                                placeholder="MM/YY"
                                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cardholder Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardholderName"
                                                value={formData.cardholderName}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedPayment === 'paypal' && (
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">PayPal Details</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            PayPal Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="paypalEmail"
                                            value={formData.paypalEmail}
                                            onChange={handleInputChange}
                                            placeholder="your-email@paypal.com"
                                            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.paypalEmail ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.paypalEmail && <p className="text-red-500 text-sm mt-1">{errors.paypalEmail}</p>}
                                    </div>
                                </div>
                            )}

                            {(selectedPayment === 'klarna' || selectedPayment === 'google-pay' || selectedPayment === 'apple-pay') && (
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        {selectedPayment === 'klarna' && 'Klarna Payment'}
                                        {selectedPayment === 'google-pay' && 'Google Pay'}
                                        {selectedPayment === 'apple-pay' && 'Apple Pay'}
                                    </h2>
                                    <div className="text-center py-8">
                                        <div className="text-6xl mb-4">
                                            {selectedPayment === 'klarna' && '🔷'}
                                            {selectedPayment === 'google-pay' && '🟡'}
                                            {selectedPayment === 'apple-pay' && '🍎'}
                                        </div>
                                        <p className="text-gray-600 mb-4">
                                            {selectedPayment === 'klarna' && 'You will be redirected to Klarna to complete your payment in installments.'}
                                            {selectedPayment === 'google-pay' && 'You will be redirected to Google Pay to complete your payment.'}
                                            {selectedPayment === 'apple-pay' && 'You will be redirected to Apple Pay to complete your payment.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item._id} className="flex items-center space-x-3">
                                        <img
                                            src={item.image || '/images/products/default-product.svg'}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax:</span>
                                    <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                    <span>Total:</span>
                                    <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    `Complete Payment - $${(getTotalPrice() * 1.08).toFixed(2)}`
                                )}
                            </button>
                            
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    🔒 Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}