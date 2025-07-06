#!/bin/bash

set -e

echo "🚀 Starting KaloriKu Container..."

# Set proper permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Start PHP-FPM in background
echo "� Starting PHP-FPM..."
php-fpm &

# Start Nginx in foreground
echo "🌐 Starting Nginx..."
nginx -g "daemon off;"
