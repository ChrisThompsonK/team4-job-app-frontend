#!/bin/bash

echo "🔍 Frontend Diagnostics"
echo "========================"
echo ""

# Check Node version
echo "📦 Node version:"
node --version
echo ""

# Check npm packages installed
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules missing - run: npm install"
fi
echo ""

# Check if backend is running
echo "🔌 Checking if backend API is accessible..."
if nc -z localhost 3001 2>/dev/null; then
    echo "✅ Backend accessible on localhost:3001"
elif nc -z localhost 8080 2>/dev/null; then
    echo "⚠️  Found service on localhost:8080 (might be backend)"
    echo "   Update .env: API_BASE_URL=http://localhost:8080"
else
    echo "❌ Backend not found on localhost:3001"
    echo "   Make sure backend is running first!"
fi
echo ""

# Check frontend port
echo "🔌 Checking if frontend port 3000 is available..."
if ! nc -z localhost 3000 2>/dev/null; then
    echo "✅ Port 3000 is available"
else
    echo "⚠️  Port 3000 is already in use"
fi
echo ""

# Check .env file
echo "📄 Checking .env configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo ""
    echo "Current configuration:"
    grep -E "PORT|API_BASE_URL|NODE_ENV" .env || true
else
    echo "❌ .env file missing"
fi
echo ""

echo "✅ Diagnostics complete!"
echo ""
echo "Next steps:"
echo "1. Make sure backend is running on the port shown in .env"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo "4. Run tests: npm run test:pw:ui"
