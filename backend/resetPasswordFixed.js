import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const resetPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/react-pro-db');
        console.log('✅ MongoDB connected successfully');

        const email = 'giashsw@yahoo.com';
        const newPassword = 'mypassword123'; // You can change this

        console.log(`🔄 Resetting password for: ${email}`);

        // Find the user
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log(`👤 Found user: ${user.name}`);

        // Set password (will be hashed by pre-save middleware)
        user.password = newPassword;
        await user.save();

        console.log('✅ Password reset successfully!');
        console.log(`🔑 New password: ${newPassword}`);
        console.log('');
        console.log('💡 You can now login with:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${newPassword}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
};

resetPassword();