# KaloriKu Docker Setup

## 🚀 Quick Start

### Development Environment
```bash
# Start development environment
./start-dev.sh

# Or manually:
docker-compose --profile dev --profile tools up -d
```

### Production Environment
```bash
# Start production environment
./start-prod.sh

# Or manually:
docker-compose --profile production up --build -d
```

## 📋 Available Services

### Core Services
- **app**: Main Laravel application (Production)
- **app-dev**: Laravel application (Development with hot reload)
- **mysql**: MySQL 8.0 database
- **redis**: Redis cache and session store

### Development Tools (Profile: tools)
- **phpmyadmin**: Database management interface
- **redis-commander**: Redis management interface
- **mailhog**: Email testing tool

### Production Services (Profile: production)
- **nginx**: Load balancer and reverse proxy
- **queue**: Background job processor
- **scheduler**: Task scheduler

## 🌐 Access URLs

### Development Mode
- App: http://localhost:8001
- Vite HMR: http://localhost:5173
- phpMyAdmin: http://localhost:8080
- Redis Commander: http://localhost:8081
- Mailhog: http://localhost:8025

### Production Mode
- App: http://localhost:8000
- App (via Nginx): http://localhost

## 📝 Common Commands

### Development
```bash
# Start dev environment
docker-compose --profile dev up -d

# View logs
docker-compose logs -f app-dev

# Execute artisan commands
docker-compose exec app-dev php artisan migrate
docker-compose exec app-dev php artisan tinker

# Install packages
docker-compose exec app-dev composer install
docker-compose exec app-dev npm install

# Build assets
docker-compose exec app-dev npm run build
```

### Production
```bash
# Build and start
docker-compose --profile production up --build -d

# View logs
docker-compose logs -f app

# Scale services
docker-compose --profile production up --scale app=3 -d

# Update deployment
git pull
docker-compose --profile production up --build -d
```

### Database Operations
```bash
# Run migrations
docker-compose exec app php artisan migrate

# Seed database
docker-compose exec app php artisan db:seed

# Fresh migration with seed
docker-compose exec app php artisan migrate:fresh --seed

# Database backup
docker-compose exec mysql mysqldump -u kaloriku -psecret123 kaloriku > backup.sql
```

### Maintenance
```bash
# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# View service status
docker-compose ps

# Follow logs
docker-compose logs -f

# Shell into container
docker-compose exec app bash
```

## 🔧 Configuration

### Environment Files
- `.env.dev`: Development environment variables
- `.env.docker`: Production environment variables

### Docker Configuration
- `docker/nginx/`: Nginx configuration files
- `docker/supervisor/`: Supervisor configuration
- `docker/mysql/init/`: Database initialization scripts

## 🛠️ Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 [PID]
```

**Permission issues:**
```bash
# Fix storage permissions
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

**Database connection issues:**
```bash
# Restart database
docker-compose restart mysql
# Check database logs
docker-compose logs mysql
```

**Build failures:**
```bash
# Clean build
docker-compose build --no-cache
# Remove all containers and images
docker system prune -a
```

### Reset Everything
```bash
# Complete reset
docker-compose down -v
docker system prune -a
./start-dev.sh
```

## 📊 Performance Monitoring

```bash
# Container resource usage
docker stats

# Service health
docker-compose ps

# Disk usage
docker system df
```
