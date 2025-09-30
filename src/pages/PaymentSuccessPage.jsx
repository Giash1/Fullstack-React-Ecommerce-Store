import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        if (location.state) {
            setOrderData(location.state);
        }
    }, [location.state]);

    if (!orderData) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-4">We couldn&apos;t find your order details.</p>
                <Link 
                    to="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const formatPaymentMethod = (method) => {
        const methods = {
            'credit-card': 'Credit Card',
            'debit-card': 'Debit Card',
            'paypal': 'PayPal',
            'klarna': 'Klarna',
            'google-pay': 'Google Pay',
            'apple-pay': 'Apple Pay'
        };
        return methods[method] || method;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-4">
                        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                        <p className="text-green-800 font-semibold">Order ID: {orderData.orderId}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                            <p className="text-gray-600">{formatPaymentMethod(orderData.paymentMethod)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Order Total</h3>
                            <p className="text-2xl font-bold text-green-600">${(orderData.total * 1.08).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Including tax</p>
                        </div>
                    </div>

                    {/* Items Ordered */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-4">Items Ordered</h3>
                        <div className="space-y-4">
                            {orderData.items.map((item) => (
                                <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.image || '/images/products/default-product.svg'}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-600 capitalize">Category: {item.category}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-gray-600">${item.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t mt-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>${orderData.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax (8%):</span>
                                <span>${(orderData.total * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                <span>Total Paid:</span>
                                <span>${(orderData.total * 1.08).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-blue-800 mb-3">What happens next?</h3>
                    <div className="space-y-2 text-blue-700">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>You&apos;ll receive an order confirmation email shortly</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>Your items will be processed and prepared for shipping</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>You&apos;ll receive tracking information once shipped</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>Estimated delivery: 3-5 business days</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => window.print()}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Print Receipt
                    </button>
                    <Link 
                        to="/"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Customer Support */}
                <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-600 mb-2">
                        If you have any questions about your order, please contact our customer support.
                    </p>
                    <div className="space-x-4 text-sm">
                        <span className="text-gray-600">📧 support@yourstore.com</span>
                        <span className="text-gray-600">📞 1-800-123-4567</span>
                    </div>
                </div>
            </div>
        </div>
    );
}