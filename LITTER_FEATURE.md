# Wurf-Planung Feature

## Übersicht

Züchter können mit ihren Hündinnen Würfe planen und öffentlich veröffentlichen. Diese sind dann öffentlich auffindbar und durchsuchbar.

## Datenmodell

### Litter Entity

```typescript
interface Litter {
  id: string
  motherId: string          // Referenz zur Mutter-Hündin
  fatherId?: string         // Referenz zum Vater (optional, kann später hinzugefügt werden)
  breederId: string         // Referenz zum Züchter
  litterNumber: string      // Wurfnummer (z.B. "A", "B", "C")
  plannedDate?: Date        // Geplantes Deckdatum
  expectedDate?: Date       // Erwarteter Geburtstermin
  actualDate?: Date         // Tatsächlicher Geburtstermin
  status: LitterStatus      // Status des Wurfs
  expectedPuppies?: number  // Erwartete Anzahl Welpen
  actualPuppies?: number    // Tatsächliche Anzahl Welpen
  description?: string      // Beschreibung des Wurfs
  isPublic: boolean         // Öffentlich sichtbar (Standard: true)
  contactInfo?: string      // Kontaktinformationen
  price?: number           // Preis pro Welpe
  location?: string        // Standort
  createdAt: Date
  updatedAt: Date
  
  // Beziehungen
  mother?: Dog             // Mutter-Hündin
  father?: Dog             // Vater-Rüde
  breeder?: User           // Züchter
  puppies?: Dog[]          // Welpen aus diesem Wurf
}
```

### LitterStatus Enum

```typescript
enum LitterStatus {
  PLANNED = 'PLANNED'           // Geplant
  IN_PROGRESS = 'IN_PROGRESS'   // In Vorbereitung/Deckung
  BORN = 'BORN'                 // Geboren
  AVAILABLE = 'AVAILABLE'       // Verfügbar
  RESERVED = 'RESERVED'         // Reserviert
  SOLD = 'SOLD'                 // Verkauft
  CANCELLED = 'CANCELLED'       // Abgebrochen
}
```

## Funktionalitäten

### 1. Wurf erstellen
- **Berechtigung**: Nur Züchter (BREEDER-Rolle)
- **Pflichtfelder**: Mutter-Hündin, Wurfnummer, Züchter
- **Optionale Felder**: Vater, geplantes Datum, erwartete Welpen, Beschreibung, Preis, Kontakt

### 2. Wurf bearbeiten
- **Berechtigung**: Nur der Züchter des Wurfs
- **Einschränkungen**: Status-abhängige Bearbeitungsmöglichkeiten

### 3. Öffentliche Suche
- **Sichtbarkeit**: Alle öffentlichen Würfe (`isPublic: true`)
- **Suchkriterien**:
  - Status (verfügbar, geplant, etc.)
  - Mutter-Hündin
  - Vater-Rüde
  - Züchter
  - Standort/PLZ
  - Preisbereich
  - Erwarteter Geburtstermin

### 4. Wurf-Status verwalten
- **PLANNED** → **IN_PROGRESS**: Deckung geplant
- **IN_PROGRESS** → **BORN**: Welpen geboren
- **BORN** → **AVAILABLE**: Welpen verfügbar
- **AVAILABLE** → **RESERVED**: Welpen reserviert
- **RESERVED** → **SOLD**: Welpen verkauft

## API Endpoints

### Litter Management
```
GET    /api/litters              # Öffentliche Würfe suchen
GET    /api/litters/:id          # Wurf-Details anzeigen
POST   /api/litters              # Wurf erstellen (nur Züchter)
PUT    /api/litters/:id          # Wurf bearbeiten (nur Züchter)
DELETE /api/litters/:id          # Wurf löschen (nur Züchter)
```

### Litter Search
```
GET    /api/litters/search       # Erweiterte Suche
GET    /api/litters/available    # Verfügbare Würfe
GET    /api/litters/planned      # Geplante Würfe
```

## Frontend Komponenten

### 1. LitterCard
- Kompakte Darstellung eines Wurfs
- Status-Badge
- Mutter/Vater-Info
- Kontakt-Button

### 2. LitterForm
- Formular zum Erstellen/Bearbeiten
- Validierung der Eingaben
- Status-Management

### 3. LitterSearch
- Suchfilter
- Kartenansicht
- Listenansicht

### 4. LitterDetails
- Detaillierte Wurf-Informationen
- Mutter/Vater-Stammbaum
- Welpen-Liste (falls geboren)

## Geschäftsregeln

### 1. Wurfnummer
- Eindeutig pro Mutter-Hündin
- Format: A, B, C, D, etc.
- Automatische Vorschläge basierend auf bestehenden Würfen

### 2. Berechtigungen
- Nur Züchter können Würfe erstellen
- Nur der Wurf-Züchter kann bearbeiten
- Öffentliche Würfe sind für alle sichtbar

### 3. Status-Übergänge
- Validierung der Status-Änderungen
- Automatische Benachrichtigungen bei Status-Änderungen

### 4. Welpen-Verwaltung
- Welpen werden automatisch dem Wurf zugeordnet
- `litterId` wird bei Welpen-Geburt gesetzt
- Stammbaum wird automatisch erstellt

## Integration mit bestehenden Features

### 1. Hund-Suche
- Würfe in Suchergebnissen anzeigen
- Filter nach verfügbaren Welpen

### 2. Züchter-Profil
- Würfe des Züchters anzeigen
- Erfolgreiche Zuchten hervorheben

### 3. Stammbaum
- Würfe in Stammbaum-Ansicht
- Mutter/Vater-Beziehungen

### 4. Benachrichtigungen
- Neue Würfe in der Nähe
- Status-Änderungen bei beobachteten Würfen

## Technische Details

### Datenbank-Indizes
```sql
-- Optimierte Suche
CREATE INDEX idx_litters_status ON litters(status);
CREATE INDEX idx_litters_public ON litters(isPublic);
CREATE INDEX idx_litters_mother ON litters(motherId);
CREATE INDEX idx_litters_breeder ON litters(breederId);
CREATE INDEX idx_litters_dates ON litters(plannedDate, expectedDate, actualDate);
```

### Validierung
```typescript
// Wurfnummer muss eindeutig pro Mutter sein
@@unique([motherId, litterNumber])

// Status-Validierung
status: z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED'])
```

### Performance
- Lazy Loading für Welpen-Liste
- Caching für häufige Suchanfragen
- Pagination für große Ergebnislisten

## Nächste Schritte

1. ✅ **Datenmodell erstellt** - Litter Entity mit allen Beziehungen
2. ✅ **Validierung implementiert** - Zod-Schemas für Create/Update
3. ✅ **Types definiert** - TypeScript Interfaces
4. 🔄 **API Endpoints** - REST API implementieren
5. 🔄 **Frontend Komponenten** - React Components
6. 🔄 **Suchfunktion** - Erweiterte Suche
7. 🔄 **Benachrichtigungen** - Status-Updates
8. 🔄 **Tests** - Unit und Integration Tests
