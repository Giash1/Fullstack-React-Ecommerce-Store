import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart, getItemQuantity } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log('Fetching product with ID:', id);
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                console.log('Product API Response:', response);
                setProduct(response.data.data || response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(`Failed to fetch product: ${err.message}`);
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        setAddingToCart(true);
        try {
            addToCart(product, quantity);
            alert(`Added ${quantity} ${product.name}(s) to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-600 text-xl mb-4">{error}</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600 text-xl">Product not found</p>
                    <Link 
                        to="/products" 
                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        );
    }

    const categoryColor = product.category === 'electronics' ? 'blue' : 
                         product.category === 'home' ? 'green' : 'gray';

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-sm">
                    <li><Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
                    <li><span className="text-gray-400">/</span></li>
                    <li><Link to="/products" className="text-blue-600 hover:text-blue-800">Products</Link></li>
                    <li><span className="text-gray-400">/</span></li>
                    <li>
                        <Link 
                            to={`/${product.category}`} 
                            className="text-blue-600 hover:text-blue-800 capitalize"
                        >
                            {product.category}
                        </Link>
                    </li>
                    <li><span className="text-gray-400">/</span></li>
                    <li className="text-gray-600">{product.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                        <img 
                            src={product.images?.[selectedImageIndex]?.url || '/images/products/default-product.jpg'} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop';
                            }}
                        />
                    </div>
                    
                    {/* Image Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                                >
                                    <img 
                                        src={image.url} 
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    {/* Category Badge */}
                    <div className="flex items-center space-x-2">
                        <span className={`bg-${categoryColor}-100 text-${categoryColor}-800 px-3 py-1 rounded-full text-sm font-medium capitalize`}>
                            {product.category}
                        </span>
                        {product.brand && (
                            <span className="text-gray-500 text-sm">by {product.brand}</span>
                        )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                    {/* Rating */}
                    {product.ratings && (
                        <div className="flex items-center space-x-3">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-2xl ${i < Math.floor(product.ratings.average) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {product.ratings.average}/5 ({product.ratings.count} reviews)
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="text-4xl font-bold text-green-600">
                        ${product.price}
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Specifications */}
                    {product.specifications && product.specifications.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <dl className="grid grid-cols-1 gap-2">
                                    {product.specifications.map((spec, index) => (
                                        <div key={index} className="flex justify-between py-1">
                                            <dt className="font-medium text-gray-600">{spec.key}:</dt>
                                            <dd className="text-gray-900">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center space-x-3">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                        </span>
                    </div>

                    {/* Quantity Selector & Add to Cart */}
                    {product.stock > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600 font-medium">Quantity:</span>
                                <div className="flex items-center border rounded-lg">
                                    <button 
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 font-medium">{quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Total: ${(product.price * quantity).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex space-x-4">
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.stock === 0}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        categoryColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                                        categoryColor === 'green' ? 'bg-green-600 hover:bg-green-700' :
                                        'bg-gray-600 hover:bg-gray-700'
                                    } text-white`}
                                >
                                    {addingToCart ? 'Adding...' : 
                                     product.stock === 0 ? 'Out of Stock' :
                                     isInCart(product._id) ? `In Cart (${getItemQuantity(product._id)})` : 
                                     'Add to Cart'}
                                </button>
                                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    ♡ Wishlist
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Out of Stock Message */}
                    {product.stock === 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 font-medium">This product is currently out of stock.</p>
                            <p className="text-red-600 text-sm mt-1">We&apos;ll notify you when it becomes available.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Back to Category Button */}
            <div className="mt-12 text-center">
                <Link 
                    to={`/${product.category}`}
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        categoryColor === 'blue' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        categoryColor === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                    ← Back to {product.category === 'electronics' ? '📱 Electronics' : '🏠 Home & Living'}
                </Link>
            </div>
        </div>
    );
}