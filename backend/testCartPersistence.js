import axios from 'axios';

const testCartPersistence = async () => {
    console.log('Testing Cart Persistence on Logout/Login...\n');

    const credentials = {
        email: 'giashsw@yahoo.com',
        password: 'mypassword123'
    };

    let token = '';

    try {
        // Step 1: Login
        console.log('1. Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', credentials);
        token = loginResponse.data.token;
        console.log('Login successful');

        // Step 2: Add items to cart
        console.log('\n2. Adding items to cart...');
        try {
            const productsResponse = await axios.get('http://localhost:5000/api/products');
            if (productsResponse.data.data && productsResponse.data.data.length > 0) {
                const firstProduct = productsResponse.data.data[0];
                console.log(`Adding product: ${firstProduct.name}`);

                await axios.post('http://localhost:5000/api/cart/add', {
                    productId: firstProduct._id,
                    quantity: 2
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Items added to cart');
            }
        } catch (error) {
            console.log('Could not add items, continuing with existing cart...', error.message);
        }

        // Step 3: Check cart contents
        console.log('\n3. Checking cart contents before logout...');
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const cartItems = cartResponse.data.data?.items || [];
        console.log(`Cart contains ${cartItems.length} item(s) before logout`);

        if (cartItems.length === 0) {
            console.log('No items in cart to test persistence. Add some items first.');
            return;
        }

        // Show cart items
        cartItems.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.name} (Qty: ${item.quantity})`);
        });

        // Step 4: Logout (should NOT clear cart from database)
        console.log('\n4. Logging out (cart should persist)...');
        await axios.post('http://localhost:5000/api/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Logout successful');

        // Step 5: Login again
        console.log('\n5. Logging in again...');
        const secondLoginResponse = await axios.post('http://localhost:5000/api/auth/login', credentials);
        const newToken = secondLoginResponse.data.token;
        console.log('Second login successful');

        // Step 6: Check if cart persisted
        console.log('\n6. Checking if cart persisted after re-login...');
        const persistedCartResponse = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${newToken}` }
        });
        const persistedCartItems = persistedCartResponse.data.data?.items || [];
        console.log(`Cart contains ${persistedCartItems.length} item(s) after re-login`);

        // Compare cart contents
        if (persistedCartItems.length === cartItems.length) {
            console.log('SUCCESS: Cart persisted correctly after logout/login!');
            console.log('\nPersisted items:');
            persistedCartItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name} (Qty: ${item.quantity})`);
            });
        } else {
            console.log('Cart contents changed after logout/login');
            console.log(`   Before logout: ${cartItems.length} items`);
            console.log(`   After re-login: ${persistedCartItems.length} items`);
        }

        console.log('\nExpected Behavior:');
        console.log('Cart items persist when user logs out and logs back in');
        console.log('Cart only clears when purchase is completed');
        console.log('Users can save items for later by logging in again');

    } catch (error) {
        console.log('Test failed:', error.response?.data?.message || error.message);
        if (error.response?.data) {
            console.log('   Full error:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

testCartPersistence().then(() => {
    console.log('\nCart persistence test completed');
    process.exit(0);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});