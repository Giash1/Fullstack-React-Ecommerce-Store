import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductsListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('=== DEBUGGING PRODUCTS FETCH ===');
                console.log('Attempting to fetch products from:', 'http://localhost:5000/api/products?showAll=true');
                console.log('Current timestamp:', new Date().toISOString());
                
                const response = await axios.get('http://localhost:5000/api/products?showAll=true');
                console.log('API Response received:', response);
                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
                console.log('Products array:', response.data.data);
                console.log('Number of products:', response.data.data?.length);
                
                const productsData = response.data.data || response.data.products || response.data;
                console.log('Final products data:', productsData);
                
                setProducts(productsData);
                setLoading(false);
                console.log('=== PRODUCTS LOADED SUCCESSFULLY ===');
            } catch (err) {
                console.log('=== ERROR OCCURRED ===');
                console.error('Detailed error fetching products:', err);
                console.error('Error message:', err.message);
                console.error('Error response:', err.response);
                console.error('Error request:', err.request);
                console.error('Error config:', err.config);
                console.log('=== ERROR END ===');
                setError(`Failed to fetch products: ${err.message}`);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Our Products
            </h1>
            
            {products.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600 text-xl">No products available at the moment.</p>
                    <p className="text-gray-500 mt-2">Please check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative">
                                <img 
                                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop'} 
                                    alt={product.name}
                                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop';
                                    }}
                                />
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
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${product.price}
                                    </span>
                                    <span className="text-sm text-gray-500 capitalize">
                                        {product.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Stock: {product.stock}
                                    </span>
                                    <Link 
                                        to={`/products/${product._id}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}