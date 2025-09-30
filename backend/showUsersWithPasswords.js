import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const showUsersWithPasswords = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/react-pro-db');
        console.log('MongoDB connected successfully');

        // Get all users including passwords
        const users = await User.find({}).select('name email password role isActive createdAt');
        
        console.log(`\n🔐 Users with Password Details: ${users.length}\n`);
        console.log('=' .repeat(100));

        if (users.length === 0) {
            console.log('No users found in database');
        } else {
            for (const user of users) {
                console.log(`👤 User: ${user.name}`);
                console.log(`   📧 Email: ${user.email}`);
                console.log(`   🔑 Password Hash: ${user.password?.substring(0, 30)}...`);
                console.log(`   🛡️  Role: ${user.role || 'user'}`);
                console.log(`   ✅ Active: ${user.isActive ? 'Yes' : 'No'}`);
                console.log(`   📅 Created: ${user.createdAt?.toLocaleString()}`);
                
                // Test if password is properly hashed
                const isHashed = user.password?.startsWith('$2a$') || user.password?.startsWith('$2b$');
                console.log(`   🔒 Password Hashed: ${isHashed ? 'Yes' : 'No'}`);
                
                console.log('   ' + '-'.repeat(50));
            }
        }

        console.log('\n💡 Registration Test:');
        console.log('   Try registering with a new email address');
        console.log('   Check server logs for detailed error messages\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

showUsersWithPasswords();