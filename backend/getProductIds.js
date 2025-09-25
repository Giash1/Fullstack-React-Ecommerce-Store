import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const getProductIds = async () => {
  try {
    const products = await Product.find({}).limit(5);
    
    console.log('Available Product IDs for testing:');
    console.log('=====================================');
    products.forEach((product) => {
      console.log(`${product.name}: ${product._id}`);
      console.log(`URL: http://localhost:5173/products/${product._id}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

getProductIds();