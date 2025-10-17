# Quickstart Guide: Hovawart-Züchterdatenbank

**Date**: 2024-12-19  
**Feature**: Hovawart-Züchterdatenbank mit öffentlicher Suchfunktion

## Überblick

Diese Anleitung hilft Ihnen beim schnellen Einstieg in die Entwicklung der Hovawart-Züchterdatenbank. Das System besteht aus einem Next.js Frontend, einer REST API und einer PostgreSQL Datenbank.

## Voraussetzungen

### Systemanforderungen
- Node.js 18+ 
- npm oder yarn
- PostgreSQL 15+
- Git

### Entwicklungstools
- VS Code (empfohlen)
- Docker (optional, für lokale Datenbank)
- Postman oder ähnliches (für API-Tests)

## Lokale Entwicklungsumgebung einrichten

### 1. Repository klonen
```bash
git clone <repository-url>
cd hovawart-breeder-database
```

### 2. Abhängigkeiten installieren
```bash
# Root dependencies
npm install

# Frontend dependencies
cd apps/web
npm install

# Backend dependencies
cd ../api
npm install
```

### 3. Umgebungsvariablen konfigurieren
```bash
# .env.local (Root)
DATABASE_URL="postgresql://username:password@localhost:5432/hovawart_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Datenbank einrichten
```bash
# PostgreSQL starten (falls Docker verwendet wird)
docker run --name hovawart-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=hovawart_db -p 5432:5432 -d postgres:15

# Datenbankschema erstellen
cd apps/database
npx prisma migrate dev
npx prisma db seed
```

### 5. Entwicklungsserver starten
```bash
# Terminal 1: Backend API
cd apps/api
npm run dev

# Terminal 2: Frontend
cd apps/web
npm run dev
```

Die Anwendung ist jetzt verfügbar unter:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/v1

## Projektstruktur verstehen

```
hovawart-breeder-database/
├── apps/
│   ├── web/                 # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router Seiten
│   │   │   ├── components/  # React Komponenten
│   │   │   ├── lib/         # Utilities
│   │   │   └── types/       # TypeScript Typen
│   │   └── tests/           # Frontend Tests
│   │
│   ├── api/                 # Backend API
│   │   ├── src/
│   │   │   ├── routes/      # API Route Handler
│   │   │   ├── services/    # Business Logic
│   │   │   ├── models/      # Data Models
│   │   │   └── middleware/  # Auth, Validation
│   │   └── tests/           # Backend Tests
│   │
│   └── database/            # Datenbank Schema
│       ├── prisma/
│       └── seeds/
│
└── packages/
    ├── shared/              # Geteilte Typen/Utils
    └── ui/                  # UI Komponenten
```

## Erste Schritte

### 1. Benutzer registrieren
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zuechter@example.com",
    "password": "securepassword",
    "firstName": "Max",
    "lastName": "Mustermann",
    "role": "BREEDER"
  }'
```

### 2. Anmelden
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zuechter@example.com",
    "password": "securepassword"
  }'
```

### 3. Hund hinzufügen
```bash
curl -X POST http://localhost:3000/api/v1/dogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Bella",
    "gender": "FEMALE",
    "birthDate": "2020-05-15",
    "color": "Schwarz",
    "description": "Sehr freundliche Hündin"
  }'
```

### 4. Öffentliche Suche testen
```bash
curl "http://localhost:3000/api/v1/dogs/search?name=Bella"
```

## Entwicklungsworkflow

### 1. Feature Branch erstellen
```bash
git checkout -b feature/neue-funktion
```

### 2. Tests schreiben
```bash
# Frontend Tests
cd apps/web
npm test

# Backend Tests
cd apps/api
npm test

# E2E Tests
npm run test:e2e
```

### 3. Code formatieren
```bash
npm run format
npm run lint
```

### 4. Datenbank-Migrationen
```bash
cd apps/database
npx prisma migrate dev --name beschreibung-der-aenderung
```

## Häufige Aufgaben

### Neue API Route hinzufügen
1. Route in `apps/api/src/routes/` erstellen
2. Service in `apps/api/src/services/` implementieren
3. Tests in `apps/api/tests/` schreiben
4. OpenAPI Dokumentation aktualisieren

### Neue Frontend Komponente
1. Komponente in `apps/web/src/components/` erstellen
2. Storybook Story hinzufügen (falls verwendet)
3. Tests in `apps/web/tests/components/` schreiben
4. In entsprechende Seite einbinden

### Datenbankschema ändern
1. Prisma Schema in `apps/database/prisma/schema.prisma` anpassen
2. Migration erstellen: `npx prisma migrate dev`
3. Seed-Daten aktualisieren falls nötig
4. API Models entsprechend anpassen

## Debugging

### Logs anzeigen
```bash
# Backend Logs
cd apps/api
npm run dev

# Frontend Logs
cd apps/web
npm run dev
```

### Datenbank inspizieren
```bash
cd apps/database
npx prisma studio
```

### API testen
- Postman Collection importieren (aus `/contracts/`)
- Swagger UI: http://localhost:3000/api/docs

## Deployment

### Staging
```bash
# Build
npm run build

# Deploy zu Staging
npm run deploy:staging
```

### Production
```bash
# Build für Production
npm run build:prod

# Deploy zu Production
npm run deploy:prod
```

## Troubleshooting

### Häufige Probleme

**Datenbankverbindung fehlgeschlagen**
```bash
# PostgreSQL Status prüfen
docker ps | grep postgres

# Verbindung testen
psql -h localhost -U username -d hovawart_db
```

**Port bereits belegt**
```bash
# Prozess auf Port 3000 finden
lsof -i :3000

# Prozess beenden
kill -9 <PID>
```

**Node Modules Probleme**
```bash
# Cache leeren
npm cache clean --force

# Node Modules neu installieren
rm -rf node_modules package-lock.json
npm install
```

## Nützliche Befehle

```bash
# Alle Tests ausführen
npm test

# Code Coverage
npm run test:coverage

# Type Checking
npm run type-check

# Build Status
npm run build

# Datenbank zurücksetzen
npm run db:reset

# Seed Daten laden
npm run db:seed
```

## Support

Bei Problemen oder Fragen:
1. Dokumentation in `/docs/` prüfen
2. Issues im Repository erstellen
3. Team-Chat für schnelle Hilfe

## Nächste Schritte

Nach dem Setup können Sie:
1. [API Dokumentation](./contracts/openapi.yaml) durchgehen
2. [Data Model](./data-model.md) verstehen
3. Erste Features implementieren
4. Tests schreiben
5. Code Review Prozess durchlaufen
