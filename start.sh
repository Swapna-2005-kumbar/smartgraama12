#!/bin/bash

echo "🚀 Starting SmartGraama Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please ensure MongoDB is installed and running."
    echo "   You can use Docker: docker run -d -p 27017:27017 --name mongo mongo:6.0"
fi

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file for backend..."
    cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/smartgraama
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
EOF
    echo "✅ .env file created"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Start backend in background
echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Start frontend
echo "🎨 Starting frontend application..."
npm start

# Cleanup function
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait 