#!/bin/bash

# Test what ports have backend services running
echo "🔍 Searching for running backend services..."
echo ""

# Array of common backend ports
ports=(3001 5000 8000 8080 4000 5001 9000)

found=false

for port in "${ports[@]}"; do
    if lsof -i ":$port" 2>/dev/null | grep -q LISTEN; then
        echo "✅ Found service on port $port"
        
        # Try to identify it
        echo "   Testing if it's a job API..."
        
        # Try common API endpoints
        if timeout 2 curl -s "http://localhost:$port/jobs" 2>/dev/null | grep -q . ; then
            echo "   ✅ Responds to /jobs endpoint - Likely backend!"
            echo ""
            echo "   👉 Update .env:"
            echo "      API_BASE_URL=http://localhost:$port"
            found=true
        elif timeout 2 curl -s "http://localhost:$port/api/jobs" 2>/dev/null | grep -q . ; then
            echo "   ✅ Responds to /api/jobs endpoint - Likely backend!"
            echo ""
            echo "   👉 Update .env:"
            echo "      API_BASE_URL=http://localhost:$port"
            found=true
        else
            echo "   ⚠️  Service found but /jobs endpoint not available"
        fi
        echo ""
    fi
done

if [ "$found" = false ]; then
    echo "❌ No backend service found on common ports:"
    echo "   Checked: ${ports[@]}"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Check what port your backend is configured to run on"
    echo "   2. Make sure backend is running: npm run dev (in backend repo)"
    echo "   3. Run this script again"
    echo ""
    echo "   Or manually test:"
    echo "   curl http://localhost:YOUR_PORT/jobs"
fi
