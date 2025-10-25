# Deployment Guide - Docker Hub

Diese Anleitung erklärt, wie die Hovawart-Züchterdatenbank mit Docker Hub Images deployed wird.

> 💡 **Für Remote-Deployment auf einen anderen Server:** Siehe [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)

## Übersicht

Die Production-Umgebung nutzt Images von Docker Hub statt lokaler Builds. Dies bietet:
- ✅ Schnellere Deployments
- ✅ Zentrale Image-Verwaltung
- ✅ Versionierung
- ✅ Wiederverwendbarkeit

## Voraussetzungen

1. Docker Hub Account
2. Docker installiert
3. Bei Docker Hub eingeloggt (`docker login`)

## Setup

### 1. Docker Hub Username festlegen

Erstelle eine `.env` Datei oder exportiere die Umgebungsvariable:

```bash
export DOCKERHUB_USER="dein-dockerhub-username"
```

### 2. Images bauen und pushen

```bash
# Automatisch mit Skript
./scripts/deploy-prod.sh

# Oder manuell
DOCKERHUB_USER="dein-dockerhub-username" ./scripts/deploy-prod.sh v1.0.0
```

Das Skript:
- Baut die API und Web Images
- Taggt sie mit Version und `latest`
- Pusht sie zu Docker Hub

### 3. Production Deployment

```bash
# 1. Images vom Docker Hub pullen
DOCKERHUB_USER="dein-dockerhub-username" docker-compose -f docker-compose.prod.yml pull

# 2. Services starten
DOCKERHUB_USER="dein-dockerhub-username" docker-compose -f docker-compose.prod.yml up -d

# 3. Logs überprüfen
docker-compose -f docker-compose.prod.yml logs -f
```

## Images

Die folgenden Images werden erstellt:

- `{DOCKERHUB_USER}/hovawart-api:latest` - Backend API
- `{DOCKERHUB_USER}/hovawart-web:latest` - Frontend Web App

## Versionierung

Images können mit Tags versioniert werden:

```bash
# Spezifische Version pushen
./scripts/deploy-prod.sh v1.0.0

# In docker-compose.prod.yml verwenden:
image: dein-dockerhub-username/hovawart-api:v1.0.0
```

## Update Workflow

### Neues Update deployen

```bash
# 1. Änderungen committen
git add .
git commit -m "feat: neue Features"

# 2. Neue Version taggen
git tag v1.0.1

# 3. Images bauen und pushen
./scripts/deploy-prod.sh v1.0.1

# 4. In Production aktualisieren
DOCKERHUB_USER="dein-dockerhub-username" docker-compose -f docker-compose.prod.yml pull
DOCKERHUB_USER="dein-dockerhub-username" docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Images werden nicht gefunden

```bash
# Prüfe ob Docker Hub erreichbar ist
docker pull hello-world

# Prüfe Login
docker info | grep Username

# Neu einloggen
docker logout
docker login
```

### Alte Images löschen

```bash
# Lokale Images löschen
docker rmi dein-dockerhub-username/hovawart-api:latest
docker rmi dein-dockerhub-username/hovawart-web:latest

# Neu pullen
docker-compose -f docker-compose.prod.yml pull --no-cache
```

## CI/CD Integration

Das Deployment kann in CI/CD Pipelines integriert werden:

```yaml
# Beispiel GitHub Actions
- name: Build and Push Images
  run: |
    docker login -u ${{ secrets.DOCKERHUB_USERNAME }} -p ${{ secrets.DOCKERHUB_TOKEN }}
    DOCKERHUB_USER=${{ secrets.DOCKERHUB_USERNAME }} ./scripts/deploy-prod.sh
```

## Sicherheit

- ✅ Nutze Docker Hub Secrets/Tokens statt Passwörtern
- ✅ Setze `pull_policy: always` für automatische Updates
- ✅ Nutze spezifische Versionen statt `latest` in Production
- ✅ Scanne Images regelmäßig auf Sicherheitslücken
