#!/bin/bash

# Database Backup Script für Hovawart-Züchterdatenbank
# Erstellt tägliche Backups der PostgreSQL-Datenbank

set -e

# Konfiguration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="hovawart_db_backup_${DATE}.sql"
RETENTION_DAYS=30

echo "🗄️ Starting database backup..."

# Erstelle Backup-Verzeichnis falls es nicht existiert
mkdir -p $BACKUP_DIR

# Erstelle Datenbank-Backup
echo "📦 Creating backup: $BACKUP_FILE"
pg_dump \
  --host=$POSTGRES_HOST \
  --port=$POSTGRES_PORT \
  --username=$POSTGRES_USER \
  --dbname=$POSTGRES_DB \
  --verbose \
  --clean \
  --no-owner \
  --no-privileges \
  --format=plain \
  --file="$BACKUP_DIR/$BACKUP_FILE"

# Komprimiere Backup
echo "🗜️ Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Lösche alte Backups (älter als RETENTION_DAYS)
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "hovawart_db_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "✅ Backup completed successfully!"
echo "📁 Backup location: $BACKUP_DIR/$BACKUP_FILE.gz"

# Optional: Upload zu Cloud Storage
if [ "$UPLOAD_TO_S3" = "true" ]; then
  echo "☁️ Uploading to S3..."
  aws s3 cp "$BACKUP_DIR/$BACKUP_FILE.gz" "s3://$S3_BUCKET/backups/"
fi
