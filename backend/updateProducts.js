import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import process from 'process';

// Load environment variables
dotenv.config();

const updateProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Update all products to set isActive: true
    const result = await Product.updateMany(
      { }, // Empty filter means all documents
      { $set: { isActive: true } }, // Set isActive to true
      { upsert: false } // Don't create new documents
    );

    console.log(`Updated ${result.modifiedCount} products`);

    // Show all products
    const allProducts = await Product.find({});
    console.log('\nAll products:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - isActive: ${product.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateProducts();