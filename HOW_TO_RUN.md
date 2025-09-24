# 🚀 How to Run Your Full-Stack React Project

## Quick Setup Guide

### Step 1: Database Setup (Choose One Option)

#### Option A: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `backend/.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/react-pro-db
   ```

#### Option B: Local MongoDB
1. Install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Keep the default connection in `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/react-pro-db
   ```

### Step 2: Start the Servers

#### Method 1: Automatic (Windows)
Double-click `start.bat` file in the project root

#### Method 2: Manual
Open two separate terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

### Step 3: Access Your Application

1. **Frontend**: Open http://localhost:5173 in your browser
2. **Backend API**: http://localhost:5000/api/health
3. **API Documentation**: See README.md for all endpoints

### Step 4: Test the Application

1. Register a new user
2. Login with your credentials
3. Browse products
4. Test the admin features (update user role to 'admin' in database)

## Troubleshooting

### Common Issues:

1. **"MongoDB connection error"**
   - Check your MongoDB connection string
   - Ensure MongoDB service is running (if local)
   - Verify network access (if using Atlas)

2. **"Port already in use"**
   - Close other applications using ports 3000, 5000, or 5173
   - Or change the PORT in backend/.env

3. **"Module not found"**
   - Run `npm install` in both root directory and backend directory

4. **"Cannot access before initialization"**
   - Ensure all environment variables are set correctly

### Environment Variables Checklist:

**backend/.env:**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-at-least-32-characters
JWT_EXPIRE=30d
```

**root/.env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=React Pro
```

## Features Available

- 🔐 User registration and login
- 👤 User profile management
- 📦 Product catalog with search and filtering
- 🏪 Admin panel for product management
- 🔒 Role-based access control
- 📱 Responsive design
- 🔔 Toast notifications

## Default Admin Setup

After registering a user, you can make them an admin by updating the database:

1. Connect to your MongoDB database
2. Find the user in the `users` collection
3. Update their `role` field to `"admin"`

```javascript
// In MongoDB shell or compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Next Steps

1. Customize the styling with Tailwind CSS
2. Add more product categories
3. Implement shopping cart functionality
4. Add payment integration
5. Deploy to production

Happy coding! 🎉