# Database Setup Guide

## Problem: DATABASE_URL fehlt

Das Prisma Schema benötigt eine `DATABASE_URL` Umgebungsvariable.

## Lösung 1: .env Datei erstellen

Erstellen Sie eine `.env` Datei im `apps/database/` Verzeichnis:

```bash
cd apps/database
touch .env
```

Fügen Sie folgenden Inhalt hinzu:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/hovawart_db?schema=public"
```

## Lösung 2: Lokale PostgreSQL Installation

### Mit Docker (Empfohlen):
```bash
docker run --name hovawart-postgres \
  -e POSTGRES_DB=hovawart_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

Dann in `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hovawart_db?schema=public"
```

### Mit lokaler PostgreSQL Installation:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS mit Homebrew
brew install postgresql
brew services start postgresql

# Erstelle Datenbank
createdb hovawart_db
```

## Lösung 3: Temporäre URL für Tests

Für Tests können Sie eine temporäre URL verwenden:

```bash
export DATABASE_URL="postgresql://test:test@localhost:5432/test"
npx prisma validate
```

## Nächste Schritte

1. Erstellen Sie die `.env` Datei
2. Führen Sie die Migration aus:
   ```bash
   cd apps/database
   npx prisma migrate dev --name init
   ```
3. Generieren Sie den Prisma Client:
   ```bash
   npx prisma generate
   ```

## Alternative: SQLite für Entwicklung

Falls Sie keine PostgreSQL installieren möchten, können Sie SQLite verwenden:

In `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Dann:
```bash
npx prisma migrate dev --name init
npx prisma generate
```
