// <Link> is a React Router component used to create navigation links in your app without reloading the page.
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';

export default function NavBar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { getUniqueItemCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="flex justify-between items-center">
                <ul className="flex space-x-6">
                    <li><Link to='/' className="hover:text-blue-200">Home</Link></li>
                    <li><Link to='/about' className="hover:text-blue-200">About</Link></li>
                    <li><Link to='/products' className="hover:text-blue-200">All Products</Link></li>
                    <li><Link to='/electronics' className="hover:text-blue-200">📱 Electronics</Link></li>
                    <li><Link to='/home' className="hover:text-blue-200">🏠 Home & Living</Link></li>
                </ul>
                
                <div className="flex space-x-4 items-center">
                    {/* Cart Icon */}
                    <button
                        onClick={toggleCart}
                        className="relative p-2 hover:bg-blue-700 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 11-4 0v-5m4-5V5a2 2 0 10-4 0v3" />
                        </svg>
                        {getUniqueItemCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {getUniqueItemCount()}
                            </span>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <>
                            <span className="text-blue-200">Welcome, {user?.name}</span>
                            <button 
                                onClick={handleLogout}
                                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <li><Link to='/login' className="hover:text-blue-200">Login</Link></li>
                            <li><Link to='/register' className="hover:text-blue-200">Register</Link></li>
                        </>
                    )}
                </div>
            </div>
            
            {/* Cart Component */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}
