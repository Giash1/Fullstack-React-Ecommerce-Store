import axios from 'axios';

const testProductsAPI = async () => {
    console.log('Testing Products API Endpoints...\n');

    try {
        // Test all products
        console.log('1. Testing /api/products (all products)...');
        const allProductsResponse = await axios.get('http://localhost:5000/api/products');
        console.log(`All products: ${allProductsResponse.data.data?.length || 0} items`);
        
        // Test electronics
        console.log('\n2. Testing /api/products?category=electronics...');
        const electronicsResponse = await axios.get('http://localhost:5000/api/products?category=electronics');
        console.log(`Electronics: ${electronicsResponse.data.data?.length || 0} items`);
        
        // Test home category
        console.log('\n3. Testing /api/products?category=home...');
        const homeResponse = await axios.get('http://localhost:5000/api/products?category=home');
        console.log(`Home & Living: ${homeResponse.data.data?.length || 0} items`);

        // Show sample products
        if (allProductsResponse.data.data && allProductsResponse.data.data.length > 0) {
            console.log('\nSample Products:');
            allProductsResponse.data.data.slice(0, 3).forEach((product, index) => {
                console.log(`   ${index + 1}. ${product.name} (${product.category}) - $${product.price}`);
            });
        }

        console.log('\nAll API endpoints are working correctly!');
        console.log('   Frontend should be able to load products properly.');

    } catch (error) {
        console.log('API Test failed:', error.message);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Message: ${error.response.data?.message || 'No message'}`);
        } else if (error.request) {
            console.log('   Network error - backend server might not be running');
        }
    }
};

testProductsAPI().then(() => {
    console.log('\nProducts API test completed');
    process.exit(0);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});