#!/bin/bash

# Sync Script für Production Deployment
# Kopiert alle notwendigen Dateien auf die Produktionsmaschine

set -e

# Konfiguration
PROD_HOST="${PROD_HOST:-production-server}"
PROD_USER="${PROD_USER:-deploy}"
PROD_PATH="${PROD_PATH:-/opt/hovawart}"
RSYNC_OPTS="-avz --delete --exclude='.git' --exclude='node_modules' --exclude='dist'"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Hovawart Database - Production Sync"
echo "======================================="
echo ""

# Prüfe ob Remote-Host erreichbar ist
echo "🔍 Checking connection to $PROD_HOST..."
if ! ssh -o ConnectTimeout=5 "$PROD_USER@$PROD_HOST" exit 2>/dev/null; then
  echo -e "${RED}❌ Cannot connect to $PROD_HOST${NC}"
  echo "   Please check:"
  echo "   1. Server is reachable"
  echo "   2. SSH key is configured"
  echo "   3. PROD_HOST, PROD_USER are set correctly"
  exit 1
fi
echo -e "${GREEN}✅ Connection established${NC}"
echo ""

# Prüfe ob Docker auf Remote-Server installiert ist
echo "🐳 Checking Docker installation..."
if ! ssh "$PROD_USER@$PROD_HOST" "command -v docker &> /dev/null"; then
  echo -e "${RED}❌ Docker is not installed on $PROD_HOST${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Docker is installed${NC}"
echo ""

# Prüfe ob Docker Compose Plugin auf Remote-Server installiert ist
echo "🐳 Checking Docker Compose plugin..."
if ! ssh "$PROD_USER@$PROD_HOST" "docker compose version &> /dev/null"; then
  echo -e "${RED}❌ Docker Compose plugin is not installed on $PROD_HOST${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Docker Compose plugin is installed${NC}"
echo ""

# Erstelle Remote-Verzeichnis falls nicht vorhanden
echo "📁 Creating remote directory..."
ssh "$PROD_USER@$PROD_HOST" "mkdir -p $PROD_PATH/{config,logs,backups,scripts}"
echo -e "${GREEN}✅ Directory structure created${NC}"
echo ""

# Sync Docker Compose und Konfiguration
echo "📦 Syncing Docker Compose and configuration files..."
rsync $RSYNC_OPTS \
  --include='docker-compose.prod.yml' \
  --include='docker-compose.traefik.yml' \
  --include='Dockerfile' \
  --exclude='docker-compose.yml' \
  ./ "$PROD_USER@$PROD_HOST:$PROD_PATH/"
echo -e "${GREEN}✅ Configuration files synced${NC}"
echo ""

# Sync Scripts
echo "📜 Syncing scripts..."
rsync $RSYNC_OPTS \
  scripts/ "$PROD_USER@$PROD_HOST:$PROD_PATH/scripts/"
echo -e "${GREEN}✅ Scripts synced${NC}"
echo ""

# Sync Nginx Konfiguration falls vorhanden
if [ -d "nginx" ]; then
  echo "🌐 Syncing Nginx configuration..."
  rsync $RSYNC_OPTS \
    nginx/ "$PROD_USER@$PROD_HOST:$PROD_PATH/nginx/"
  echo -e "${GREEN}✅ Nginx configuration synced${NC}"
  echo ""
fi

# Kopiere .env.example falls vorhanden
if [ -f ".env.example" ]; then
  echo "⚙️  Checking environment configuration..."
  # Prüfe ob .env auf Remote existiert
  if ! ssh "$PROD_USER@$PROD_HOST" "test -f $PROD_PATH/.env"; then
    echo "📋 Copying .env.example to .env on remote server"
    scp .env.example "$PROD_USER@$PROD_HOST:$PROD_PATH/.env"
    echo -e "${YELLOW}⚠️  Please edit $PROD_PATH/.env on the remote server with production values${NC}"
  else
    echo -e "${GREEN}✅ .env file already exists on remote server${NC}"
  fi
  echo ""
fi

# Erstelle docker compose alias für Produktion
ssh "$PROD_USER@$PROD_HOST" << 'EOF'
cat > ~/.bash_aliases << 'ALIASES'
alias dcp='docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml'
alias dcp-up='docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml up -d'
alias dcp-down='docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml down'
alias dcp-logs='docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml logs -f'
alias dcp-restart='docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml restart'
ALIASES
EOF

echo "✅ Created helper aliases on remote server:"
echo "   - dcp: docker compose wrapper"
echo "   - dcp-up: Start services"
echo "   - dcp-down: Stop services"
echo "   - dcp-logs: View logs"
echo "   - dcp-restart: Restart services"
echo ""

# Zusammenfassung
echo "========================================="
echo -e "${GREEN}✅ Sync completed successfully!${NC}"
echo ""
echo "📋 Next steps on production server:"
echo ""
echo "   1. SSH to production server:"
echo "      ssh $PROD_USER@$PROD_HOST"
echo ""
echo "   2. Navigate to project directory:"
echo "      cd $PROD_PATH"
echo ""
echo "   3. Configure environment (if not done):"
echo "      nano .env"
echo ""
echo "   4. Pull Docker images:"
echo "      docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml pull"
echo ""
echo "   5. Start services:"
echo "      docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml up -d"
echo ""
echo "   6. View logs:"
echo "      docker compose -f docker-compose.prod.yml -f docker-compose.traefik.yml logs -f"
echo ""
