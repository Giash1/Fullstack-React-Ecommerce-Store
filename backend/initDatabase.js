import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';
import process from 'process';

// Load environment variables
dotenv.config();

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.name);

    // Clear existing data (optional - remove this if you want to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create sample users
    console.log('Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', salt),
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('user123', salt),
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create sample products
    console.log('Creating sample products...');
    const products = [
      {
        name: 'Smartphone',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        category: 'electronics',
        stock: 50,
        images: [{ 
          public_id: 'smartphone_1', 
          url: 'https://via.placeholder.com/300x300?text=Smartphone' 
        }],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 1299.99,
        category: 'electronics',
        stock: 25,
        images: [{ 
          public_id: 'laptop_1', 
          url: 'https://via.placeholder.com/300x300?text=Laptop' 
        }],
        createdBy: createdUsers[0]._id
      },
      {
        name: 'Coffee Mug',
        description: 'Premium ceramic coffee mug',
        price: 19.99,
        category: 'home',
        stock: 100,
        images: [{ 
          public_id: 'mug_1', 
          url: 'https://via.placeholder.com/300x300?text=Coffee+Mug' 
        }],
        createdBy: createdUsers[0]._id
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Show database info
    console.log('\n=== Database Information ===');
    console.log('Cluster: ReactPro1');
    console.log('Database:', mongoose.connection.name);
    console.log('Collections created:');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });

    console.log('\n=== Sample Data Created ===');
    console.log('Users:', await User.countDocuments());
    console.log('Products:', await Product.countDocuments());

    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john@example.com / user123');

    console.log('\n✅ Database initialization completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();