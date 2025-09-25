import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const updateProductImages = async () => {
  try {
    // More accurate and specific product images
    const productImages = {
      'Smartphone': [
        {
          public_id: 'smartphone_1',
          url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop' // Modern smartphone
        }
      ],
      'Laptop': [
        {
          public_id: 'laptop_1',
          url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=400&fit=crop' // Clean laptop image
        }
      ],
      'Coffee Mug': [
        {
          public_id: 'coffee_mug_1',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop' // White coffee mug with coffee
        }
      ],
      'Wireless Mouse': [
        {
          public_id: 'wireless_mouse_1',
          url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=400&fit=crop' // Modern wireless mouse
        }
      ],
      'Headphones': [
        {
          public_id: 'headphones_1',
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=400&fit=crop' // Over-ear headphones
        }
      ],
      'Book': [
        {
          public_id: 'book_1',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop' // Stack of books
        }
      ],
      'T-Shirt': [
        {
          public_id: 'tshirt_1',
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop' // Folded t-shirt
        }
      ],
      'Watch': [
        {
          public_id: 'watch_1',
          url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=400&fit=crop' // Modern wristwatch
        }
      ]
    };

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      // Find matching image based on product name
      let imageToAdd = null;
      
      for (const [name, images] of Object.entries(productImages)) {
        if (product.name.toLowerCase().includes(name.toLowerCase())) {
          imageToAdd = images;
          break;
        }
      }
      
      // If no specific match found, use a generic product image
      if (!imageToAdd) {
        imageToAdd = [
          {
            public_id: 'generic_product',
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop'
          }
        ];
      }

      // Update the product with images
      await Product.findByIdAndUpdate(
        product._id,
        { 
          $set: { 
            images: imageToAdd 
          } 
        }
      );
      
      console.log(`Updated ${product.name} with image: ${imageToAdd[0].url}`);
    }

    console.log('All products updated with images!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
};

updateProductImages();