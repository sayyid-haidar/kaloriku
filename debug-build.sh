#!/bin/bash

# Debug script untuk troubleshoot Docker build

echo "🔍 Debug Docker Build Process..."

# Check Docker status
echo "📊 Checking Docker status..."
docker --version
docker compose version

# Clean everything first
echo "🧹 Cleaning previous builds..."
docker compose --profile production down -v 2>/dev/null || true
docker system prune -f

# Test npm locally first
echo "🧪 Testing npm build locally..."
if [ -f package.json ]; then
    echo "✅ package.json found"
    if [ -d node_modules ]; then
        echo "✅ node_modules found"
    else
        echo "❌ node_modules not found, running npm install..."
        npm install
    fi

    echo "🔨 Testing npm run build locally..."
    npm run build

    if [ $? -eq 0 ]; then
        echo "✅ Local npm build successful!"
    else
        echo "❌ Local npm build failed!"
        exit 1
    fi
else
    echo "❌ package.json not found!"
    exit 1
fi

echo "🐳 Testing Docker build..."
docker compose --profile production build app --progress=plain

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    echo "🚀 Starting production environment..."
    ./start-prod.sh
else
    echo "❌ Docker build failed!"
    echo "📋 Showing build logs..."
    docker compose logs
fi
