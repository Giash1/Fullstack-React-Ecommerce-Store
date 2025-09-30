import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => 
        (item.productId || item._id) === (action.payload.productId || action.payload._id)
      );
      
      if (existingItem) {
        // If item exists, update quantity
        return {
          ...state,
          items: state.items.map(item =>
            (item.productId || item._id) === (action.payload.productId || action.payload._id)
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        // If item doesn't exist, add new item
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => 
          (item.productId || item._id) !== action.payload
        )
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          (item.productId || item._id) === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0) // Remove items with 0 quantity
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        // User is logged in, load cart from database
        try {
          setIsLoading(true);
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: response.data.data.items });
          }
        } catch (error) {
          console.error('Error loading cart from database:', error);
          // Fall back to localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
            } catch (parseError) {
              console.error('Error parsing local cart:', parseError);
            }
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // User not logged in, load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
          }
        }
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Sync local cart with database when user logs in
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (isAuthenticated && user && state.items.length > 0) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:5000/api/cart/sync', {
            localCartItems: state.items
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: response.data.data.items });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    // Only sync when user just logged in (avoid infinite loops)
    if (isAuthenticated && user) {
      syncCartOnLogin();
    }
  }, [isAuthenticated, user, state.items]); // Include state.items in dependencies

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Cart actions
  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated && user) {
      // User is logged in, save to database
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/cart/add', {
          productId: product._id,
          quantity: quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          // Refresh cart from database
          const cartResponse = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (cartResponse.data.success) {
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartResponse.data.data.items });
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Fall back to local storage
        addToLocalCart(product, quantity);
      }
    } else {
      // User not logged in, save to localStorage
      addToLocalCart(product, quantity);
    }
  };

  const addToLocalCart = (product, quantity = 1) => {
    // Handle different image formats - products may have images array or single image
    const productImage = product.images && product.images.length > 0 
      ? product.images[0].url || product.images[0] 
      : product.image || '/images/products/default-product.svg';
    
    const cartItem = {
      _id: product._id,
      productId: product._id, // Add productId for consistency with database items
      name: product.name,
      price: product.price,
      image: productImage,
      stock: product.stock,
      category: product.category,
      quantity: quantity
    };
    
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Refresh cart from database
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (cartResponse.data.success) {
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartResponse.data.data.items });
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
      }
    } else {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/cart/update', {
          productId,
          quantity
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Refresh cart from database
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (cartResponse.data.success) {
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartResponse.data.data.items });
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        dispatch({ 
          type: CART_ACTIONS.UPDATE_QUANTITY, 
          payload: { id: productId, quantity } 
        });
      }
    } else {
      dispatch({ 
        type: CART_ACTIONS.UPDATE_QUANTITY, 
        payload: { id: productId, quantity } 
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/api/cart/clear', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Cart calculations
  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getUniqueItemCount = () => {
    return state.items.length;
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isInCart = (productId) => {
    return state.items.some(item => (item.productId || item._id) === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => (item.productId || item._id) === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getUniqueItemCount,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;