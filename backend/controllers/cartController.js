import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }
        
        // Verify product availability and update cart
        const validItems = [];
        let cartUpdated = false;
        
        for (const item of cart.items) {
            if (item.productId) {
                // Update item details from current product data
                const currentProduct = item.productId;
                if (currentProduct.stock > 0) {
                    validItems.push({
                        _id: item._id,
                        productId: item.productId._id,
                        name: currentProduct.name,
                        price: currentProduct.price,
                        image: currentProduct.images && currentProduct.images.length > 0 
                            ? currentProduct.images[0].url || currentProduct.images[0]
                            : '/images/products/default-product.svg',
                        category: currentProduct.category,
                        quantity: Math.min(item.quantity, currentProduct.stock),
                        stock: currentProduct.stock
                    });
                    
                    if (item.quantity > currentProduct.stock) {
                        cartUpdated = true;
                    }
                } else {
                    cartUpdated = true; // Item out of stock, will be removed
                }
            } else {
                cartUpdated = true; // Product no longer exists
            }
        }
        
        if (cartUpdated) {
            cart.items = validItems;
            await cart.save();
        }
        
        res.json({
            success: true,
            data: {
                items: validItems,
                itemCount: validItems.reduce((total, item) => total + item.quantity, 0),
                totalPrice: validItems.reduce((total, item) => total + (item.price * item.quantity), 0)
            }
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cart',
            error: error.message
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }
        
        // Verify product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`
            });
        }
        
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add ${quantity} more items. Only ${product.stock - cart.items[existingItemIndex].quantity} more available.`
                });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item
            const productImage = product.images && product.images.length > 0 
                ? product.images[0].url || product.images[0]
                : '/images/products/default-product.svg';
                
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: productImage,
                category: product.category,
                quantity: quantity,
                stock: product.stock
            });
        }
        
        await cart.save();
        
        res.json({
            success: true,
            message: 'Item added to cart',
            data: {
                itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
                totalPrice: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
            }
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        
        if (!productId || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID or quantity'
            });
        }
        
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        if (quantity === 0) {
            // Remove item
            cart.items.splice(itemIndex, 1);
        } else {
            // Verify stock availability
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            
            if (quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} items available in stock`
                });
            }
            
            cart.items[itemIndex].quantity = quantity;
        }
        
        await cart.save();
        
        res.json({
            success: true,
            message: 'Cart updated',
            data: {
                itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
                totalPrice: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
            }
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart',
            error: error.message
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        cart.items = cart.items.filter(item => 
            item.productId.toString() !== productId
        );
        
        await cart.save();
        
        res.json({
            success: true,
            message: 'Item removed from cart',
            data: {
                itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
                totalPrice: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
            }
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart',
            error: error.message
        });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await Cart.findOneAndUpdate(
            { userId },
            { items: [] },
            { upsert: true }
        );
        
        res.json({
            success: true,
            message: 'Cart cleared',
            data: {
                itemCount: 0,
                totalPrice: 0
            }
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart',
            error: error.message
        });
    }
};

// Sync local cart with database cart (for when user logs in)
const syncCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { localCartItems = [] } = req.body;
        
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        
        // Merge local cart items with database cart
        for (const localItem of localCartItems) {
            const product = await Product.findById(localItem.productId || localItem._id);
            if (!product || product.stock === 0) continue;
            
            const existingItemIndex = cart.items.findIndex(item => 
                item.productId.toString() === (localItem.productId || localItem._id)
            );
            
            const productImage = product.images && product.images.length > 0 
                ? product.images[0].url || product.images[0]
                : '/images/products/default-product.svg';
            
            if (existingItemIndex > -1) {
                // Update quantity (take maximum of local and database)
                const maxQuantity = Math.max(
                    cart.items[existingItemIndex].quantity,
                    localItem.quantity
                );
                cart.items[existingItemIndex].quantity = Math.min(maxQuantity, product.stock);
            } else {
                // Add new item
                cart.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: productImage,
                    category: product.category,
                    quantity: Math.min(localItem.quantity, product.stock),
                    stock: product.stock
                });
            }
        }
        
        await cart.save();
        
        // Return updated cart
        const populatedCart = await Cart.findOne({ userId }).populate('items.productId');
        const validItems = populatedCart.items.map(item => ({
            _id: item._id,
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            image: item.image,
            category: item.productId.category,
            quantity: item.quantity,
            stock: item.productId.stock
        }));
        
        res.json({
            success: true,
            message: 'Cart synced successfully',
            data: {
                items: validItems,
                itemCount: validItems.reduce((total, item) => total + item.quantity, 0),
                totalPrice: validItems.reduce((total, item) => total + (item.price * item.quantity), 0)
            }
        });
    } catch (error) {
        console.error('Sync cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync cart',
            error: error.message
        });
    }
};

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart
};