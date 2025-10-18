#!/bin/bash

# Database Migration Script für Hovawart-Züchterdatenbank
# Wartet auf Datenbank-Verfügbarkeit und führt Migrationen aus

set -e

echo "🚀 Starting database migration..."

# Warte auf Datenbank-Verfügbarkeit
echo "⏳ Waiting for database to be ready..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Wechsle zum Database-Verzeichnis
cd /app/apps/database

# Führe Prisma Migrationen aus
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

# Generiere Prisma Client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Optional: Seed die Datenbank mit Testdaten
if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database with test data..."
  npx prisma db seed
fi

echo "✅ Database migration completed successfully!"
