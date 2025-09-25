import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const addNewProducts = async () => {
  try {
    // Get the first user from database to use as creator
    const adminUser = await User.findOne() || await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ No user found in database. Please create a user first.');
      console.log('You can register a user through your app and then run this script.');
      process.exit(1);
    }
    
    console.log(`Using user: ${adminUser.email} as product creator`);
    const createdBy = adminUser._id;
    // Electronics Products
    const electronicsProducts = [
      {
        name: 'Smart Watch',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery life. Perfect for active lifestyle and health monitoring.',
        price: 299.99,
        category: 'electronics',
        brand: 'TechFit',
        stock: 25,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'smart_watch_local',
            url: '/images/products/smart-watch.jpg'
          }
        ],
        ratings: {
          average: 4.5,
          count: 128
        },
        specifications: [
          { key: 'Display', value: '1.4 inch AMOLED' },
          { key: 'Battery Life', value: '7 days' },
          { key: 'Water Resistance', value: '5ATM' }
        ]
      },
      {
        name: 'Wireless Earbuds',
        description: 'Premium noise-cancelling wireless earbuds with crystal clear sound quality and 24-hour battery life with charging case.',
        price: 149.99,
        category: 'electronics',
        brand: 'AudioPro',
        stock: 40,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'wireless_earbuds_local',
            url: '/images/products/wireless-earbuds.jpg'
          }
        ],
        ratings: {
          average: 4.3,
          count: 89
        }
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof Bluetooth speaker with 360-degree sound, 12-hour battery life, and deep bass enhancement.',
        price: 79.99,
        category: 'electronics',
        brand: 'SoundWave',
        stock: 30,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'bluetooth_speaker_local',
            url: '/images/products/bluetooth-speaker.jpg'
          }
        ],
        ratings: {
          average: 4.2,
          count: 156
        }
      }
    ];

    // Home Products
    const homeProducts = [
      {
        name: 'Wall Clock',
        description: 'Modern minimalist wall clock with silent movement. Perfect for living room, bedroom, or office decoration.',
        price: 34.99,
        category: 'home',
        brand: 'HomeDecor',
        stock: 50,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'wall_clock_local',
            url: '/images/products/wall-clock.jpg'
          }
        ],
        ratings: {
          average: 4.1,
          count: 73
        },
        specifications: [
          { key: 'Diameter', value: '12 inches' },
          { key: 'Material', value: 'Wood & Metal' },
          { key: 'Movement', value: 'Silent Quartz' }
        ]
      },
      {
        name: 'Table Lamp',
        description: 'LED desk lamp with adjustable brightness levels and USB charging port. Perfect for reading and work.',
        price: 45.99,
        category: 'home',
        brand: 'LightUp',
        stock: 35,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'table_lamp_local',
            url: '/images/products/table-lamp.jpg'
          }
        ],
        ratings: {
          average: 4.4,
          count: 92
        }
      },
      {
        name: 'Decorative Vase',
        description: 'Elegant ceramic vase with modern geometric design. Perfect centerpiece for flowers or standalone decoration.',
        price: 28.99,
        category: 'home',
        brand: 'ArtHome',
        stock: 20,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'decorative_vase_local',
            url: '/images/products/decorative-vase.jpg'
          }
        ],
        ratings: {
          average: 4.0,
          count: 45
        }
      },
      {
        name: 'Throw Pillow Set',
        description: 'Set of 2 premium cotton throw pillows with removable covers. Available in multiple colors and patterns.',
        price: 39.99,
        category: 'home',
        brand: 'ComfortHome',
        stock: 60,
        isActive: true,
        createdBy: createdBy,
        images: [
          {
            public_id: 'throw_pillow_local',
            url: '/images/products/throw-pillow.jpg'
          }
        ],
        ratings: {
          average: 4.3,
          count: 67
        }
      }
    ];

    // Combine all new products
    const allNewProducts = [...electronicsProducts, ...homeProducts];

    // Check if products already exist and add only new ones
    for (const productData of allNewProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (!existingProduct) {
        const newProduct = new Product(productData);
        await newProduct.save();
        console.log(`✅ Added: ${productData.name} (${productData.category})`);
      } else {
        console.log(`⚠️  Already exists: ${productData.name}`);
      }
    }

    // Show summary
    const totalProducts = await Product.countDocuments();
    const electronicsCount = await Product.countDocuments({ category: 'electronics' });
    const homeCount = await Product.countDocuments({ category: 'home' });
    
    console.log('\n📊 DATABASE SUMMARY:');
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Electronics: ${electronicsCount}`);
    console.log(`Home: ${homeCount}`);
    
    console.log('\n📁 IMAGES NEEDED:');
    console.log('Add these images to public/images/products/:');
    console.log('📱 Electronics:');
    console.log('  - smart-watch.jpg');
    console.log('  - wireless-earbuds.jpg');
    console.log('  - bluetooth-speaker.jpg');
    console.log('🏠 Home:');
    console.log('  - wall-clock.jpg');
    console.log('  - table-lamp.jpg');
    console.log('  - decorative-vase.jpg');
    console.log('  - throw-pillow.jpg');

    process.exit(0);
  } catch (error) {
    console.error('Error adding products:', error);
    process.exit(1);
  }
};

addNewProducts();