import axios from 'axios';

const testRegistration = async () => {
    console.log('Testing User Registration...\n');

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    try {
        // Test registration
        console.log('Attempting to register user:', testUser.email);
        const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
        
        console.log('Registration Successful!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('Registration Failed!');
        
        if (error.response) {
            console.log('Error Details:');
            console.log('   Status:', error.response.status);
            console.log('   Message:', error.response.data?.message || 'No message');
            console.log('   Errors:', error.response.data?.errors || 'No errors');
            console.log('   Full Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('Network Error - Server might not be running');
            console.log('   Make sure backend server is running on http://localhost:5000');
        } else {
            console.log('Unknown Error:', error.message);
        }
    }

    // Test if we can access debug endpoint
    try {
        console.log('\nChecking existing users...');
        const usersResponse = await axios.get('http://localhost:5000/api/users/debug/all');
        console.log(`Found ${usersResponse.data.count} users in database`);
        
        if (usersResponse.data.count > 0) {
            console.log('\nUser List:');
            usersResponse.data.data.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
            });
        }
    } catch (error) {
        console.log('Could not fetch users:', error.response?.data?.message || error.message);
    }

    console.log('\n💡 Troubleshooting Tips:');
    console.log('   1. Check if backend server is running: npm run dev');
    console.log('   2. Check MongoDB connection');
    console.log('   3. Verify email is not already registered');
    console.log('   4. Check server logs for detailed errors');
    console.log('   5. Try different email addresses');
};

testRegistration();