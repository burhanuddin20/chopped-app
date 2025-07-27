#!/bin/bash

echo "🚀 Setting up Chopped App..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install frontend dependencies
echo ""
echo "📱 Setting up Frontend..."
cd "$(dirname "$0")"
npm install

# Create frontend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "✅ Frontend .env created. Update EXPO_PUBLIC_API_URL if needed."
else
    echo "✅ Frontend .env already exists."
fi

# Setup backend
echo ""
echo "🔧 Setting up Backend..."
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please ensure the backend folder exists."
    exit 1
fi

cd backend
npm install

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
EOF
    echo "✅ Backend .env created. Please add your OpenAI API key."
else
    echo "✅ Backend .env already exists."
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: npm start"
echo ""
echo "For more information, see README.md"