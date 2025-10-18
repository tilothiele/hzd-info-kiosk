# Docker Setup Guide

## Übersicht

Die Hovawart-Züchterdatenbank ist vollständig containerisiert und kann sowohl für Entwicklung als auch Produktion verwendet werden.

## Schnellstart

### 1. Development Environment

```bash
# Setup (einmalig)
make setup

# Starte Development Environment
make dev

# Zeige Logs
make dev-logs

# Stoppe Environment
make dev-stop
```

### 2. Production Environment

```bash
# Setup (einmalig)
make setup-prod

# Starte Production Environment
make prod

# Zeige Logs
make prod-logs

# Stoppe Environment
make prod-stop
```

## Docker Services

### Development (docker-compose.yml)

| Service | Port | Beschreibung |
|---------|------|--------------|
| `postgres` | 5432 | PostgreSQL Datenbank |
| `redis` | 6379 | Redis Cache |
| `dev` | 3000, 3001 | Development Server (Web + API) |

### Production (docker-compose.prod.yml)

| Service | Port | Beschreibung |
|---------|------|--------------|
| `postgres` | 5432 | PostgreSQL Datenbank |
| `redis` | 6379 | Redis Cache |
| `api` | 3001 | API Service |
| `web` | 3000 | Web Frontend |
| `nginx` | 80, 443 | Reverse Proxy |
| `backup` | - | Database Backup Service |

## Multi-Stage Dockerfile

Das Dockerfile verwendet Multi-Stage Builds für optimale Performance:

### Stages

1. **base** - Node.js Base Image
2. **deps** - Dependencies Installation
3. **builder** - Build Stage
4. **database** - Database Setup
5. **api** - API Production Image
6. **web** - Web Production Image
7. **development** - Development Image
8. **migrate** - Migration Image

### Build Targets

```bash
# Development
docker build --target development -t hovawart-dev .

# API Production
docker build --target api -t hovawart-api .

# Web Production
docker build --target web -t hovawart-web .

# Database Migration
docker build --target migrate -t hovawart-migrate .
```

## Environment Configuration

### 1. Environment File erstellen

```bash
# Kopiere Template
cp env.template .env

# Bearbeite Konfiguration
nano .env
```

### 2. Wichtige Variablen

```env
# Database
DATABASE_URL="postgresql://postgres:password@postgres:5432/hovawart_db?schema=public"
POSTGRES_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Management

### Migrationen

```bash
# Development
make migrate

# Production
make migrate-prod

# Manuell
docker-compose exec api npx prisma migrate deploy
```

### Backups

```bash
# Backup erstellen
make backup

# Backup wiederherstellen
make restore
```

### Database Shell

```bash
# PostgreSQL Shell
make shell-db

# Oder direkt
docker-compose exec postgres psql -U postgres -d hovawart_db
```

## Monitoring & Logs

### Health Checks

```bash
# Alle Services prüfen
make health

# Einzelne Services
curl http://localhost:3000/api/health  # Web
curl http://localhost:3001/health      # API
```

### Logs anzeigen

```bash
# Alle Logs
make logs

# Spezifische Services
make logs-api
make logs-web
make logs-db
```

## Nginx Configuration

### Features

- **SSL/TLS Termination** - HTTPS mit Let's Encrypt
- **Reverse Proxy** - Load Balancing zwischen Services
- **Rate Limiting** - Schutz vor DDoS
- **Gzip Compression** - Optimierte Performance
- **Security Headers** - XSS, CSRF Schutz
- **Static File Caching** - Optimierte Asset-Delivery

### SSL Setup

```bash
# SSL Zertifikate erstellen
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

## Backup & Restore

### Automatische Backups

```bash
# Backup Service starten
docker-compose -f docker-compose.prod.yml --profile backup up -d backup

# Cron Job für tägliche Backups
0 2 * * * cd /path/to/project && make backup
```

### Backup wiederherstellen

```bash
# Backup auflisten
ls -la backups/

# Backup wiederherstellen
make restore
# Eingabe: backups/hovawart_db_backup_20240101_020000.sql.gz
```

## Troubleshooting

### Häufige Probleme

#### 1. Port bereits belegt

```bash
# Ports prüfen
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Andere Services stoppen
sudo systemctl stop nginx
sudo systemctl stop apache2
```

#### 2. Database Connection Error

```bash
# Database Status prüfen
make health

# Database Logs
make logs-db

# Database neu starten
docker-compose restart postgres
```

#### 3. Permission Errors

```bash
# Docker Permissions
sudo usermod -aG docker $USER
newgrp docker

# File Permissions
chmod +x scripts/*.sh
```

#### 4. Out of Memory

```bash
# Docker Memory Limits erhöhen
# In docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 1G
```

### Debug Commands

```bash
# Container Shell
make shell-api
make shell-web

# Container Logs
docker-compose logs -f [service]

# Container Status
docker-compose ps

# Resource Usage
docker stats
```

## Performance Optimization

### 1. Build Optimization

```bash
# Multi-stage Build Cache
docker build --target deps -t hovawart-deps .
docker build --target builder -t hovawart-builder .
```

### 2. Runtime Optimization

```bash
# Memory Limits
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

### 3. Database Optimization

```sql
-- PostgreSQL Tuning
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
```

## Security

### 1. Secrets Management

```bash
# Docker Secrets
echo "your-secret" | docker secret create jwt_secret -
echo "your-password" | docker secret create db_password -
```

### 2. Network Security

```yaml
# Isolierte Networks
networks:
  hovawart-network:
    driver: bridge
    internal: true  # Kein Internet-Zugang
```

### 3. Container Security

```bash
# Non-root User
USER node

# Read-only Filesystem
--read-only
--tmpfs /tmp
```

## Deployment

### 1. Production Deployment

```bash
# Environment Setup
cp env.template .env
# .env bearbeiten

# Build & Deploy
make build-prod
make prod

# Health Check
make health
```

### 2. CI/CD Integration

```yaml
# GitHub Actions Beispiel
- name: Build and Deploy
  run: |
    make build-prod
    make migrate-prod
    make prod
```

### 3. Rolling Updates

```bash
# Zero-Downtime Deployment
docker-compose -f docker-compose.prod.yml up -d --no-deps api
docker-compose -f docker-compose.prod.yml up -d --no-deps web
```

## Wartung

### 1. Regelmäßige Wartung

```bash
# Wöchentlich
make clean
docker system prune -f

# Monatlich
make backup
docker image prune -a
```

### 2. Updates

```bash
# Base Images aktualisieren
docker pull node:18-alpine
docker pull postgres:15-alpine
docker pull redis:7-alpine

# Rebuild
make build-prod
```

### 3. Monitoring

```bash
# Resource Monitoring
docker stats --no-stream

# Log Monitoring
make logs | grep ERROR
make logs | grep WARN
```