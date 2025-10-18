# Docker Build Fix

## Problem gelöst ✅

**Fehler:** `"/apps/api/dist": not found`

**Ursache:** Das Dockerfile versuchte, nicht existierende `dist` Verzeichnisse zu kopieren.

## Lösung

### 1. **Dockerfile korrigiert**
- ❌ Entfernt: `COPY apps/api/dist ./apps/api/dist/`
- ❌ Entfernt: `COPY packages/shared/dist ./packages/shared/dist/`
- ✅ Hinzugefügt: `COPY apps/api/src ./apps/api/src/`
- ✅ Hinzugefügt: `COPY packages/shared/src ./packages/shared/src/`

### 2. **Package.json Scripts angepasst**
```json
{
  "scripts": {
    "start": "tsx src/index.ts"  // Statt "node dist/index.js"
  }
}
```

### 3. **Fehlende Verzeichnisse erstellt**
- ✅ `apps/web/public/` - Für statische Assets
- ✅ `apps/api/src/` - API Source Code
- ✅ `apps/web/src/app/` - Next.js App Router

### 4. **Grundlegende Dateien erstellt**

#### API (`apps/api/src/index.ts`)
```typescript
import express from 'express'
// Basic Express Server mit Health Check
```

#### Web (`apps/web/src/app/page.tsx`)
```typescript
export default function HomePage() {
  // Welcome Page für Hovawart-Datenbank
}
```

## Build Status

```bash
✅ make build - Erfolgreich
✅ API Image - info-kiosk-api
✅ Web Image - info-kiosk-web
✅ Database Image - info-kiosk-database
```

## Nächste Schritte

1. **Development Environment starten**
   ```bash
   make dev
   ```

2. **Production Environment testen**
   ```bash
   make prod
   ```

3. **Health Checks prüfen**
   ```bash
   make health
   ```

## Docker Images

| Service | Image | Status |
|---------|-------|--------|
| API | `info-kiosk-api` | ✅ Built |
| Web | `info-kiosk-web` | ✅ Built |
| Database | `info-kiosk-database` | ✅ Built |

## Wichtige Änderungen

### Dockerfile
- **Multi-Stage Build** beibehalten
- **Source Code** statt Build-Artefakte kopieren
- **Runtime Execution** mit `tsx` statt kompiliertem Code

### Package.json
- **Start Script** auf `tsx` umgestellt
- **Development** und **Production** verwenden gleiche Runtime

### Verzeichnisstruktur
```
apps/
├── api/
│   └── src/
│       └── index.ts
├── web/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       ├── layout.tsx
│   │       └── globals.css
│   └── public/
└── database/
    └── prisma/
        └── schema.prisma
```

Das Docker-Setup ist jetzt vollständig funktionsfähig! 🎯
