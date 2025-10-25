#!/bin/bash

# Remote Deployment Script für Production
# Synchronisiert Dateien und deployt auf dem Remote-Server

set -e

# Konfiguration
PROD_HOST="${PROD_HOST:-production-server}"
PROD_USER="${PROD_USER:-deploy}"
PROD_PATH="${PROD_PATH:-/opt/hovawart}"

echo "🚀 Hovawart Database - Remote Deployment"
echo "========================================"
echo ""
echo "📡 Remote Server: $PROD_USER@$PROD_HOST"
echo "📁 Remote Path: $PROD_PATH"
echo ""

# Prüfe ob sync-to-prod.sh ausführbar ist
if [ ! -x "scripts/sync-to-prod.sh" ]; then
  chmod +x scripts/sync-to-prod.sh
fi

# Schritt 1: Dateien synchronisieren
echo "📦 Step 1: Syncing files..."
./scripts/sync-to-prod.sh
echo ""

# Schritt 2: Docker Images auf Remote-Server pullen
echo "⬇️  Step 2: Pulling Docker images on remote server..."
ssh "$PROD_USER@$PROD_HOST" "cd $PROD_PATH && docker-compose -f docker-compose.prod.yml pull"
echo ""

# Schritt 3: Services starten
echo "🚀 Step 3: Starting services..."
ssh "$PROD_USER@$PROD_HOST" "cd $PROD_PATH && docker-compose -f docker-compose.prod.yml up -d"
echo ""

# Schritt 4: Warte auf gesunde Services
echo "⏳ Step 4: Waiting for services to be healthy..."
sleep 10

# Prüfe Health Status
echo "🏥 Checking service health..."
ssh "$PROD_USER@$PROD_HOST" "cd $PROD_PATH && docker-compose -f docker-compose.prod.yml ps"
echo ""

echo "========================================="
echo -e "\033[0;32m✅ Deployment completed successfully!\033[0m"
echo ""
echo "📊 Services Status:"
ssh "$PROD_USER@$PROD_HOST" "cd $PROD_PATH && docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "📋 Useful commands:"
echo "   View logs: ssh $PROD_USER@$PROD_HOST 'cd $PROD_PATH && docker-compose -f docker-compose.prod.yml logs -f'"
echo "   Restart:   ssh $PROD_USER@$PROD_HOST 'cd $PROD_PATH && docker-compose -f docker-compose.prod.yml restart'"
echo "   Stop:      ssh $PROD_USER@$PROD_HOST 'cd $PROD_PATH && docker-compose -f docker-compose.prod.yml down'"
echo ""


