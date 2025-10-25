# Production Deployment Guide

Diese Anleitung erklärt, wie die Hovawart-Züchterdatenbank auf einem Remote-Server deployed wird.

## Übersicht

Das Deployment erfolgt über zwei Scripts:
1. **sync-to-prod.sh** - Synchronisiert Dateien auf den Remote-Server
2. **remote-deploy.sh** - Komplettes Deployment mit Synchronisation und Start

## Voraussetzungen

### Auf dem Development-Rechner
- ✅ SSH-Zugriff auf den Produktionsserver
- ✅ SSH-Key konfiguriert (passwordless login)
- ✅ rsync installiert

### Auf dem Produktionsserver
- ✅ Docker installiert
- ✅ Docker Compose installiert
- ✅ sudo-Rechte für den Deploy-User
- ✅ Ports 3000, 3001, 5432, 6379 freigegeben

## Schnellstart

### 1. SSH-Key Setup

```bash
# SSH-Key generieren falls noch nicht vorhanden
ssh-keygen -t ed25519 -C "deploy@production"

# Public Key auf Server kopieren
ssh-copy-id deploy@production-server
```

### 2. Umgebungsvariablen setzen

```bash
# Erstelle .env Datei oder exportiere Variablen
export PROD_HOST="192.168.1.100"        # IP oder Hostname
export PROD_USER="deploy"                # SSH User
export PROD_PATH="/opt/hovawart"         # Remote-Pfad
export DOCKERHUB_USER="dein-username"    # Docker Hub Username
```

### 3. Deployment ausführen

```bash
# Dateien syncen
./scripts/sync-to-prod.sh

# Oder komplettes Deployment (sync + start)
./scripts/remote-deploy.sh
```

## Detaillierte Schritte

### Option A: Nur Dateien synchronisieren

```bash
# 1. Konfiguration setzen
export PROD_HOST="production-server"
export PROD_USER="deploy"
export PROD_PATH="/opt/hovawart"

# 2. Sync ausführen
./scripts/sync-to-prod.sh
```

Das Script:
- ✅ Prüft SSH-Verbindung
- ✅ Prüft Docker-Installation
- ✅ Erstellt Verzeichnisstruktur
- ✅ Synchronisiert Docker Compose Files
- ✅ Synchronisiert Scripts
- ✅ Synchronisiert Nginx-Config
- ✅ Kopiert `.env.example` falls vorhanden
- ✅ Erstellt Helper-Aliases

### Option B: Komplettes Deployment

```bash
# Deployment in einem Durchgang
./scripts/remote-deploy.sh
```

Das Script führt automatisch aus:
1. Dateien synchronisieren
2. Docker Images pullen
3. Services starten
4. Health-Check ausführen

### 3. Environment konfigurieren

```bash
# Verbinde zum Server
ssh deploy@production-server

# Navigiere zum Projekt
cd /opt/hovawart

# Bearbeite .env
nano .env

# Wichtige Werte anpassen:
# - DATABASE_URL
# - JWT_SECRET
# - POSTGRES_PASSWORD
# - NEXT_PUBLIC_API_URL
```

### 4. Manuelle Services starten

```bash
# Auf dem Produktionsserver
cd /opt/hovawart

# Docker Images pullen
docker-compose -f docker-compose.prod.yml pull

# Services starten
docker-compose -f docker-compose.prod.yml up -d

# Logs ansehen
docker-compose -f docker-compose.prod.yml logs -f
```

## Helper-Aliases

Nach dem Sync sind folgende Aliases verfügbar:

```bash
dcp          # docker-compose wrapper
dcp-up       # Services starten
dcp-down     # Services stoppen
dcp-logs     # Logs anzeigen
dcp-restart  # Services neustarten
```

## Updates

### Neues Update deployen

```bash
# 1. Änderungen lokal committen und pushen
git add .
git commit -m "feat: neue Features"
git push

# 2. Docker Images bauen und pushen
./scripts/deploy-prod.sh

# 3. Auf Production Server syncen
./scripts/remote-deploy.sh

# Oder manuell
./scripts/sync-to-prod.sh
ssh deploy@production-server 'cd /opt/hovawart && dcp pull && dcp restart'
```

### Hotfix deployen

```bash
# 1. Code ändern und committen
# 2. Docker Images pushen
./scripts/deploy-prod.sh hotfix-1

# 3. Nur API/Web Images neu starten
ssh deploy@production-server 'cd /opt/hovawart && dcp restart api web'
```

## Monitoring

### Logs ansehen

```bash
# Alle Services
ssh deploy@production-server 'cd /opt/hovawart && dcp logs -f'

# Nur API
ssh deploy@production-server 'cd /opt/hovawart && dcp logs -f api'

# Nur Web
ssh deploy@production-server 'cd /opt/hovawart && dcp logs -f web'
```

### Service Status

```bash
ssh deploy@production-server 'cd /opt/hovawart && dcp ps'
```

### Container Logs

```bash
ssh deploy@production-server 'docker logs hovawart-api-prod -f'
ssh deploy@production-server 'docker logs hovawart-web-prod -f'
```

## Troubleshooting

### Connection Failed

```bash
# Test SSH Verbindung
ssh -v deploy@production-server

# Check SSH Keys
ssh-add -l

# Neu verbinden
ssh-copy-id deploy@production-server
```

### Docker nicht installiert

```bash
# Auf dem Server
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### Permission Denied

```bash
# Auf dem Server: Rechte setzen
sudo chown -R deploy:deploy /opt/hovawart
sudo chmod -R 755 /opt/hovawart
```

### Images nicht gefunden

```bash
# DOCKERHUB_USER setzen
export DOCKERHUB_USER="dein-username"

# Images neu pullen
ssh deploy@production-server 'cd /opt/hovawart && docker-compose -f docker-compose.prod.yml pull --no-cache'
```

## Backup & Restore

### Backup erstellen

```bash
# Automatisch (via Cron)
ssh deploy@production-server 'cd /opt/hovawart && ./scripts/backup.sh'

# Manuell
ssh deploy@production-server 'docker exec hovawart-postgres-prod pg_dump -U postgres hovawart_db > backup.sql'
```

### Restore

```bash
# Backup auf Server kopieren
scp backup.sql deploy@production-server:/opt/hovawart/

# Restore ausführen
ssh deploy@production-server 'docker exec -i hovawart-postgres-prod psql -U postgres hovawart_db < /opt/hovawart/backup.sql'
```

## Sicherheit

### Best Practices

- ✅ Nutze starke Passwörter
- ✅ Ändere Default-Credentials
- ✅ Nutze HTTPS in Production
- ✅ Setze Firewall-Regeln
- ✅ Regelmäßige Backups
- ✅ Monitoring einrichten
- ✅ Security-Updates einspielen

### Firewall

```bash
# UFW aktivieren
sudo ufw enable

# Ports öffnen
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Web
sudo ufw allow 3001/tcp  # API

# Status anzeigen
sudo ufw status
```

## Rollback

### Vorherige Version deployen

```bash
# Bestimmte Version pullen
ssh deploy@production-server 'cd /opt/hovawart && DOCKERHUB_USER=username docker-compose -f docker-compose.prod.yml pull'

# In docker-compose.prod.yml Version anpassen
image: username/hovawart-api:v1.0.0

# Neu starten
ssh deploy@production-server 'cd /opt/hovawart && dcp restart'
```

## Support

Bei Problemen:
1. Logs überprüfen: `dcp logs -f`
2. Service Status: `dcp ps`
3. Docker System Info: `docker system df`
4. Container prüfen: `docker ps -a`


