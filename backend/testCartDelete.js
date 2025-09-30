import axios from 'axios';

const testCartDelete = async () => {
    console.log('Testing Cart Delete Functionality...\n');

    const credentials = {
        email: 'giashsw@yahoo.com',
        password: 'mypassword123'
    };

    try {
        // Step 1: Login
        console.log('1. Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', credentials);
        const token = loginResponse.data.token;
        console.log('Login successful');

        // Step 2: Check current cart
        console.log('\n2. Getting current cart...');
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const cartItems = cartResponse.data.data?.items || [];
        console.log(`Cart contains ${cartItems.length} item(s)`);

        if (cartItems.length > 0) {
            console.log('Current items:');
            cartItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name} (ID: ${item.productId}) - Qty: ${item.quantity}`);
            });

            // Step 3: Try to delete the first item
            const firstItem = cartItems[0];
            console.log(`\n3. Attempting to delete: ${firstItem.name} (ID: ${firstItem.productId})`);
            
            try {
                const deleteResponse = await axios.delete(
                    `http://localhost:5000/api/cart/remove/${firstItem.productId}`, 
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                console.log('Delete response:', deleteResponse.data);

                // Step 4: Check cart after deletion
                console.log('\n4. Checking cart after deletion...');
                const updatedCartResponse = await axios.get('http://localhost:5000/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const updatedCartItems = updatedCartResponse.data.data?.items || [];
                console.log(`Cart now contains ${updatedCartItems.length} item(s)`);

                if (updatedCartItems.length > 0) {
                    console.log('Remaining items:');
                    updatedCartItems.forEach((item, index) => {
                        console.log(`   ${index + 1}. ${item.name} (ID: ${item.productId}) - Qty: ${item.quantity}`);
                    });
                }

                if (updatedCartItems.length < cartItems.length) {
                    console.log('\nSUCCESS: Item was successfully deleted from cart!');
                } else {
                    console.log('\nERROR: Item was not deleted from cart');
                }

            } catch (deleteError) {
                console.log('Delete request failed:');
                console.log('   Status:', deleteError.response?.status);
                console.log('   Message:', deleteError.response?.data?.message || deleteError.message);
                console.log('   Full error:', deleteError.response?.data);
            }
        } else {
            console.log('Cart is empty - nothing to delete');
            
            // Add an item first for testing
            console.log('\n3. Adding an item for testing...');
            const productsResponse = await axios.get('http://localhost:5000/api/products');
            if (productsResponse.data.data && productsResponse.data.data.length > 0) {
                const firstProduct = productsResponse.data.data[0];
                await axios.post('http://localhost:5000/api/cart/add', {
                    productId: firstProduct._id,
                    quantity: 1
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`Added ${firstProduct.name} to cart for testing`);
                
                // Now try to delete it
                console.log('\n4. Now attempting to delete the test item...');
                try {
                    const deleteResponse = await axios.delete(
                        `http://localhost:5000/api/cart/remove/${firstProduct._id}`, 
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    console.log('Delete response:', deleteResponse.data);
                    console.log('SUCCESS: Delete functionality is working!');
                } catch (deleteError) {
                    console.log('Delete request failed:');
                    console.log('   Status:', deleteError.response?.status);
                    console.log('   Message:', deleteError.response?.data?.message || deleteError.message);
                }
            }
        }

    } catch (error) {
        console.log('Test failed:', error.response?.data?.message || error.message);
        if (error.response?.data) {
            console.log('   Full error:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

testCartDelete().then(() => {
    console.log('\nCart delete test completed');
    process.exit(0);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});