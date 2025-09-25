import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'process';

// Load environment variables
dotenv.config();

const checkDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAll collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Count documents in each collection
    console.log('\nDocument counts:');
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }

    // Show all documents in products collection
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log('\nAll products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - isActive: ${product.isActive} - _id: ${product._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDatabase();