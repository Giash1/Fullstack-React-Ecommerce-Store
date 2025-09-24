#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting React Pro Full Stack Application${NC}"
echo ""

# Check if MongoDB is running
echo -e "${YELLOW}📋 Checking Prerequisites...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Check if MongoDB is accessible
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is available${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally. Make sure MongoDB is running or use MongoDB Atlas.${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Installing Dependencies...${NC}"

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
else
    echo "Backend dependencies already installed"
fi

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

echo ""
echo -e "${YELLOW}🌱 Setting up Environment Variables...${NC}"

# Copy environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "Backend .env file created from template"
    echo -e "${YELLOW}⚠️  Please update backend/.env with your configuration${NC}"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Frontend .env file created from template"
fi

echo ""
echo -e "${GREEN}🎯 Starting Development Servers...${NC}"
echo ""
echo -e "${YELLOW}Backend Server: http://localhost:5000${NC}"
echo -e "${YELLOW}Frontend Server: http://localhost:5173${NC}"
echo -e "${YELLOW}API Docs: http://localhost:5000/api/health${NC}"
echo ""
echo -e "${GREEN}Press Ctrl+C to stop both servers${NC}"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Start backend server in background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID