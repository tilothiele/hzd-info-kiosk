# Hovawart-Züchterdatenbank Makefile
# Vereinfacht Docker-Operationen und Entwicklung

.PHONY: help build up down logs clean dev prod migrate backup restore

# Default target
help: ## Zeige verfügbare Befehle
	@echo "Hovawart-Züchterdatenbank - Verfügbare Befehle:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# DEVELOPMENT COMMANDS
# =============================================================================

dev: ## Starte Development Environment
	@echo "🚀 Starting development environment..."
	docker-compose --profile development up -d
	@echo "✅ Development environment started!"
	@echo "🌐 Web: http://localhost:3000"
	@echo "🔌 API: http://localhost:3001"

dev-logs: ## Zeige Development Logs
	docker-compose --profile development logs -f

dev-stop: ## Stoppe Development Environment
	@echo "🛑 Stopping development environment..."
	docker-compose --profile development down

# =============================================================================
# PRODUCTION COMMANDS
# =============================================================================

prod: ## Starte Production Environment
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Production environment started!"

prod-logs: ## Zeige Production Logs
	docker-compose -f docker-compose.prod.yml logs -f

prod-stop: ## Stoppe Production Environment
	@echo "🛑 Stopping production environment..."
	docker-compose -f docker-compose.prod.yml down

# =============================================================================
# BUILD COMMANDS
# =============================================================================

build: ## Baue alle Docker Images
	@echo "🔨 Building Docker images..."
	docker-compose build

build-prod: ## Baue Production Images
	@echo "🔨 Building production Docker images..."
	docker-compose -f docker-compose.prod.yml build

# =============================================================================
# DATABASE COMMANDS
# =============================================================================

migrate: ## Führe Database Migrationen aus
	@echo "🔄 Running database migrations..."
	docker-compose --profile migration up migrate

migrate-prod: ## Führe Production Migrationen aus
	@echo "🔄 Running production database migrations..."
	docker-compose -f docker-compose.prod.yml --profile migration up migrate

backup: ## Erstelle Database Backup
	@echo "🗄️ Creating database backup..."
	docker-compose -f docker-compose.prod.yml --profile backup up backup

restore: ## Stelle Database aus Backup wieder her
	@echo "🔄 Restoring database from backup..."
	@read -p "Enter backup file path: " backup_file; \
	docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d hovawart_db < $$backup_file

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

logs: ## Zeige alle Logs
	docker-compose logs -f

logs-api: ## Zeige API Logs
	docker-compose logs -f api

logs-web: ## Zeige Web Logs
	docker-compose logs -f web

logs-db: ## Zeige Database Logs
	docker-compose logs -f postgres

clean: ## Bereinige Docker Resources
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

clean-all: ## Bereinige alle Docker Resources (VORSICHT!)
	@echo "⚠️  Cleaning up ALL Docker resources..."
	docker-compose down -v --rmi all
	docker system prune -af
	docker volume prune -f

# =============================================================================
# HEALTH CHECKS
# =============================================================================

health: ## Prüfe Health Status aller Services
	@echo "🏥 Checking health status..."
	@echo "Web: $$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/health || echo 'DOWN')"
	@echo "API: $$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/health || echo 'DOWN')"
	@echo "Database: $$(docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1 && echo 'UP' || echo 'DOWN')"

# =============================================================================
# DEVELOPMENT HELPERS
# =============================================================================

shell-api: ## Öffne Shell im API Container
	docker-compose exec api sh

shell-web: ## Öffne Shell im Web Container
	docker-compose exec web sh

shell-db: ## Öffne Shell im Database Container
	docker-compose exec postgres psql -U postgres -d hovawart_db

# =============================================================================
# SETUP COMMANDS
# =============================================================================

setup: ## Initial Setup
	@echo "🔧 Setting up Hovawart-Züchterdatenbank..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file from template..."; \
		cp env.template .env; \
		echo "⚠️  Please edit .env file with your configuration!"; \
	fi
	@echo "🔨 Building images..."
	$(MAKE) build
	@echo "🔄 Running migrations..."
	$(MAKE) migrate
	@echo "✅ Setup completed!"

setup-prod: ## Production Setup
	@echo "🔧 Setting up production environment..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file from template..."; \
		cp env.template .env; \
		echo "⚠️  Please edit .env file with your production configuration!"; \
	fi
	@echo "🔨 Building production images..."
	$(MAKE) build-prod
	@echo "🔄 Running production migrations..."
	$(MAKE) migrate-prod
	@echo "✅ Production setup completed!"
