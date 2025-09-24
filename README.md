```markdown
# React Pro - Full Stack Application

A modern full-stack web application built with React, Node.js, Express, and MongoDB.

## Features

### Frontend
- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Latest React with hooks and concurrent features
- 🛣️ **React Router** - Client-side routing
- 📋 **React Hook Form** - Form handling with validation
- 🔄 **React Query** - Data fetching and state management
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔔 **React Hot Toast** - Beautiful notifications
- 🔐 **JWT Authentication** - Secure user authentication
- 📱 **Responsive Design** - Mobile-first approach

### Backend
- 🚀 **Node.js & Express** - Fast web framework
- 🍃 **MongoDB & Mongoose** - NoSQL database with ODM
- 🔒 **JWT Authentication** - JSON Web Token security
- 🔐 **bcryptjs** - Password hashing
- 🛡️ **Helmet** - Security headers
- ⚡ **Rate Limiting** - API protection
- ✅ **Express Validator** - Input validation
- 🌍 **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd react-pro
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Update MONGODB_URI, JWT_SECRET, etc.
```

### 3. Setup Frontend

```bash
# Navigate to frontend directory (from project root)
cd ..

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file if needed
```

### 4. Database Setup

Make sure MongoDB is running on your system:

**For local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**For MongoDB Atlas:**
- Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
- Get your connection string
- Update `MONGODB_URI` in backend/.env

## Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

2. **Start the Frontend Development Server:**
```bash
# In a new terminal, from project root
npm run dev
```
Frontend will run on http://localhost:5173

### Production Mode

1. **Build the Frontend:**
```bash
npm run build
```

2. **Start the Backend:**
```bash
cd backend
npm start
```

## Project Structure

```
react-pro/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── .env           # Environment variables
│   ├── .env.example   # Environment template
│   ├── package.json   # Backend dependencies
│   └── server.js      # Express server
├── src/
│   ├── components/    # Reusable components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── App.jsx        # Main app component
├── public/            # Static files
├── .env              # Frontend environment
├── .env.example      # Environment template
├── package.json      # Frontend dependencies
└── README.md         # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review
- `GET /api/products/categories` - Get categories

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/activate` - Activate user
- `PUT /api/users/:id/deactivate` - Deactivate user
- `GET /api/users/stats` - Get user statistics

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/react-pro-db
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
MAX_FILE_SIZE=5000000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=React Pro
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=5000000
```

## Default Admin User

After setting up the database, you can create an admin user by registering and then manually updating the user's role in MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

## Technologies Used

### Frontend
- React 18
- Vite
- React Router DOM
- React Hook Form
- React Query
- Axios
- React Hot Toast
- Lucide React (Icons)
- Headless UI
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Helmet
- CORS
- Express Rate Limit
- Express Validator
- Multer
- dotenv

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email your-email@example.com or create an issue in the repository. 