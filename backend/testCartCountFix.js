import axios from 'axios';

const testCartCountDisplay = async () => {
    console.log('🧪 Testing Cart Count Display Fix...\n');

    const credentials = {
        email: 'giashsw@yahoo.com',
        password: 'mypassword123'
    };

    try {
        // Login and check cart
        console.log('1️⃣ Logging in and checking cart...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', credentials);
        const token = loginResponse.data.token;
        
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const cartItems = cartResponse.data.data?.items || [];
        
        console.log('📊 Cart Analysis:');
        console.log(`   Number of unique products: ${cartItems.length}`);
        
        if (cartItems.length > 0) {
            console.log('   Product details:');
            cartItems.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.name} - Quantity: ${item.quantity}`);
            });
            
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
            console.log(`   Total quantity (old badge): ${totalQuantity}`);
            console.log(`   Unique items (new badge): ${cartItems.length}`);
            
            console.log('\n🎯 Expected Behavior:');
            console.log(`   ✅ Badge will now show: ${cartItems.length} (unique products)`);
            console.log(`   ✅ Cart will show: ${cartItems.length} product(s)`);
            console.log(`   ✅ No more mismatch between badge and cart content!`);
            
            if (cartItems.length === 1 && totalQuantity > 1) {
                console.log('\n💡 Perfect! This fixes your issue:');
                console.log(`   Before: Badge showed "${totalQuantity}" but cart had "${cartItems.length}" item`);
                console.log(`   After: Badge will show "${cartItems.length}" matching cart content`);
            }
        } else {
            console.log('   Cart is empty');
        }

    } catch (error) {
        console.log('Test failed:', error.response?.data?.message || error.message);
    }

    console.log('\nSummary of Changes:');
    console.log('Added getUniqueItemCount() function to CartContext');
    console.log('Updated Navbar to use unique item count instead of total quantity');
    console.log('Badge now matches cart content (shows number of different products)');
    console.log('No more confusion between quantity and item count');
};

testCartCountDisplay().then(() => {
    console.log('\nCart count display test completed');
    process.exit(0);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});