# Product Images Guide

## Image Requirements
- **Dimensions**: 500x400px (recommended)
- **Format**: JPG, PNG, or WebP
- **File Size**: Under 100KB each for fast loading
- **Quality**: High resolution, professional looking

## Required Image Files
Place these images in `/public/images/products/`:

1. **smartphone.jpg** - Modern smartphone image
2. **laptop.jpg** - Clean laptop image
3. **coffee-mug.jpg** - Coffee mug (preferably with coffee)
4. **wireless-mouse.jpg** - Computer mouse image
5. **default-product.jpg** - Generic product image (fallback)

## Image Sources
You can download free product images from:
- [Unsplash](https://unsplash.com) - Free high-quality photos
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images

## Usage
After placing images in the folder, run:
```bash
node updateWithLocalImages.js
```

This will update your database to use local images instead of external URLs.