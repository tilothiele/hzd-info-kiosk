# Docker Setup für HZD Info Kiosk

## Übersicht

Dieses Projekt verwendet Docker für die lokale Entwicklung mit PostgreSQL als Datenbank.

## Services

### PostgreSQL Datenbank
- **Container**: `hzd-postgres`
- **Port**: 5432
- **Datenbank**: `hzd_info_kiosk`
- **Benutzer**: `postgres`
- **Passwort**: `hzd_password_2024`

### pgAdmin (Datenbankverwaltung)
- **Container**: `hzd-pgadmin`
- **Port**: 8081
- **URL**: http://localhost:8081
- **E-Mail**: `admin@hzd.local`
- **Passwort**: `admin123`

### Prisma Studio (Datenbankverwaltung)
- **Port**: 5555
- **URL**: http://localhost:5555

## Setup

### 1. Umgebungsvariablen einrichten

```bash
# Kopiere die Umgebungsvariablen-Vorlage
cp env.template .env

# Für das database-Verzeichnis
cd apps/database
cp ../../env.template .env
```

### 2. Docker Container starten

```bash
# Container starten
docker compose up -d

# Status überprüfen
docker compose ps
```

### 3. Datenbank-Migrationen ausführen

```bash
cd apps/database

# Migrationen anwenden
npx prisma migrate reset --force

# Prisma Client generieren
npx prisma generate
```

### 4. Datenbankverwaltung

#### pgAdmin
1. Öffne http://localhost:8081
2. Melde dich mit `admin@hzd.local` / `admin123` an
3. Füge einen neuen Server hinzu:
   - **Name**: HZD Database
   - **Host**: `hzd-postgres`
   - **Port**: `5432`
   - **Username**: `postgres`
   - **Password**: `hzd_password_2024`

#### Prisma Studio
```bash
cd apps/database
npx prisma studio
```
Öffne http://localhost:5555

## Nützliche Befehle

### Docker
```bash
# Container stoppen
docker compose down

# Container neu starten
docker compose restart

# Logs anzeigen
docker compose logs -f

# In Container einsteigen
docker exec -it hzd-postgres psql -U postgres -d hzd_info_kiosk
```

### Prisma
```bash
cd apps/database

# Schema validieren
npx prisma validate

# Migration erstellen
npx prisma migrate dev --name migration_name

# Datenbank zurücksetzen
npx prisma migrate reset --force

# Prisma Client generieren
npx prisma generate

# Datenbank pushen (ohne Migration)
npx prisma db push
```

## Umgebungsvariablen

Die wichtigsten Umgebungsvariablen in der `.env` Datei:

```env
# Datenbank
DATABASE_URL="postgresql://postgres:hzd_password_2024@localhost:5432/hzd_info_kiosk?schema=public"

# PostgreSQL Details
POSTGRES_DB=hzd_info_kiosk
POSTGRES_USER=postgres
POSTGRES_PASSWORD=hzd_password_2024
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Anwendung
NODE_ENV=development
PORT=3000
API_PORT=3001

# Sicherheit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Troubleshooting

### Port bereits belegt
Falls Port 5432 oder 8081 bereits belegt ist, ändere die Ports in der `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # PostgreSQL
  - "8082:80"    # pgAdmin
```

Vergiss nicht, die `DATABASE_URL` entsprechend anzupassen.

### Container startet nicht
```bash
# Logs überprüfen
docker compose logs postgres

# Container neu erstellen
docker compose down -v
docker compose up -d
```

### Datenbankverbindung fehlschlägt
1. Überprüfe, ob der Container läuft: `docker compose ps`
2. Teste die Verbindung: `docker exec -it hzd-postgres pg_isready -U postgres`
3. Überprüfe die Umgebungsvariablen in der `.env` Datei

