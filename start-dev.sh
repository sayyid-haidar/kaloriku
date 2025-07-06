#!/bin/bash

# KaloriKu Development Environment Setup Script

echo "🚀 Starting KaloriKu Development Environment..."

# Copy development environment file
cp .env.dev .env

# Start development services
docker compose --profile dev --profile tools up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Run migrations and seeders
echo "📊 Running database migrations..."
docker compose exec app-dev php artisan migrate --force

echo "🌱 Seeding database..."
docker compose exec app-dev php artisan db:seed --force

echo "🔑 Generating app key..."
docker compose exec app-dev php artisan key:generate

echo "✅ Development environment is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   - App (Dev): http://localhost:8001"
echo "   - Vite HMR: http://localhost:5173"
echo "   - phpMyAdmin: http://localhost:8080"
echo "   - Redis Commander: http://localhost:8081"
echo "   - Mailhog: http://localhost:8025"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker compose logs -f app-dev"
echo "   - Stop: docker compose down"
echo "   - Rebuild: docker compose --profile dev up --build"
