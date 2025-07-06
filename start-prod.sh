#!/bin/bash

# KaloriKu Production Environment Setup Script

echo "🚀 Starting KaloriKu Production Environment..."

# Copy production environment file
cp .env.docker .env

# Build and start production services
docker-compose --profile production up --build -d

echo "⏳ Waiting for services to start..."
sleep 15

# Run migrations and seeders
echo "📊 Running database migrations..."
docker-compose exec app php artisan migrate --force

echo "🌱 Seeding database..."
docker-compose exec app php artisan db:seed --force

echo "✅ Production environment is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   - App: http://localhost:8000"
echo "   - App (Nginx): http://localhost"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker-compose logs -f app"
echo "   - Stop: docker-compose --profile production down"
echo "   - Update: git pull && docker-compose --profile production up --build -d"
