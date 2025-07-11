#!/bin/bash

# KaloriKu Production Environment Setup Script

set -e  # Exit on any error

# Parse command line arguments
ENABLE_MONITORING=false
ENABLE_TOOLS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --monitoring)
            ENABLE_MONITORING=true
            shift
            ;;
        --tools)
            ENABLE_TOOLS=true
            shift
            ;;
        --all)
            ENABLE_MONITORING=true
            ENABLE_TOOLS=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --monitoring    Enable Telescope monitoring"
            echo "  --tools         Enable development tools (phpMyAdmin, Redis Commander)"
            echo "  --all          Enable both monitoring and tools"
            echo "  -h, --help     Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Production only"
            echo "  $0 --monitoring       # Production + Telescope"
            echo "  $0 --tools           # Production + Tools"
            echo "  $0 --all             # Production + Monitoring + Tools"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

echo "🚀 Starting KaloriKu Production Environment..."
if [ "$ENABLE_MONITORING" = true ]; then
    echo "🔭 Telescope monitoring: ENABLED"
fi
if [ "$ENABLE_TOOLS" = true ]; then
    echo "🛠️  Development tools: ENABLED"
fi

# Check if .env.docker exists
if [ ! -f .env.docker ]; then
    echo "❌ .env.docker file not found!"
    echo "Creating .env.docker from .env.example..."
    cp .env.example .env.docker
fi

# Ensure APP_KEY is set in .env.docker
if ! grep -q "^APP_KEY=base64:" .env.docker; then
    echo "🔑 Generating APP_KEY for .env.docker..."
    APP_KEY="base64:$(openssl rand -base64 32)"
    # Use sed compatible with both macOS and Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/^APP_KEY=.*/APP_KEY=${APP_KEY}/" .env.docker
    else
        sed -i "s/^APP_KEY=.*/APP_KEY=${APP_KEY}/" .env.docker
    fi
fi

# Copy production environment file
cp .env.docker .env

# Clean up previous containers
echo "🧹 Cleaning up previous containers..."
docker compose --profile production down -v 2>/dev/null || true

# Build production assets locally first
echo "🎨 Building production assets..."
npm install
npm run build

# Build and start production services
echo "🔨 Building and starting production services..."

# Determine which profiles to start
PROFILES="production"
if [ "$ENABLE_MONITORING" = true ]; then
    PROFILES="$PROFILES,monitoring"
fi
if [ "$ENABLE_TOOLS" = true ]; then
    PROFILES="$PROFILES,tools"
fi

echo "📋 Starting profiles: $PROFILES"
docker compose --profile production $(if [ "$ENABLE_MONITORING" = true ]; then echo "--profile monitoring"; fi) $(if [ "$ENABLE_TOOLS" = true ]; then echo "--profile tools"; fi) up --build -d

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

# Ensure APP_KEY is set inside the container
echo "🔑 Ensuring APP_KEY is set inside container..."
docker compose exec app bash -c '
# Check if .env exists, if not copy from .env.docker
if [ ! -f /var/www/.env ]; then
    cp /var/www/.env.docker /var/www/.env
fi

# Generate APP_KEY if not present
if [ -z "$(grep "^APP_KEY=base64:" /var/www/.env)" ]; then
    echo "Generating APP_KEY inside container..."
    php artisan key:generate --force
fi

# Ensure Redis password is set
if ! grep -q "^REDIS_PASSWORD=" /var/www/.env; then
    echo "REDIS_PASSWORD=redis123" >> /var/www/.env
fi
'

# Run migrations and seeders
echo "📊 Running database migrations..."
docker compose exec app php artisan migrate --force

echo "🌱 Seeding database..."
docker compose exec app php artisan db:seed --force

# Configure Telescope if monitoring is enabled
if [ "$ENABLE_MONITORING" = true ]; then
    echo "🔭 Setting up Telescope monitoring..."
    docker compose exec telescope php artisan telescope:clear 2>/dev/null || true
    echo "✅ Telescope is ready!"
fi

echo "⚡ Optimizing application for production..."

# Clear cache individually with better error handling
echo "🧹 Clearing caches..."
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Clear Redis cache with authentication
echo "🔄 Clearing Redis cache..."
if docker compose exec app php artisan cache:clear 2>/dev/null; then
    echo "✅ Cache cleared successfully"
else
    echo "⚠️  Cache clear failed - continuing without Redis cache"
fi

# Cache optimizations
echo "📦 Caching optimizations..."
docker compose exec app php artisan config:cache

# Try to cache routes, skip if error
if docker compose exec app php artisan route:cache 2>/dev/null; then
    echo "✅ Routes cached successfully"
else
    echo "⚠️  Route caching failed - running without route cache"
    docker compose exec app php artisan route:clear
fi

docker compose exec app php artisan view:cache

echo "✅ Production environment is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   - App: http://localhost:8000"
echo "   - App (Nginx): http://localhost"

if [ "$ENABLE_MONITORING" = true ]; then
    echo "   - 🔭 Telescope: http://localhost:8082/telescope"
fi

if [ "$ENABLE_TOOLS" = true ]; then
    echo "   - 🗄️ phpMyAdmin: http://localhost:8080"
    echo "   - 🎯 Redis Commander: http://localhost:8081"
fi

echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker compose logs -f app"
echo "   - Stop: docker compose --profile production down"
if [ "$ENABLE_MONITORING" = true ]; then
    echo "   - Stop monitoring: docker compose --profile monitoring down"
    echo "   - Telescope logs: docker compose logs -f telescope"
fi
echo "   - Update: git pull && ./start-prod.sh $(if [ "$ENABLE_MONITORING" = true ]; then echo "--monitoring"; fi) $(if [ "$ENABLE_TOOLS" = true ]; then echo "--tools"; fi)"
