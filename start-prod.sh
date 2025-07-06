#!/bin/bash

# KaloriKu Production Environment Setup Script

set -e  # Exit on any error

echo "🚀 Starting KaloriKu Production Environment..."

# Check if .env.docker exists
if [ ! -f .env.docker ]; then
    echo "❌ .env.docker file not found!"
    echo "Creating .env.docker from .env.example..."
    cp .env.example .env.docker
fi

# Copy production environment file
cp .env.docker .env

# Clean up previous containers
echo "🧹 Cleaning up previous containers..."
docker compose --profile production down -v 2>/dev/null || true

# Build and start production services
echo "🔨 Building and starting production services..."
docker compose --profile production up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
if ! docker compose ps app | grep -q "Up"; then
    echo "❌ App service failed to start!"
    echo "📋 Showing app logs:"
    docker compose logs app
    exit 1
fi

# Wait for database to be ready
echo "📊 Waiting for database to be ready..."
until docker compose exec mysql mysqladmin ping -h"localhost" --silent; do
    echo "🔄 Database is unavailable - sleeping"
    sleep 5
done
echo "✅ Database is ready!"

# Run migrations and seeders
echo "📊 Running database migrations..."
docker compose exec app php artisan migrate --force

echo "🌱 Seeding database..."
docker compose exec app php artisan db:seed --force

echo "⚡ Optimizing application for production..."
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

echo "✅ Production environment is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   - App: http://localhost:8000"
echo "   - App (Nginx): http://localhost"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker compose logs -f app"
echo "   - Stop: docker compose --profile production down"
echo "   - Update: git pull && docker compose --profile production up --build -d"
