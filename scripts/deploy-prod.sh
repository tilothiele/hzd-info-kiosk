#!/bin/bash

# Production Deployment Script für Hovawart-Züchterdatenbank
# Baut und pusht Images zu Docker Hub

set -e

# Konfiguration
DOCKERHUB_USER="${DOCKERHUB_USER:-your-dockerhub-username}"
VERSION="${1:-latest}"
COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Hovawart Database - Production Deployment"
echo "============================================="
echo "📦 Docker Hub User: $DOCKERHUB_USER"
echo "🏷️  Version: $VERSION"
echo ""

# Prüfe ob Docker läuft
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running"
  exit 1
fi

# Prüfe ob eingeloggt bei Docker Hub
#if ! docker info | grep -q "Username:"; then
#  echo "⚠️  Not logged in to Docker Hub. Please run 'docker login' first."
#  echo "   Or set DOCKERHUB_USER environment variable."
#  exit 1
#fi

# Baue und tagge API Image
echo "📦 Building API image..."
docker build \
  -t $DOCKERHUB_USER/hovawart-api:$VERSION \
  -t $DOCKERHUB_USER/hovawart-api:latest \
  -f Dockerfile \
  --target api \
  .

# Baue und tagge Web Image
echo "📦 Building Web image..."
docker build \
  -t $DOCKERHUB_USER/hovawart-web:$VERSION \
  -t $DOCKERHUB_USER/hovawart-web:latest \
  -f Dockerfile \
  --target web \
  .

# Pushe API Image
echo "⬆️  Pushing API image..."
docker push $DOCKERHUB_USER/hovawart-api:$VERSION
docker push $DOCKERHUB_USER/hovawart-api:latest

# Pushe Web Image
echo "⬆️  Pushing Web image..."
docker push $DOCKERHUB_USER/hovawart-web:$VERSION
docker push $DOCKERHUB_USER/hovawart-web:latest

echo ""
echo "✅ Images pushed successfully to Docker Hub!"
echo ""
echo "📋 Next steps:"
echo "   1. Update docker-compose.prod.yml with your Docker Hub username"
echo "   2. Run: docker compose -f $COMPOSE_FILE pull"
echo "   3. Run: docker compose -f $COMPOSE_FILE up -d"
