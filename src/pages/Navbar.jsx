// <Link> is a React Router component used to create navigation links in your app without reloading the page.
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="flex justify-between items-center">
                <ul className="flex space-x-6">
                    <li><Link to='/' className="hover:text-blue-200">Home</Link></li>
                    <li><Link to='/about' className="hover:text-blue-200">About</Link></li>
                    <li><Link to='/products' className="hover:text-blue-200">Products</Link></li>
                </ul>
                
                <div className="flex space-x-4 items-center">
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
        </nav>
    );
}
