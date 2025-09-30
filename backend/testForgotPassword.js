import axios from 'axios';

const testForgotPassword = async () => {
    console.log('Testing Forgot Password Functionality...\n');

    const testEmail = 'giashsw@yahoo.com';

    try {
        // Step 1: Test forgot password
        console.log('1. Testing forgot password request...');
        console.log(`   Email: ${testEmail}`);
        
        const forgotResponse = await axios.post('http://localhost:5000/api/auth/forgot-password', {
            email: testEmail
        });

        console.log('SUCCESS: Forgot password request successful!');
        console.log('Response:', {
            success: forgotResponse.data.success,
            message: forgotResponse.data.message,
            resetToken: forgotResponse.data.resetToken ? 'RECEIVED' : 'NOT_RECEIVED'
        });

        if (forgotResponse.data.resetToken) {
            console.log('\n2. Testing reset password with token...');
            const resetToken = forgotResponse.data.resetToken;
            const newPassword = 'newpassword123';

            try {
                const resetResponse = await axios.put(`http://localhost:5000/api/auth/reset-password/${resetToken}`, {
                    password: newPassword
                });

                console.log('SUCCESS: Password reset successful!');
                console.log('Response:', {
                    success: resetResponse.data.success,
                    message: resetResponse.data.message,
                    token: resetResponse.data.token ? 'RECEIVED' : 'NOT_RECEIVED',
                    user: resetResponse.data.user ? resetResponse.data.user.email : 'NOT_RECEIVED'
                });

                // Step 3: Test login with new password
                console.log('\n3. Testing login with new password...');
                try {
                    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
                        email: testEmail,
                        password: newPassword
                    });

                    console.log('SUCCESS: Login with new password successful!');
                    console.log('User:', loginResponse.data.user.email);

                } catch (loginError) {
                    console.log('ERROR: Login with new password failed');
                    console.log('Error:', loginError.response?.data?.message || loginError.message);
                }

            } catch (resetError) {
                console.log('ERROR: Password reset failed');
                console.log('Error:', resetError.response?.data?.message || resetError.message);
            }
        }

    } catch (error) {
        console.log('ERROR: Forgot password request failed');
        console.log('Status:', error.response?.status);
        console.log('Message:', error.response?.data?.message || error.message);
        if (error.response?.data) {
            console.log('Full error:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

// Test invalid scenarios
const testInvalidScenarios = async () => {
    console.log('\n4. Testing invalid scenarios...');

    try {
        // Test with non-existent email
        console.log('   Testing with non-existent email...');
        await axios.post('http://localhost:5000/api/auth/forgot-password', {
            email: 'nonexistent@example.com'
        });
        console.log('   ERROR: Should have failed with non-existent email');
    } catch (error) {
        console.log('   EXPECTED: Non-existent email rejected -', error.response?.data?.message);
    }

    try {
        // Test with invalid reset token
        console.log('   Testing with invalid reset token...');
        await axios.put('http://localhost:5000/api/auth/reset-password/invalidtoken123', {
            password: 'newpassword123'
        });
        console.log('   ERROR: Should have failed with invalid token');
    } catch (error) {
        console.log('   EXPECTED: Invalid token rejected -', error.response?.data?.message);
    }

    try {
        // Test with short password
        console.log('   Testing with short password...');
        await axios.put('http://localhost:5000/api/auth/reset-password/sometoken', {
            password: '123'
        });
        console.log('   ERROR: Should have failed with short password');
    } catch (error) {
        console.log('   EXPECTED: Short password rejected -', error.response?.data?.message);
    }
};

const runTests = async () => {
    try {
        await testForgotPassword();
        await testInvalidScenarios();
    } catch (error) {
        console.error('Test suite error:', error);
    }
};

runTests().then(() => {
    console.log('\nForgot password test completed');
    process.exit(0);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});