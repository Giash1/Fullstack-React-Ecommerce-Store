import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const updateProductsWithLocalImages = async () => {
  try {
    // Map your downloaded images to products
    // Make sure to download images with these exact names and put them in /public/images/products/
    const productImages = {
      'Smartphone': [
        {
          public_id: 'smartphone_local',
          url: '/images/products/smartphone.jpg'  // You'll put smartphone.jpg in public/images/products/
        }
      ],
      'Laptop': [
        {
          public_id: 'laptop_local',
          url: '/images/products/laptop.jpg'  // You'll put laptop.jpg in public/images/products/
        }
      ],
      'Coffee Mug': [
        {
          public_id: 'coffee_mug_local',
          url: '/images/products/coffee-mug.jpg'  // You'll put coffee-mug.jpg in public/images/products/
        }
      ],
      'Wireless Mouse': [
        {
          public_id: 'wireless_mouse_local',
          url: '/images/products/wireless-mouse.jpg'  // You'll put wireless-mouse.jpg in public/images/products/
        }
      ],
      'Headphones': [
        {
          public_id: 'headphones_local',
          url: '/images/products/headphones.jpg'
        }
      ],
      'T-Shirt': [
        {
          public_id: 'tshirt_local',
          url: '/images/products/tshirt.jpg'
        }
      ],
      'Watch': [
        {
          public_id: 'watch_local',
          url: '/images/products/watch.jpg'
        }
      ]
    };

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    console.log('Products found:', products.map(p => p.name));

    for (const product of products) {
      // Find matching image based on product name
      let imageToAdd = null;
      
      for (const [name, images] of Object.entries(productImages)) {
        if (product.name.toLowerCase().includes(name.toLowerCase())) {
          imageToAdd = images;
          break;
        }
      }
      
      // If no specific match found, use a default local image
      if (!imageToAdd) {
        imageToAdd = [
          {
            public_id: 'default_product_local',
            url: '/images/products/default-product.jpg'  // A generic product image
          }
        ];
      }

      // Update the product with local images
      await Product.findByIdAndUpdate(
        product._id,
        { 
          $set: { 
            images: imageToAdd 
          } 
        }
      );
      
      console.log(`Updated ${product.name} with local image: ${imageToAdd[0].url}`);
    }

    console.log('\n✅ All products updated with local images!');
    console.log('\n📁 Next steps:');
    console.log('1. Download your product images');
    console.log('2. Save them in: public/images/products/');
    console.log('3. Use these filenames:');
    console.log('   - smartphone.jpg');
    console.log('   - laptop.jpg');
    console.log('   - coffee-mug.jpg');
    console.log('   - wireless-mouse.jpg');
    console.log('   - default-product.jpg (for fallback)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
};

updateProductsWithLocalImages();