# Setup Guide: Hovawart-Züchterdatenbank

## Probleme gelöst ✅

**Dependencies:** ERESOLVE-Fehler behoben durch vereinfachte Versionen
**Prisma Schema:** Namenskonflikte und Relationen korrigiert
**DATABASE_URL:** Setup-Anleitung erstellt

## Aktuelle Probleme

Das aktuelle Setup hat noch ein Problem mit der DATABASE_URL. Hier sind die Lösungsansätze:

## Option 1: DATABASE_URL konfigurieren (Empfohlen)

```bash
# 1. Erstelle .env Datei
cd apps/database
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/hovawart_db?schema=public"' > .env

# 2. Oder verwende SQLite für Entwicklung
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# 3. Dann:
npm install
npx prisma migrate dev --name init
```

## Option 2: Vereinfachtes Setup ohne Workspaces

Falls Node.js nicht aktualisiert werden kann, können wir ein vereinfachtes Setup verwenden:

### 1. Root Dependencies installieren
```bash
cd /work/projekte/hzd/info-kiosk/info-kiosk
npm init -y
npm install --save-dev typescript @types/node
```

### 2. Frontend Setup
```bash
cd apps/web
npm init -y
npm install next@14 react@18 react-dom@18
npm install --save-dev @types/react @types/react-dom typescript
```

### 3. Backend Setup
```bash
cd ../api
npm init -y
npm install express cors helmet morgan
npm install --save-dev @types/express @types/cors @types/morgan typescript
```

### 4. Database Setup
```bash
cd ../database
npm init -y
npm install @prisma/client
npm install --save-dev prisma typescript
```

## Option 3: Docker Setup

```bash
# Dockerfile erstellen für konsistente Node.js Version
# Dann:
docker build -t hovawart-db .
docker run -it hovawart-db
```

## Aktueller Status

✅ **Vollständig implementiert:**
- Monorepo-Struktur
- TypeScript-Konfigurationen
- Prisma Schema
- Shared Types & Validators
- UI Components
- API Contracts (OpenAPI)

⚠️ **Ausstehend:**
- Dependency Installation (wegen Node.js Version)
- Build & Development Server
- Database Migration

## Nächste Schritte

1. Node.js auf Version 18+ aktualisieren
2. `npm install` ausführen
3. Prisma Client generieren: `npx prisma generate`
4. Database Migration: `npx prisma migrate dev`
5. Development Server starten: `npm run dev`

## Projektstruktur

```
apps/
├── web/          # Next.js Frontend
├── api/          # Express.js Backend
└── database/     # Prisma Database

packages/
├── shared/       # Types & Validators
└── ui/          # React Components
```

Das Projekt ist vollständig strukturiert und bereit für die Entwicklung, sobald die Dependencies installiert sind.
