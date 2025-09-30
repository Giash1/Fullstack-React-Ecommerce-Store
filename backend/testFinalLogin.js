import axios from 'axios';

const testFinalLogin = async () => {
    console.log('Testing Final Login...\n');

    const credentials = {
        email: 'giashsw@yahoo.com',
        password: 'mypassword123'
    };

    try {
        console.log('Attempting to login with:', credentials.email);
        const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
        
        console.log('LOGIN SUCCESSFUL!');
        console.log('');
        console.log('Login Response:');
        console.log('   Success:', response.data.success);
        console.log('   Message:', response.data.message);
        console.log('');
        console.log('User Information:');
        console.log('   ID:', response.data.user.id);
        console.log('   Name:', response.data.user.name);
        console.log('   Email:', response.data.user.email);
        console.log('   Role:', response.data.user.role);
        console.log('   Email Verified:', response.data.user.isEmailVerified);
        console.log('');
        console.log('Authentication Token:');
        console.log('   Token Received:', !!response.data.token);
        console.log('   Token Length:', response.data.token ? response.data.token.length : 0);
        console.log('   Token Preview:', response.data.token ? response.data.token.substring(0, 20) + '...' : 'None');
        
        console.log('');
        console.log('You can now use these credentials to login:');
        console.log(`   Email: ${credentials.email}`);
        console.log(`   Password: ${credentials.password}`);
        
    } catch (error) {
        console.log('Login Failed!');
        
        if (error.response) {
            console.log('Error Details:');
            console.log('   Status:', error.response.status);
            console.log('   Message:', error.response.data?.message || 'No message');
            console.log('   Full Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('Network Error - Server might not be running');
        } else {
            console.log('Unknown Error:', error.message);
        }
    }
};

testFinalLogin().then(() => {
    console.log('\nLogin test completed');
    process.exit(0);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});