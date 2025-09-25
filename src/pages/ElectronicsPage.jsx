import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ElectronicsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        alert(`${product.name} added to cart!`);
    };

    useEffect(() => {
        const fetchElectronicsProducts = async () => {
            try {
                console.log('Fetching electronics products...');
                const response = await axios.get('http://localhost:5000/api/products?category=electronics&showAll=true');
                console.log('Electronics API Response:', response);
                setProducts(response.data.data || response.data.products || response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching electronics products:', err);
                setError(`Failed to fetch electronics: ${err.message}`);
                setLoading(false);
            }
        };

        fetchElectronicsProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading electronics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-600 text-xl">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    📱 Electronics Store
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Discover the latest in technology with our premium collection of electronics, 
                    from smartphones to smart accessories.
                </p>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600 text-xl">No electronics available at the moment.</p>
                    <p className="text-gray-500 mt-2">Please check back later!</p>
                </div>
            ) : (
                <>
                    {/* Products Count */}
                    <div className="mb-6">
                        <p className="text-gray-600 text-center">
                            Showing {products.length} electronic products
                        </p>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border">
                                <div className="relative">
                                    <img 
                                        src={product.images?.[0]?.url || '/images/products/default-electronics.jpg'} 
                                        alt={product.name}
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=400&fit=crop';
                                        }}
                                    />
                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Electronics
                                    </div>
                                    
                                    {/* Stock Status */}
                                    {product.stock === 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                                            Out of Stock
                                        </div>
                                    )}
                                    {product.stock > 0 && product.stock <= 5 && (
                                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                                            Low Stock
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                        {product.name}
                                    </h2>
                                    {product.brand && (
                                        <p className="text-sm text-blue-600 font-medium mb-2">
                                            {product.brand}
                                        </p>
                                    )}
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                    
                                    {/* Rating */}
                                    {product.ratings && (
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={i < Math.floor(product.ratings.average) ? 'text-yellow-400' : 'text-gray-300'}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">
                                                ({product.ratings.count} reviews)
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${product.price}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <Link 
                                            to={`/products/${product._id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex-1 text-center mr-2"
                                        >
                                            View Details
                                        </Link>
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                                        >
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}