import axios from 'axios';

const debugCartState = async () => {
    console.log('🔍 Debugging Cart State Issue...\n');

    const credentials = {
        email: 'giashsw@yahoo.com',
        password: 'mypassword123'
    };

    try {
        // Step 1: Login
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', credentials);
        const token = loginResponse.data.token;
        console.log('✅ Login successful');

        // Step 2: Get detailed cart information
        console.log('\n2️⃣ Getting detailed cart information...');
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const cartData = cartResponse.data.data;
        const cartItems = cartData?.items || [];
        
        console.log('📊 Cart Details:');
        console.log(`   Total Items: ${cartItems.length}`);
        console.log(`   Cart Structure:`, JSON.stringify(cartData, null, 2));

        if (cartItems.length > 0) {
            console.log('\n📦 Item Details:');
            cartItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name}`);
                console.log(`      Product ID: ${item.productId}`);
                console.log(`      Quantity: ${item.quantity}`);
                console.log(`      Price: $${item.price}`);
                console.log(`      Stock: ${item.stock}`);
                console.log(`      ---`);
            });

            // Calculate counts
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
            console.log(`\n🔢 Quantity Calculation:`);
            console.log(`   Individual quantities: ${cartItems.map(item => item.quantity).join(' + ')}`);
            console.log(`   Total quantity: ${totalQuantity}`);
            
            if (totalQuantity !== cartItems.length) {
                console.log(`\n⚠️  MISMATCH DETECTED:`);
                console.log(`   Number of different items: ${cartItems.length}`);
                console.log(`   Total quantity (badge count): ${totalQuantity}`);
                console.log(`   This explains why you see "${totalQuantity}" in badge but "${cartItems.length}" items in cart!`);
            }
        } else {
            console.log('   Cart is empty');
        }

        // Step 3: Check for duplicate items
        console.log('\n3️⃣ Checking for duplicates...');
        const productIds = cartItems.map(item => item.productId);
        const uniqueProductIds = [...new Set(productIds)];
        
        if (productIds.length !== uniqueProductIds.length) {
            console.log('⚠️  Duplicate products found in cart!');
            productIds.forEach((id) => {
                const duplicates = productIds.filter(pid => pid === id);
                if (duplicates.length > 1) {
                    console.log(`   Product ${id} appears ${duplicates.length} times`);
                }
            });
        } else {
            console.log('✅ No duplicate products found');
        }

        // Step 4: Frontend perspective simulation
        console.log('\n4️⃣ Frontend Cart Count Calculation:');
        console.log('   This is how getItemCount() calculates:');
        if (cartItems.length > 0) {
            cartItems.forEach((item, index) => {
                console.log(`   Item ${index + 1}: ${item.name} × ${item.quantity} = ${item.quantity}`);
            });
            const frontendCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            console.log(`   Total: ${frontendCount} (this is what shows in the badge)`);
        }

    } catch (error) {
        console.log('❌ Debug failed:', error.response?.data?.message || error.message);
        if (error.response?.data) {
            console.log('   Full error:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

debugCartState().then(() => {
    console.log('\n🏁 Cart debug completed');
    process.exit(0);
}).catch(error => {
    console.error('Debug error:', error);
    process.exit(1);
});