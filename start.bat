@echo off
echo 🚀 Starting SmartGraama Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist "backend\.env" (
    echo 📝 Creating .env file for backend...
    (
        echo MONGODB_URI=mongodb://localhost:27017/smartgraama
        echo JWT_SECRET=your_jwt_secret_key_here_change_in_production
        echo PORT=5000
    ) > backend\.env
    echo ✅ .env file created
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Start backend in background
echo 🔧 Starting backend server...
start "Backend Server" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

REM Start frontend
echo 🎨 Starting frontend application...
npm start

pause 