import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                    Welcome to React Pro Shop
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Your one-stop destination for quality products
                </p>
                
                <div className="flex justify-center space-x-4">
                    <Link 
                        to="/products" 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Shop Now
                    </Link>
                    <Link 
                        to="/about" 
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Quality Products</h3>
                    <p className="text-gray-600">We offer only the best quality products for our customers.</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Fast Shipping</h3>
                    <p className="text-gray-600">Get your orders delivered quickly and safely to your doorstep.</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Great Support</h3>
                    <p className="text-gray-600">Our customer support team is always ready to help you.</p>
                </div>
            </div>
        </div>
    )
}