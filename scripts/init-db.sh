#!/bin/bash

# PostgreSQL Database Initialization Script
# Erstellt Datenbank und Benutzer für Hovawart-Züchterdatenbank

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🗄️  PostgreSQL Database Initialization"
echo "========================================"
echo ""

# Default values - can be overridden via environment variables
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-hovawart_db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD}"
APP_USER="${APP_DB_USER:-hovawart_user}"
APP_PASSWORD="${APP_DB_PASSWORD:-$(openssl rand -base64 32)}"

# Check if we have credentials
if [ -z "$POSTGRES_PASSWORD" ] && [ "$DB_HOST" = "localhost" ]; then
    # Only need postgres user for localhost without password
    if [ "$(whoami)" != "postgres" ] && [ "$EUID" != 0 ]; then
        echo -e "${YELLOW}⚠️  Warning: Running as $(whoami)${NC}"
        echo "   For localhost, running as postgres user is recommended."
        echo "   Or set POSTGRES_PASSWORD environment variable for remote connection."
        read -p "Continue anyway? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            exit 0
        fi
    fi
fi

echo "📋 Configuration:"
echo "   Database Host: $DB_HOST"
echo "   Database Port: $DB_PORT"
echo "   Database Name: $DB_NAME"
echo "   PostgreSQL User: $DB_USER"
echo "   Application User: $APP_USER"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: PostgreSQL is not running on $DB_HOST:$DB_PORT${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running on $DB_HOST:$DB_PORT${NC}"

# Check if database already exists
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists${NC}"
    read -p "Do you want to drop and recreate it? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" || true
    else
        echo "Skipping database creation."
        exit 0
    fi
fi

# Create database
echo "📦 Creating database '$DB_NAME'..."
createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" || {
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
}
echo -e "${GREEN}✅ Database created${NC}"

# Check if application user exists
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$APP_USER'" | grep -q 1; then
    echo -e "${YELLOW}⚠️  User '$APP_USER' already exists${NC}"
    read -p "Do you want to drop and recreate the user? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "🗑️  Dropping existing user..."
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP OWNED BY $APP_USER;" || true
        dropuser -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$APP_USER" || true
    else
        echo "Skipping user creation."
    fi
fi

# Create application user if it doesn't exist
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$APP_USER'" | grep -q 1; then
    echo "👤 Creating application user '$APP_USER'..."

    # Create user with password
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" <<EOF
CREATE USER $APP_USER WITH PASSWORD '$APP_PASSWORD';
EOF

    # Grant all privileges on database
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" <<EOF
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $APP_USER;
ALTER DATABASE $DB_NAME OWNER TO $APP_USER;
EOF

    # Connect to the database and grant schema privileges
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOF
GRANT ALL ON SCHEMA public TO $APP_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $APP_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $APP_USER;
EOF

    echo -e "${GREEN}✅ Application user created${NC}"
    echo ""
    echo -e "${GREEN}📝 Application User Credentials:${NC}"
    echo "   Username: $APP_USER"
    echo "   Password: $APP_PASSWORD"
    echo ""
else
    echo -e "${YELLOW}⚠️  User exists, skipping creation${NC}"
fi

# Create extensions if needed
echo "🔧 Creating PostgreSQL extensions..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOF
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS if available (optional)
-- CREATE EXTENSION IF NOT EXISTS postgis;
EOF

# Create default schema (public schema already exists, but ensure it's ready)
echo "📋 Ensuring default schema is ready..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOF
-- Ensure public schema exists and is accessible
GRANT USAGE ON SCHEMA public TO $APP_USER;
GRANT CREATE ON SCHEMA public TO $APP_USER;
EOF

echo ""
echo "========================================="
echo -e "${GREEN}✅ Database initialization completed!${NC}"
echo ""
echo "📊 Summary:"
echo "   Database: $DB_NAME"
echo "   Application User: $APP_USER"
echo "   Application Password: $APP_PASSWORD"
echo ""
echo "🔗 Connection String (for .env):"
echo "   DATABASE_URL=postgresql://$APP_USER:$APP_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"
echo ""
echo "📋 Next steps:"
echo "   1. Run database migrations:"
echo "      cd apps/database && npx prisma migrate deploy"
echo ""
echo "   2. Seed initial data (optional):"
echo "      cd apps/database && npx prisma db seed"
echo ""

