@echo off
cls
echo.
echo 🚀 Starting React Pro Full Stack Application
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo.

echo 🔧 Installing Dependencies...
echo.

REM Install backend dependencies
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
) else (
    echo Backend dependencies already installed
)

REM Install frontend dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

echo.
echo 🌱 Setting up Environment Variables...
echo.

REM Copy environment files if they don't exist
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo Backend .env file created from template
    echo ⚠️  Please update backend/.env with your configuration
)

if not exist ".env" (
    copy ".env.example" ".env"
    echo Frontend .env file created from template
)

echo.
echo 🎯 Starting Development Servers...
echo.
echo Backend Server: http://localhost:5000
echo Frontend Server: http://localhost:5173
echo API Health Check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend server
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting in separate windows
echo.
pause