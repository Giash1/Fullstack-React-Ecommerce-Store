import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/react-pro-db');
        console.log('MongoDB connected successfully');

        // Get all users
        const users = await User.find({}).select('name email role isActive createdAt');
        
        console.log(`\n📊 Total Users Found: ${users.length}\n`);
        console.log('=' .repeat(80));
        console.log('| Name                | Email                        | Role    | Active | Created At       |');
        console.log('=' .repeat(80));

        if (users.length === 0) {
            console.log('|                           No users found in database                          |');
        } else {
            users.forEach(user => {
                const name = user.name?.padEnd(18) || 'N/A'.padEnd(18);
                const email = user.email?.padEnd(27) || 'N/A'.padEnd(27);
                const role = user.role?.padEnd(6) || 'user'.padEnd(6);
                const active = (user.isActive ? 'Yes' : 'No').padEnd(5);
                const created = user.createdAt?.toLocaleDateString()?.padEnd(15) || 'N/A'.padEnd(15);
                
                console.log(`| ${name} | ${email} | ${role} | ${active} | ${created} |`);
            });
        }

        console.log('=' .repeat(80));

        // Get user stats
        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
                    adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
                    verifiedUsers: { $sum: { $cond: ['$isEmailVerified', 1, 0] } }
                }
            }
        ]);

        if (stats.length > 0) {
            const stat = stats[0];
            console.log('\n📈 User Statistics:');
            console.log(`   • Total Users: ${stat.totalUsers}`);
            console.log(`   • Active Users: ${stat.activeUsers}`);
            console.log(`   • Admin Users: ${stat.adminUsers}`);
            console.log(`   • Verified Users: ${stat.verifiedUsers}`);
        }

        console.log('\n🔍 To see users with passwords (for debugging):');
        console.log('   Run: node showUsersWithPasswords.js\n');

    } catch (error) {
        console.error('❌ Error checking users:', error.message);
        if (error.name === 'MongoNetworkError') {
            console.log('💡 Make sure MongoDB is running and connection string is correct');
        }
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

checkUsers();