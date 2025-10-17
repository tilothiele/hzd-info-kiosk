# Data Model: Hovawart-Züchterdatenbank

**Date**: 2024-12-19
**Feature**: Hovawart-Züchterdatenbank mit öffentlicher Suchfunktion

## Entity Overview

### Core Entities

#### 1. User (Benutzer)
**Purpose**: Repräsentiert authentifizierte Benutzer des Systems

**Fields**:
- `id`: UUID (Primary Key)
- `email`: String (Unique, Required)
- `password`: String (Hashed, Required)
- `firstName`: String (Required)
- `lastName`: String (Required)
- `phone`: String (Optional)
- `address`: String (Optional)
- `postalCode`: String (Optional)
- `city`: String (Optional)
- `country`: String (Optional, Default: "Deutschland")
- `latitude`: Decimal (Optional, für Geolocation)
- `longitude`: Decimal (Optional, für Geolocation)
- `isActive`: Boolean (Default: true)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- One-to-Many: `dogs` (User kann mehrere Hunde besitzen)
- One-to-Many: `studServices` (User kann mehrere Deckrüden anbieten)
- One-to-Many: `userRoles` (User kann mehrere Rollen haben)

**Validation Rules**:
- Email muss gültiges Format haben
- Password mindestens 8 Zeichen
- User muss mindestens eine Rolle haben
- PostalCode muss gültiges deutsches PLZ-Format haben (5 Ziffern)
- Latitude muss zwischen -90 und 90 liegen
- Longitude muss zwischen -180 und 180 liegen
- Wenn Latitude gesetzt ist, muss auch Longitude gesetzt sein

**Access Control Rules**:
- BREEDER: Kann nur eigene Hunde verwalten (CRUD-Operationen)
- STUD_OWNER: Kann nur eigene Hunde verwalten (CRUD-Operationen)
- ADMIN: Kann alle Hunde verwalten (CRUD-Operationen)
- MEMBER: Kann nur eigene Hunde anzeigen (Read-Only)
- EDITOR: Kann alle Hunde anzeigen und bearbeiten (Read/Update), aber nicht löschen
- **Benutzerregistrierung**: Nur Administratoren können neue Benutzer anlegen

#### 2. UserRole (Benutzerrolle)
**Purpose**: Repräsentiert die Rollen eines Benutzers (Many-to-Many Beziehung)

**Fields**:
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key to User)
- `role`: Enum (BREEDER, STUD_OWNER, ADMIN, MEMBER, EDITOR)
- `isActive`: Boolean (Default: true)
- `assignedAt`: DateTime (Default: now())
- `assignedBy`: UUID (Foreign Key to User, Optional)

**Relationships**:
- Many-to-One: `user` (UserRole gehört zu einem User)
- Many-to-One: `assignedByUser` (UserRole wurde von einem User zugewiesen)

**Validation Rules**:
- User kann nicht dieselbe Rolle mehrfach haben
- Role muss gültiger Enum-Wert sein
- AssignedBy muss gültiger User sein (falls vorhanden)

#### 3. Dog (Hovawart-Hund)
**Purpose**: Repräsentiert einen Hovawart-Hund in der Datenbank

**Fields**:
- `id`: UUID (Primary Key)
- `name`: String (Required)
- `gender`: Enum (MALE, FEMALE)
- `birthDate`: Date (Required)
- `deathDate`: Date (Optional)
- `color`: String (Required)
- `microchipId`: String (Optional, Unique)
- `pedigreeNumber`: String (Optional, Unique)
- `isStudAvailable`: Boolean (Default: false)
- `isActive`: Boolean (Default: true)
- `description`: Text (Optional)
- `ownerId`: UUID (Foreign Key to User)
- `motherId`: UUID (Foreign Key to Dog, Optional)
- `fatherId`: UUID (Foreign Key to Dog, Optional)
- `litterNumber`: String (Optional, max 10 Zeichen)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-One: `owner` (Dog gehört zu einem User)
- Many-to-One: `mother` (Dog hat eine Mutter, optional)
- Many-to-One: `father` (Dog hat einen Vater, optional)
- One-to-Many: `offspring` (Dog kann Vater oder Mutter von mehreren Nachkommen sein)
- One-to-Many: `healthRecords` (Dog kann mehrere Gesundheitsdaten haben)
- One-to-Many: `medicalFindings` (Dog kann mehrere Befunde haben)
- One-to-Many: `awards` (Dog kann mehrere Auszeichnungen haben)
- One-to-Many: `geneticTests` (Dog kann mehrere genetische Untersuchungen haben)
- One-to-Many: `studServices` (Dog kann mehrere Deckdienste anbieten)

**Validation Rules**:
- Name darf nicht leer sein
- BirthDate darf nicht in der Zukunft liegen
- DeathDate darf nicht in der Zukunft liegen (falls vorhanden)
- DeathDate muss nach BirthDate liegen (falls vorhanden)
- MicrochipId muss eindeutig sein (falls vorhanden)
- PedigreeNumber muss eindeutig sein (falls vorhanden)
- MotherId muss auf einen weiblichen Hund verweisen (falls vorhanden)
- FatherId muss auf einen männlichen Hund verweisen (falls vorhanden)
- Hund kann nicht sein eigener Vater oder Mutter sein
- Mutter und Vater müssen vor dem Hund geboren worden sein
- LitterNumber muss maximal 10 Zeichen haben (falls vorhanden)
- LitterNumber muss eindeutig pro Mutter sein (falls vorhanden)

#### 4. HealthRecord (Gesundheitsinformation)
**Purpose**: Repräsentiert Gesundheitsdaten und Zertifikate für einen Hund

**Fields**:
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key to Dog)
- `recordType`: Enum (VACCINATION, HEALTH_CHECK, GENETIC_TEST, OTHER)
- `title`: String (Required)
- `description`: Text (Optional)
- `recordDate`: Date (Required)
- `expiryDate`: Date (Optional)
- `veterinarian`: String (Optional)
- `documentUrl`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-One: `dog` (HealthRecord gehört zu einem Dog)

**Validation Rules**:
- RecordDate darf nicht in der Zukunft liegen
- ExpiryDate muss nach RecordDate liegen (falls vorhanden)
- RecordType muss gültiger Enum-Wert sein

#### 5. MedicalFinding (Befund)
**Purpose**: Repräsentiert medizinische Befunde eines Hundes

**Fields**:
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key to Dog)
- `date`: Date (Required)
- `shortDescription`: String (Required, max 100 Zeichen)
- `remarks`: Text (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-One: `dog` (MedicalFinding gehört zu einem Dog)

**Validation Rules**:
- Date darf nicht in der Zukunft liegen
- ShortDescription darf nicht leer sein
- ShortDescription muss maximal 100 Zeichen haben

#### 6. Award (Auszeichnung)
**Purpose**: Repräsentiert Auszeichnungen und Titel eines Hundes

**Fields**:
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key to Dog)
- `code`: String (Required, max 50 Zeichen)
- `date`: Date (Optional)
- `description`: String (Required, max 200 Zeichen)
- `issuer`: String (Required, max 100 Zeichen)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-One: `dog` (Award gehört zu einem Dog)

**Validation Rules**:
- Code darf nicht leer sein
- Code muss maximal 50 Zeichen haben
- Description darf nicht leer sein
- Description muss maximal 200 Zeichen haben
- Issuer darf nicht leer sein
- Issuer muss maximal 100 Zeichen haben
- Date darf nicht in der Zukunft liegen (falls vorhanden)

#### 7. GeneticTest (Genetische Untersuchung)
**Purpose**: Repräsentiert genetische Untersuchungsergebnisse für die Zuchtplanung

**Fields**:
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key to Dog)
- `testType`: Enum (HD, ED, PRA, DM, VWD, OTHER)
- `testDate`: Date (Required)
- `result`: Enum (NORMAL, CARRIER, AFFECTED, UNKNOWN)
- `laboratory`: String (Required, max 100 Zeichen)
- `certificateNumber`: String (Optional, max 50 Zeichen)
- `notes`: Text (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-One: `dog` (GeneticTest gehört zu einem Dog)

**Validation Rules**:
- TestType muss gültiger Enum-Wert sein
- TestDate darf nicht in der Zukunft liegen
- Result muss gültiger Enum-Wert sein
- Laboratory darf nicht leer sein
- Laboratory muss maximal 100 Zeichen haben
- CertificateNumber muss maximal 50 Zeichen haben (falls vorhanden)

#### 8. StudService (Deckdienst)
**Purpose**: Repräsentiert Deckdienst-Angebote von Deckrüden

**Fields**:
- `id`: UUID (Primary Key)
- `studDogId`: UUID (Foreign Key to Dog)
- `ownerId`: UUID (Foreign Key to User)
- `isAvailable`: Boolean (Default: true)
- `price`: Decimal (Optional)
- `description`: Text (Optional)
- `contactInfo`: String (Required)
- `location`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Relationships**:
- Many-to-One: `studDog` (StudService gehört zu einem Dog)
- Many-to-One: `owner` (StudService gehört zu einem User)

**Validation Rules**:
- StudDog muss männlich sein
- Price muss positiv sein (falls vorhanden)
- ContactInfo darf nicht leer sein

## Database Schema (Prisma)

```prisma
// Enums
enum UserRole {
  BREEDER
  STUD_OWNER
  ADMIN
  MEMBER
  EDITOR
}

enum Gender {
  MALE
  FEMALE
}


enum HealthRecordType {
  VACCINATION
  HEALTH_CHECK
  GENETIC_TEST
  OTHER
}

enum GeneticTestType {
  HD
  ED
  PRA
  DM
  VWD
  OTHER
}

enum GeneticTestResult {
  NORMAL
  CARRIER
  AFFECTED
  UNKNOWN
}

// Models
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  firstName  String
  lastName   String
  phone      String?
  address    String?
  postalCode String?
  city       String?
  country    String   @default("Deutschland")
  latitude   Decimal? @db.Decimal(10, 8)
  longitude  Decimal? @db.Decimal(11, 8)
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relationships
  dogs        Dog[]
  studServices StudService[]
  userRoles   UserRole[]
  assignedRoles UserRole[] @relation("RoleAssignedBy")

  // Indexes
  @@index([postalCode])
  @@index([latitude, longitude])
  @@map("users")
}

model UserRole {
  id         String   @id @default(uuid())
  userId     String
  role       UserRole
  isActive   Boolean  @default(true)
  assignedAt DateTime @default(now())
  assignedBy String?

  // Relationships
  user         User  @relation(fields: [userId], references: [id])
  assignedByUser User? @relation("RoleAssignedBy", fields: [assignedBy], references: [id])

  // Constraints
  @@unique([userId, role])
  @@map("user_roles")
}

model Dog {
  id             String   @id @default(uuid())
  name           String
  gender         Gender
  birthDate      DateTime
  deathDate      DateTime?
  color          String
  microchipId    String?  @unique
  pedigreeNumber String?  @unique
  isStudAvailable Boolean @default(false)
  isActive       Boolean  @default(true)
  description    String?
  ownerId        String
  motherId       String?
  fatherId       String?
  litterNumber   String?  @db.VarChar(10)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relationships
  owner           User           @relation(fields: [ownerId], references: [id])
  mother          Dog?           @relation("ParentOffspring", fields: [motherId], references: [id])
  father          Dog?           @relation("ParentOffspring", fields: [fatherId], references: [id])
  offspring       Dog[]          @relation("ParentOffspring")
  healthRecords   HealthRecord[]
  medicalFindings MedicalFinding[]
  awards          Award[]
  geneticTests    GeneticTest[]
  studServices    StudService[]

  // Indexes
  @@index([name])
  @@index([gender])
  @@index([birthDate])
  @@index([deathDate])
  @@index([color])
  @@index([ownerId])
  @@index([motherId])
  @@index([fatherId])
  @@index([litterNumber])
  @@index([isStudAvailable])
  @@unique([motherId, litterNumber])
  @@map("dogs")
}


model HealthRecord {
  id           String            @id @default(uuid())
  dogId        String
  recordType   HealthRecordType
  title        String
  description  String?
  recordDate   DateTime
  expiryDate   DateTime?
  veterinarian String?
  documentUrl  String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  // Relationships
  dog Dog @relation(fields: [dogId], references: [id])

  // Indexes
  @@index([dogId])
  @@index([recordDate])
  @@index([expiryDate])
  @@map("health_records")
}

model MedicalFinding {
  id               String   @id @default(uuid())
  dogId            String
  date             DateTime
  shortDescription String   @db.VarChar(100)
  remarks          String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relationships
  dog Dog @relation(fields: [dogId], references: [id])

  // Indexes
  @@index([dogId])
  @@index([date])
  @@index([shortDescription])
  @@map("medical_findings")
}

model Award {
  id          String    @id @default(uuid())
  dogId       String
  code        String    @db.VarChar(50)
  date        DateTime?
  description String    @db.VarChar(200)
  issuer      String    @db.VarChar(100)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relationships
  dog Dog @relation(fields: [dogId], references: [id])

  // Indexes
  @@index([dogId])
  @@index([code])
  @@index([date])
  @@index([issuer])
  @@map("awards")
}

model GeneticTest {
  id               String             @id @default(uuid())
  dogId            String
  testType         GeneticTestType
  testDate         DateTime
  result           GeneticTestResult
  laboratory       String             @db.VarChar(100)
  certificateNumber String?           @db.VarChar(50)
  notes            String?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  // Relationships
  dog Dog @relation(fields: [dogId], references: [id])

  // Indexes
  @@index([dogId])
  @@index([testType])
  @@index([testDate])
  @@index([result])
  @@index([laboratory])
  @@map("genetic_tests")
}

model StudService {
  id          String   @id @default(uuid())
  studDogId   String
  ownerId     String
  isAvailable Boolean  @default(true)
  price       Decimal?
  description String?
  contactInfo String
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  studDog Dog  @relation(fields: [studDogId], references: [id])
  owner   User @relation(fields: [ownerId], references: [id])

  // Indexes
  @@index([studDogId])
  @@index([isAvailable])
  @@map("stud_services")
}
```

## State Transitions

### Dog States
- **Active**: Hund ist in der Datenbank und sichtbar
- **Inactive**: Hund ist archiviert, aber nicht gelöscht
- **Deleted**: Hund ist soft-deleted (nur für Administratoren)

### StudService States
- **Available**: Deckdienst ist verfügbar
- **Unavailable**: Deckdienst ist temporär nicht verfügbar
- **Inactive**: Deckdienst ist deaktiviert

### User States
- **Active**: Benutzer kann sich anmelden
- **Inactive**: Benutzer ist deaktiviert
- **Pending**: Benutzer wartet auf Aktivierung

## Access Control Matrix

### Hundeverwaltung (Dog Management)

| Rolle | Eigene Hunde | Andere Hunde | Öffentliche Suche |
|-------|--------------|--------------|-------------------|
| **BREEDER** | CRUD (Create, Read, Update, Delete) | Kein Zugriff | Read-Only |
| **STUD_OWNER** | CRUD (Create, Read, Update, Delete) | Kein Zugriff | Read-Only |
| **MEMBER** | Read-Only | Kein Zugriff | Read-Only |
| **EDITOR** | CRUD | Read/Update (alle Hunde) | Read-Only |
| **ADMIN** | CRUD | CRUD (alle Hunde) | Read-Only |
| **Öffentlich** | Kein Zugriff | Kein Zugriff | Read-Only |

### Gesundheitsdaten (Health Records)

| Rolle | Eigene Hunde | Andere Hunde |
|-------|--------------|--------------|
| **BREEDER** | CRUD | Kein Zugriff |
| **STUD_OWNER** | CRUD | Kein Zugriff |
| **MEMBER** | Read-Only | Kein Zugriff |
| **EDITOR** | CRUD | Read/Update (alle Hunde) |
| **ADMIN** | CRUD | CRUD (alle Hunde) |

### Medizinische Befunde (Medical Findings)

| Rolle | Eigene Hunde | Andere Hunde |
|-------|--------------|--------------|
| **BREEDER** | CRUD | Kein Zugriff |
| **STUD_OWNER** | CRUD | Kein Zugriff |
| **MEMBER** | Read-Only | Kein Zugriff |
| **EDITOR** | CRUD | Read/Update (alle Hunde) |
| **ADMIN** | CRUD | CRUD (alle Hunde) |

### Auszeichnungen (Awards)

| Rolle | Eigene Hunde | Andere Hunde |
|-------|--------------|--------------|
| **BREEDER** | CRUD | Kein Zugriff |
| **STUD_OWNER** | CRUD | Kein Zugriff |
| **MEMBER** | Read-Only | Kein Zugriff |
| **EDITOR** | CRUD | Read/Update (alle Hunde) |
| **ADMIN** | CRUD | CRUD (alle Hunde) |

### Genetische Untersuchungen (Genetic Tests)

| Rolle | Eigene Hunde | Andere Hunde |
|-------|--------------|--------------|
| **BREEDER** | CRUD | Read-Only (für Zuchtplanung) |
| **STUD_OWNER** | CRUD | Read-Only (für Zuchtplanung) |
| **MEMBER** | Read-Only | Read-Only |
| **EDITOR** | CRUD | Read/Update (alle Hunde) |
| **ADMIN** | CRUD | CRUD (alle Hunde) |

### Deckdienste (Stud Services)

| Rolle | Eigene Deckdienste | Andere Deckdienste | Öffentliche Suche |
|-------|-------------------|-------------------|-------------------|
| **BREEDER** | Kein Zugriff | Read-Only | Read-Only |
| **STUD_OWNER** | CRUD | Kein Zugriff | Read-Only |
| **MEMBER** | Kein Zugriff | Read-Only | Read-Only |
| **EDITOR** | Kein Zugriff | Read/Update (alle Deckdienste) | Read-Only |
| **ADMIN** | CRUD | CRUD (alle Deckdienste) | Read-Only |
| **Öffentlich** | Kein Zugriff | Kein Zugriff | Read-Only |

### Benutzerverwaltung (User Management)

| Rolle | Eigene Daten | Andere Benutzer | Rollenverwaltung | Benutzerregistrierung |
|-------|--------------|-----------------|------------------|----------------------|
| **BREEDER** | Read/Update | Kein Zugriff | Kein Zugriff | Kein Zugriff |
| **STUD_OWNER** | Read/Update | Kein Zugriff | Kein Zugriff | Kein Zugriff |
| **MEMBER** | Read/Update | Kein Zugriff | Kein Zugriff | Kein Zugriff |
| **EDITOR** | Read/Update | Read-Only | Kein Zugriff | Kein Zugriff |
| **ADMIN** | CRUD | Read-Only | CRUD (Rollen zuweisen) | **CRUD (Benutzer anlegen)** |
| **Öffentlich** | Kein Zugriff | Kein Zugriff | Kein Zugriff | Kein Zugriff |

## Data Validation Rules

### Business Rules
1. Ein Hund kann nicht sein eigener Vater oder Mutter sein
2. Mutter muss weiblich sein, Vater muss männlich sein
3. Mutter und Vater müssen vor dem Hund geboren worden sein
4. Zirkuläre Verwandtschaft in Stammbaum ist nicht erlaubt
5. Deckrüden müssen männlich sein
6. Gesundheitsdaten dürfen nicht in der Zukunft liegen
7. Ablaufdaten müssen nach Erstellungsdatum liegen
8. Benutzer müssen mindestens eine aktive Rolle haben
9. Benutzer können nicht dieselbe Rolle mehrfach haben
10. Nur Administratoren können Rollen zuweisen
11. **Nur Administratoren können neue Benutzer anlegen**
12. BREEDER und STUD_OWNER können nur ihre eigenen Hunde verwalten
13. MEMBER können nur ihre eigenen Hunde anzeigen (Read-Only)
14. EDITOR können alle Hunde anzeigen und bearbeiten, aber nicht löschen
15. ADMIN können alle Hunde verwalten
16. Öffentliche Suchfunktion zeigt alle aktiven Hunde an
17. BREEDER und STUD_OWNER können auf einer Karte angezeigt werden
18. Suchresultate können nach Entfernung zu einer gewählten PLZ sortiert werden
19. Geolocation-Daten sind optional, aber empfohlen für BREEDER und STUD_OWNER
20. PLZ muss gültiges deutsches Format haben (5 Ziffern)

### Technical Rules
1. Alle UUIDs müssen gültig sein
2. Email-Adressen müssen gültiges Format haben
3. Passwörter müssen mindestens 8 Zeichen haben
4. Dezimalzahlen müssen positiv sein
5. Datumsangaben müssen gültig sein
6. Latitude muss zwischen -90 und 90 liegen
7. Longitude muss zwischen -180 und 180 liegen
8. PLZ muss 5 Ziffern haben (deutsches Format)
9. Geolocation-Daten müssen konsistent sein (beide oder keine)

## Performance Considerations

### Indexes
- `dogs.name`: Für Namenssuche
- `dogs.gender`: Für Geschlechtsfilter
- `dogs.birthDate`: Für Altersberechnung
- `dogs.color`: Für Farbfilter
- `dogs.ownerId`: Für Züchtersuche
- `dogs.isStudAvailable`: Für Deckrüden-Suche
- `health_records.expiryDate`: Für ablaufende Zertifikate
- `user_roles.userId`: Für Rollenabfragen
- `user_roles.role`: Für Rollenfilter
- `user_roles.isActive`: Für aktive Rollen
- `users.postalCode`: Für PLZ-basierte Suche
- `users.latitude, users.longitude`: Für Geolocation-basierte Suche
- `users.latitude, users.longitude, users.postalCode`: Composite Index für Entfernungsberechnung

### Query Optimization
- Stammbaum-Abfragen mit rekursiven CTEs
- Pagination für große Ergebnislisten
- Caching für häufige Suchanfragen
- Lazy Loading für Beziehungen
- Rollenabfragen mit Joins optimieren
- Benutzer-Rollen-Cache für häufige Zugriffe
- Owner-basierte Filterung für BREEDER/STUD_OWNER Zugriffe
- Row-Level Security (RLS) für Datenbankebene Zugriffskontrolle
- Haversine-Formel für Entfernungsberechnung zwischen Koordinaten
- PostGIS-Erweiterung für erweiterte Geolocation-Funktionen
- Geocoding-Service für PLZ-zu-Koordinaten Konvertierung
- Entfernungsbasierte Sortierung mit optimierten Indizes

## Geolocation Features

### Kartenanzeige
- **BREEDER** und **STUD_OWNER** können auf einer interaktiven Karte angezeigt werden
- Marker zeigen Standort basierend auf `latitude` und `longitude`
- Popup mit Benutzerinformationen und verfügbaren Hunden/Deckdiensten
- Kartenansicht ist öffentlich zugänglich (ohne Authentifizierung)

### Entfernungsberechnung
- Suchresultate können nach Entfernung zu einer gewählten PLZ sortiert werden
- Haversine-Formel für präzise Entfernungsberechnung zwischen Koordinaten
- Entfernung wird in Kilometern angezeigt
- Fallback auf PLZ-basierte Entfernung wenn Koordinaten nicht verfügbar

### Geocoding
- Automatische Konvertierung von PLZ zu Koordinaten
- Integration mit externem Geocoding-Service (z.B. OpenStreetMap Nominatim)
- Caching von Geocoding-Ergebnissen für Performance
- Validierung von PLZ-Format vor Geocoding

### Suchfunktionen
- **PLZ-basierte Suche**: Filterung nach Postleitzahl
- **Radius-Suche**: Suche innerhalb eines bestimmten Radius (z.B. 50km)
- **Entfernungs-Sortierung**: Sortierung nach Entfernung zu Referenz-PLZ
- **Karten-Filter**: Interaktive Kartenansicht mit Zoom und Pan

### Datenschutz
- Geolocation-Daten sind optional
- Benutzer können Koordinaten verbergen (nur PLZ anzeigen)
- Granulare Kontrolle über Sichtbarkeit der Adressdaten
- DSGVO-konforme Speicherung und Verarbeitung

## Benutzerregistrierung

### Registrierungsprozess
- **Nur Administratoren** können neue Benutzer anlegen
- Keine öffentliche Selbstregistrierung verfügbar
- Administratoren erstellen Benutzerkonten mit initialen Rollen
- Temporäre Passwörter werden generiert und an Benutzer gesendet
- Benutzer müssen Passwort bei erster Anmeldung ändern

### Registrierungsdaten
- **Pflichtfelder**: Email, Vorname, Nachname, Rolle(n)
- **Optionale Felder**: Telefon, Adresse, PLZ, Stadt
- **Automatisch gesetzt**: Passwort (temporär), isActive (true), createdAt
- **Validierung**: Email-Format, PLZ-Format, Rollen-Validierung

### Rollenzuweisung
- Administratoren können mehrere Rollen gleichzeitig zuweisen
- Mindestens eine Rolle muss zugewiesen werden
- Rollen können nachträglich geändert werden
- Rollenhistorie wird in `UserRole` Tabelle gespeichert

### Sicherheitsaspekte
- Temporäre Passwörter haben begrenzte Gültigkeit (z.B. 7 Tage)
- Benutzer werden per Email über Konto-Erstellung informiert
- Passwort-Reset-Funktionalität für vergessene Passwörter
- Audit-Trail für alle Benutzer-Erstellungen

### Workflow
1. **Administrator** erstellt neuen Benutzer
2. **System** generiert temporäres Passwort
3. **Email** mit Anmeldedaten wird an Benutzer gesendet
4. **Benutzer** meldet sich mit temporärem Passwort an
5. **System** fordert Passwort-Änderung
6. **Benutzer** setzt neues Passwort
7. **Benutzer** kann System normal nutzen

## EDITOR-Rolle

### Zweck der EDITOR-Rolle
Die EDITOR-Rolle ist für Benutzer gedacht, die Datenqualität und -konsistenz in der Datenbank sicherstellen sollen, ohne die vollen Administratorrechte zu haben.

### Berechtigungen der EDITOR-Rolle

**Hundeverwaltung:**
- **Eigene Hunde**: Vollständige CRUD-Operationen (Create, Read, Update, Delete)
- **Andere Hunde**: Read/Update (kann anzeigen und bearbeiten, aber nicht löschen)
- **Neue Hunde**: Kann neue Hunde erstellen
- **Datenkorrektur**: Kann fehlerhafte oder unvollständige Daten korrigieren

**Gesundheitsdaten:**
- **Eigene Hunde**: Vollständige CRUD-Operationen
- **Andere Hunde**: Read/Update (kann Gesundheitsdaten bearbeiten, aber nicht löschen)
- **Datenvalidierung**: Kann Gesundheitsdaten auf Vollständigkeit prüfen

**Deckdienste:**
- **Eigene Deckdienste**: Kein Zugriff (EDITOR ist nicht für Deckdienste zuständig)
- **Andere Deckdienste**: Read/Update (kann Deckdienst-Informationen bearbeiten)
- **Datenqualität**: Kann Deckdienst-Beschreibungen verbessern

**Benutzerverwaltung:**
- **Eigene Daten**: Read/Update
- **Andere Benutzer**: Read-Only (kann Benutzerdaten anzeigen, aber nicht ändern)
- **Rollenverwaltung**: Kein Zugriff
- **Benutzerregistrierung**: Kein Zugriff

### Anwendungsfälle für EDITOR
- **Datenqualitätssicherung**: Korrektur von Tippfehlern und unvollständigen Daten
- **Standardisierung**: Vereinheitlichung von Datenformaten und -strukturen
- **Datenpflege**: Aktualisierung veralteter Informationen
- **Stammbaumpflege**: Korrektur von Verwandtschaftsverhältnissen
- **Gesundheitsdaten-Pflege**: Aktualisierung und Vervollständigung von Gesundheitsinformationen

### Einschränkungen der EDITOR-Rolle
- **Keine Löschrechte**: Kann keine Hunde oder Gesundheitsdaten löschen
- **Keine Benutzerverwaltung**: Kann keine neuen Benutzer anlegen oder Rollen ändern
- **Keine Systemverwaltung**: Kein Zugriff auf Systemkonfiguration oder -einstellungen
- **Audit-Trail**: Alle Änderungen werden protokolliert

### Rollenhierarchie
```
ADMIN (höchste Rechte)
├── EDITOR (Datenpflege und -korrektur)
├── BREEDER (eigene Hunde verwalten)
├── STUD_OWNER (eigene Hunde und Deckdienste verwalten)
└── MEMBER (nur anzeigen)
```

## Stammbaum-Funktionalität

### Direkte Elternverweise
Jeder Hund hat direkte Verweise auf seine Eltern (soweit bekannt):

**Neue Felder in der Dog-Entität:**
- `motherId`: UUID (Foreign Key zu Dog, Optional)
- `fatherId`: UUID (Foreign Key zu Dog, Optional)

### Vorteile der direkten Verweise

**Performance:**
- **Schnelle Abfragen**: Direkte Elternabfrage ohne JOINs über Pedigree-Tabelle
- **Einfache Stammbaum-Darstellung**: Mutter und Vater sind direkt verfügbar
- **Effiziente Validierung**: Geschlecht und Geburtsdatum können direkt geprüft werden

**Datenintegrität:**
- **Referentielle Integrität**: Foreign Key Constraints stellen sicher, dass Eltern existieren
- **Geschlechtsvalidierung**: Mutter muss weiblich, Vater muss männlich sein
- **Zeitliche Validierung**: Eltern müssen vor dem Hund geboren worden sein

### Stammbaum-Abfragen

**Einfache Elternabfrage:**
```sql
-- Eltern eines Hundes abfragen
SELECT d.name, d.gender, d.birthDate,
       m.name as mother_name, f.name as father_name
FROM dogs d
LEFT JOIN dogs m ON d.motherId = m.id
LEFT JOIN dogs f ON d.fatherId = f.id
WHERE d.id = ?
```

**Nachkommen abfragen:**
```sql
-- Alle Nachkommen eines Hundes (als Mutter oder Vater)
SELECT * FROM dogs WHERE motherId = ? OR fatherId = ?

-- Nachkommen als Mutter
SELECT * FROM dogs WHERE motherId = ?

-- Nachkommen als Vater
SELECT * FROM dogs WHERE fatherId = ?
```

**Stammbaum-Generation:**
```sql
-- 3-Generationen Stammbaum
WITH RECURSIVE family_tree AS (
  -- Start: Der Hund selbst
  SELECT id, name, gender, birthDate, motherId, fatherId, 0 as level
  FROM dogs WHERE id = ?

  UNION ALL

  -- Eltern hinzufügen
  SELECT d.id, d.name, d.gender, d.birthDate, d.motherId, d.fatherId, ft.level + 1
  FROM dogs d
  JOIN family_tree ft ON (d.id = ft.motherId OR d.id = ft.fatherId)
  WHERE ft.level < 3
)
SELECT * FROM family_tree ORDER BY level, name;
```

### Validierungsregeln

**Geschlechtsvalidierung:**
- Mutter (`motherId`) muss `gender = FEMALE` haben
- Vater (`fatherId`) muss `gender = MALE` haben

**Zeitliche Validierung:**
- Mutter muss vor dem Hund geboren worden sein
- Vater muss vor dem Hund geboren worden sein

**Zirkuläre Verwandtschaft:**
- Hund kann nicht sein eigener Vater oder Mutter sein
- Verhindert Endlos-Schleifen im Stammbaum

### Indexierung für Performance

**Neue Indizes:**
```sql
-- Für schnelle Elternabfragen
CREATE INDEX idx_dogs_mother_id ON dogs(motherId);
CREATE INDEX idx_dogs_father_id ON dogs(fatherId);

-- Für Nachkommenabfragen
CREATE INDEX idx_dogs_mother_birth ON dogs(motherId, birthDate);
CREATE INDEX idx_dogs_father_birth ON dogs(fatherId, birthDate);
```

### Migration von Pedigree-Tabelle

**Migration von Legacy-Daten:**
- Bestehende Pedigree-Daten werden in direkte Verweise umgewandelt
- Vereinfachung der Datenstruktur
- Bessere Performance bei Stammbaum-Abfragen

**Vereinfachte Lösung:**
- **Direkte Verweise**: Für alle Eltern-Kind-Beziehungen
- **Einfache Abfragen**: Mutter und Vater sind direkt verfügbar
- **Klare Struktur**: Keine Verwirrung durch redundante Beziehungen

## Wurfnummer-Funktionalität

### Zweck der Wurfnummer
Die `litterNumber` dokumentiert, welcher Wurf (A-, B-, C-Wurf, etc.) ein Hund ist. Dies ist wichtig für die Zuchtplanung und die Nachverfolgung der Zuchterfolge von Hündinnen.

### Wurfnummer-Formate

**Buchstaben-System:**
- "A" = Erster Wurf
- "B" = Zweiter Wurf
- "C" = Dritter Wurf
- "D" = Vierter Wurf
- etc.

**Zahlen-System:**
- "1" = Erster Wurf
- "2" = Zweiter Wurf
- "3" = Dritter Wurf
- etc.

**Kombiniertes System:**
- "A1" = Erster Wurf, erstes Jahr
- "A2" = Erster Wurf, zweites Jahr
- "B1" = Zweiter Wurf, erstes Jahr

### Datenvalidierung

**Eindeutigkeit:**
- Jede Wurfnummer muss pro Mutter eindeutig sein
- Constraint: `@@unique([motherId, litterNumber])`
- Verhindert doppelte Wurfnummern bei derselben Hündin

**Format-Validierung:**
- Maximale Länge: 10 Zeichen
- Flexible Eingabe für verschiedene Systeme
- Keine Pflichtfeld (optional)

### Anwendungsfälle

**Zuchtplanung:**
- Verfolgung der Wurfanzahl pro Hündin
- Altersbeschränkungen für Zucht
- Pausen zwischen Würfen

**Stammbaum-Analyse:**
- Wurfstatistiken pro Hündin
- Erfolgsrate verschiedener Würfe
- Vergleich von Wurfgrößen

**Zuchtbuchführung:**
- Ordnungsgemäße Dokumentation
- Nachweis der Zuchttätigkeit
- Einhaltung von Zuchtrichtlinien

### Abfragebeispiele

**Alle Würfe einer Hündin:**
```sql
SELECT litterNumber, COUNT(*) as anzahlWelpen, 
       MIN(birthDate) as wurfdatum
FROM dogs 
WHERE motherId = ?
  AND litterNumber IS NOT NULL
GROUP BY litterNumber, motherId
ORDER BY litterNumber;
```

**Wurfstatistiken:**
```sql
SELECT d.name as hündin, 
       d.litterNumber,
       COUNT(o.id) as anzahlWelpen,
       AVG(YEAR(CURDATE()) - YEAR(o.birthDate)) as durchschnittsalter
FROM dogs d
JOIN dogs o ON d.id = o.motherId
WHERE d.gender = 'FEMALE'
  AND d.litterNumber IS NOT NULL
GROUP BY d.id, d.litterNumber
ORDER BY d.name, d.litterNumber;
```

**Zuchtpausen überwachen:**
```sql
SELECT d.name as hündin,
       d.litterNumber,
       o.birthDate as wurfdatum,
       LAG(o.birthDate) OVER (PARTITION BY d.id ORDER BY d.litterNumber) as vorherigerWurf,
       DATEDIFF(o.birthDate, LAG(o.birthDate) OVER (PARTITION BY d.id ORDER BY d.litterNumber)) as pauseInTagen
FROM dogs d
JOIN dogs o ON d.id = o.motherId
WHERE d.gender = 'FEMALE'
  AND d.litterNumber IS NOT NULL
ORDER BY d.name, d.litterNumber;
```

### Integration in die Anwendung

**Hündinnen-Profil:**
- Übersicht aller Würfe
- Wurfstatistiken
- Zuchtpausen-Anzeige

**Zuchtplanung:**
- Warnung bei zu kurzen Pausen
- Empfehlungen für optimale Zuchtintervalle
- Altersbeschränkungen berücksichtigen

**Berichte:**
- Wurfstatistiken pro Hündin
- Zuchterfolg-Analysen
- Zuchtbuch-Export

### Beispiel-Daten

**Hündin "Luna" mit drei Würfen:**
```json
{
  "id": "luna-uuid",
  "name": "Luna",
  "gender": "FEMALE",
  "offspring": [
    {
      "id": "max-a-uuid",
      "name": "Max A",
      "litterNumber": "A",
      "birthDate": "2020-03-15"
    },
    {
      "id": "bella-a-uuid", 
      "name": "Bella A",
      "litterNumber": "A",
      "birthDate": "2020-03-15"
    },
    {
      "id": "rocky-b-uuid",
      "name": "Rocky B", 
      "litterNumber": "B",
      "birthDate": "2021-05-20"
    },
    {
      "id": "luna-b-uuid",
      "name": "Luna B",
      "litterNumber": "B", 
      "birthDate": "2021-05-20"
    }
  ]
}
```

**Wurfstatistik:**
- A-Wurf: 2 Welpen (2020-03-15)
- B-Wurf: 2 Welpen (2021-05-20)
- Pause zwischen Würfen: 431 Tage

## Todesdatum-Funktionalität

### Zweck des Todesdatums
Das `deathDate`-Feld dokumentiert das Todesdatum eines Hundes. Dies ist wichtig für die vollständige Lebensdokumentation und für statistische Auswertungen.

### Datenvalidierung

**Zeitliche Validierung:**
- DeathDate darf nicht in der Zukunft liegen
- DeathDate muss nach BirthDate liegen
- Optional (kein Pflichtfeld)

**Logische Validierung:**
- Ein Hund kann nicht vor seiner Geburt gestorben sein
- Todesdatum muss realistisch sein

### Anwendungsfälle

**Lebensdokumentation:**
- Vollständige Lebensgeschichte eines Hundes
- Altersberechnung bei Tod
- Lebenserwartung-Analysen

**Statistische Auswertungen:**
- Durchschnittliche Lebenserwartung
- Altersverteilung bei Tod
- Vergleich verschiedener Linien

**Zuchtplanung:**
- Berücksichtigung verstorbener Hunde
- Historische Zuchtlinien
- Erbgesundheits-Analysen

### Abfragebeispiele

**Lebensdauer berechnen:**
```sql
SELECT name, 
       birthDate,
       deathDate,
       DATEDIFF(deathDate, birthDate) / 365.25 as lebensdauerJahre
FROM dogs 
WHERE deathDate IS NOT NULL
ORDER BY lebensdauerJahre DESC;
```

**Durchschnittliche Lebenserwartung:**
```sql
SELECT gender,
       AVG(DATEDIFF(deathDate, birthDate) / 365.25) as durchschnittlicheLebensdauer,
       COUNT(*) as anzahlVerstorbene
FROM dogs 
WHERE deathDate IS NOT NULL
GROUP BY gender;
```

**Aktuelle Hunde (lebend):**
```sql
SELECT name, 
       birthDate,
       DATEDIFF(CURDATE(), birthDate) / 365.25 as aktuellesAlter
FROM dogs 
WHERE deathDate IS NULL
ORDER BY birthDate DESC;
```

**Verstorbene Hunde nach Jahr:**
```sql
SELECT YEAR(deathDate) as todesjahr,
       COUNT(*) as anzahlVerstorbene,
       AVG(DATEDIFF(deathDate, birthDate) / 365.25) as durchschnittsalter
FROM dogs 
WHERE deathDate IS NOT NULL
GROUP BY YEAR(deathDate)
ORDER BY todesjahr DESC;
```

### Integration in die Anwendung

**Hundeprofil:**
- Anzeige des Todesdatums (falls vorhanden)
- Lebensdauer-Berechnung
- Status: "Lebend" oder "Verstorben"

**Statistik-Dashboard:**
- Lebenserwartung-Statistiken
- Altersverteilung bei Tod
- Vergleich verschiedener Linien

**Zuchtplanung:**
- Berücksichtigung verstorbener Hunde
- Historische Analysen
- Erbgesundheits-Bewertungen

### Beispiel-Daten

**Lebender Hund:**
```json
{
  "id": "max-uuid",
  "name": "Max",
  "birthDate": "2020-05-15",
  "deathDate": null,
  "isActive": true
}
```

**Verstorbener Hund:**
```json
{
  "id": "luna-uuid",
  "name": "Luna",
  "birthDate": "2015-03-10",
  "deathDate": "2023-11-20",
  "isActive": false
}
```

**Lebensdauer:**
- Luna lebte 8 Jahre, 8 Monate und 10 Tage
- Alter bei Tod: 8.7 Jahre

### Business Rules

**Status-Logik:**
- `deathDate` ist null → Hund ist lebend
- `deathDate` ist gesetzt → Hund ist verstorben
- `isActive` sollte automatisch auf `false` gesetzt werden, wenn `deathDate` gesetzt wird

**Zuchtplanung:**
- Verstorbene Hunde können nicht für Zucht verwendet werden
- Historische Daten bleiben für Analysen verfügbar
- Stammbaum-Darstellung zeigt Lebensstatus

## Medizinische Befunde (Medical Findings)

### Zweck der MedicalFinding-Entität
Die MedicalFinding-Entität ermöglicht es, beliebig viele medizinische Befunde pro Hund zu speichern. Dies ist eine Ergänzung zu den HealthRecord-Daten und dient der detaillierten Dokumentation von Untersuchungsergebnissen.

### Felder der MedicalFinding-Entität

**Grunddaten:**
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key zu Dog)
- `date`: Date (Datum des Befunds)
- `shortDescription`: String (Kurzbezeichnung, max 100 Zeichen)
- `remarks`: Text (Bemerkungen, optional)
- `createdAt`: DateTime (Erstellungsdatum)
- `updatedAt`: DateTime (Letzte Änderung)

### Anwendungsfälle für Medical Findings

**Untersuchungsergebnisse:**
- Blutuntersuchungen
- Röntgenbefunde
- Ultraschalluntersuchungen
- Gentests
- Augenuntersuchungen
- Hüftgelenksuntersuchungen (HD)
- Ellenbogengelenksuntersuchungen (ED)

**Beispiel-Befunde:**
- "HD-A: Normal"
- "ED-0: Frei"
- "PRA: Negativ"
- "Blutbild: Unauffällig"
- "Herzultraschall: Normal"

### Unterschied zu Health Records

**Health Records:**
- Strukturierte Gesundheitsdaten
- Impfungen, Untersuchungen, Behandlungen
- Mit Ablaufdaten und Dokumenten
- Für administrative Zwecke

**Medical Findings:**
- Freie Befunddokumentation
- Untersuchungsergebnisse und Diagnosen
- Ohne Ablaufdaten
- Für medizinische Dokumentation

### Datenvalidierung

**Pflichtfelder:**
- `date`: Muss gesetzt sein und darf nicht in der Zukunft liegen
- `shortDescription`: Muss gesetzt sein und max 100 Zeichen haben

**Optionale Felder:**
- `remarks`: Kann leer sein für detaillierte Beschreibungen

### Performance-Optimierung

**Indizes:**
```sql
-- Für schnelle Befundabfragen pro Hund
CREATE INDEX idx_medical_findings_dog_id ON medical_findings(dogId);

-- Für chronologische Sortierung
CREATE INDEX idx_medical_findings_date ON medical_findings(date);

-- Für Suche nach Befundtyp
CREATE INDEX idx_medical_findings_short_desc ON medical_findings(shortDescription);
```

### Abfragebeispiele

**Alle Befunde eines Hundes:**
```sql
SELECT date, shortDescription, remarks
FROM medical_findings
WHERE dogId = ?
ORDER BY date DESC;
```

**Befunde nach Typ suchen:**
```sql
SELECT d.name, mf.date, mf.shortDescription
FROM medical_findings mf
JOIN dogs d ON mf.dogId = d.id
WHERE mf.shortDescription LIKE '%HD%'
ORDER BY mf.date DESC;
```

**Befunde im Zeitraum:**
```sql
SELECT date, shortDescription, remarks
FROM medical_findings
WHERE dogId = ?
  AND date BETWEEN ? AND ?
ORDER BY date DESC;
```

### Access Control für Medical Findings

**Berechtigungen:**
- **BREEDER/STUD_OWNER**: Können nur Befunde ihrer eigenen Hunde verwalten
- **MEMBER**: Können nur Befunde ihrer eigenen Hunde anzeigen
- **EDITOR**: Können alle Befunde anzeigen und bearbeiten (aber nicht löschen)
- **ADMIN**: Können alle Befunde verwalten
- **Öffentlich**: Kein Zugriff auf Befunde

### Integration in die Anwendung

**Hundeprofil:**
- Befunde werden chronologisch angezeigt
- Suchfunktion nach Befundtyp
- Export-Funktion für Tierarztbesuche

**Stammbaum-Analyse:**
- Befunde können für genetische Analysen verwendet werden
- Vererbung von Gesundheitsmerkmalen verfolgen
- Zuchtplanung basierend auf Befunden

## Auszeichnungen (Awards)

### Zweck der Award-Entität
Die Award-Entität ermöglicht es, beliebig viele Auszeichnungen, Titel und Erfolge pro Hund zu dokumentieren. Dies ist wichtig für die Bewertung der Qualität und des Erfolgs von Zuchthunden.

### Felder der Award-Entität

**Grunddaten:**
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key zu Dog)
- `code`: String (Code der Auszeichnung, max 50 Zeichen)
- `date`: Date (Datum der Auszeichnung, optional)
- `description`: String (Beschreibung der Auszeichnung, max 200 Zeichen)
- `issuer`: String (Aussteller der Auszeichnung, max 100 Zeichen)
- `createdAt`: DateTime (Erstellungsdatum)
- `updatedAt`: DateTime (Letzte Änderung)

### Anwendungsfälle für Awards

**Zuchttitel:**
- VDH-Champion
- Internationaler Champion
- Jugendchampion
- Zuchtrichter-Titel

**Ausstellungsauszeichnungen:**
- CAC (Certificat d'Aptitude au Championnat)
- CACIB (Certificat d'Aptitude au Championnat International de Beauté)
- BOB (Best of Breed)
- BIS (Best in Show)

**Arbeitsprüfungen:**
- SchH (Schutzhund)
- IPO (Internationale Prüfungsordnung)
- VPG (Vielseitigkeitsprüfung für Gebrauchshunde)
- Rettungshundeprüfungen

**Beispiel-Auszeichnungen:**
- Code: "VDH-CH", Description: "VDH Champion", Issuer: "VDH"
- Code: "CACIB", Description: "CACIB Ausstellung München", Issuer: "FCI"
- Code: "SchH3", Description: "Schutzhundprüfung Stufe 3", Issuer: "SV"

### Datenvalidierung

**Pflichtfelder:**
- `code`: Muss gesetzt sein und max 50 Zeichen haben
- `description`: Muss gesetzt sein und max 200 Zeichen haben
- `issuer`: Muss gesetzt sein und max 100 Zeichen haben

**Optionale Felder:**
- `date`: Kann leer sein für Auszeichnungen ohne spezifisches Datum

### Performance-Optimierung

**Indizes:**
```sql
-- Für schnelle Auszeichnungsabfragen pro Hund
CREATE INDEX idx_awards_dog_id ON awards(dogId);

-- Für Suche nach Auszeichnungscode
CREATE INDEX idx_awards_code ON awards(code);

-- Für chronologische Sortierung
CREATE INDEX idx_awards_date ON awards(date);

-- Für Suche nach Aussteller
CREATE INDEX idx_awards_issuer ON awards(issuer);
```

### Abfragebeispiele

**Alle Auszeichnungen eines Hundes:**
```sql
SELECT code, date, description, issuer
FROM awards
WHERE dogId = ?
ORDER BY date DESC, code;
```

**Auszeichnungen nach Typ suchen:**
```sql
SELECT d.name, a.code, a.description, a.date, a.issuer
FROM awards a
JOIN dogs d ON a.dogId = d.id
WHERE a.code LIKE '%CH%'
ORDER BY a.date DESC;
```

**Auszeichnungen nach Aussteller:**
```sql
SELECT d.name, a.code, a.description, a.date
FROM awards a
JOIN dogs d ON a.dogId = d.id
WHERE a.issuer = 'VDH'
ORDER BY a.date DESC;
```

**Hunde mit bestimmten Auszeichnungen:**
```sql
SELECT DISTINCT d.name, d.gender, d.birthDate
FROM dogs d
JOIN awards a ON d.id = a.dogId
WHERE a.code = 'VDH-CH'
ORDER BY d.name;
```

### Access Control für Awards

**Berechtigungen:**
- **BREEDER/STUD_OWNER**: Können nur Auszeichnungen ihrer eigenen Hunde verwalten
- **MEMBER**: Können nur Auszeichnungen ihrer eigenen Hunde anzeigen
- **EDITOR**: Können alle Auszeichnungen anzeigen und bearbeiten (aber nicht löschen)
- **ADMIN**: Können alle Auszeichnungen verwalten
- **Öffentlich**: Kein Zugriff auf Auszeichnungen

### Integration in die Anwendung

**Hundeprofil:**
- Auszeichnungen werden chronologisch oder nach Kategorie angezeigt
- Suchfunktion nach Auszeichnungstyp
- Export-Funktion für Zuchtpapiere

**Zuchtplanung:**
- Auszeichnungen können für Zuchtentscheidungen verwendet werden
- Erfolgreiche Linien identifizieren
- Qualitätsbewertung von Zuchthunden

**Öffentliche Suche:**
- Hunde nach Auszeichnungen filtern
- Champion-Hunde hervorheben
- Erfolgreiche Zuchtlinien anzeigen

### Auszeichnungscodes (Beispiele)

**Zuchttitel:**
- `VDH-CH`: VDH Champion
- `INT-CH`: Internationaler Champion
- `JUG-CH`: Jugendchampion
- `ZR`: Zuchtrichter

**Ausstellungsauszeichnungen:**
- `CAC`: Certificat d'Aptitude au Championnat
- `CACIB`: CACIB International
- `BOB`: Best of Breed
- `BIS`: Best in Show

**Arbeitsprüfungen:**
- `SchH1`: Schutzhundprüfung Stufe 1
- `SchH2`: Schutzhundprüfung Stufe 2
- `SchH3`: Schutzhundprüfung Stufe 3
- `IPO1`: IPO Stufe 1
- `IPO2`: IPO Stufe 2
- `IPO3`: IPO Stufe 3

## Genetische Untersuchungen (Genetic Tests)

### Zweck der GeneticTest-Entität
Die GeneticTest-Entität ermöglicht es, genetische Untersuchungsergebnisse für die Zuchtplanung zu dokumentieren. Diese sind essentiell für verantwortungsvolle Zucht und die Vermeidung von Erbkrankheiten.

### Felder der GeneticTest-Entität

**Grunddaten:**
- `id`: UUID (Primary Key)
- `dogId`: UUID (Foreign Key zu Dog)
- `testType`: Enum (HD, ED, PRA, DM, VWD, OTHER)
- `testDate`: Date (Datum der Untersuchung)
- `result`: Enum (NORMAL, CARRIER, AFFECTED, UNKNOWN)
- `laboratory`: String (Labor, das die Untersuchung durchgeführt hat, max 100 Zeichen)
- `certificateNumber`: String (Zertifikatsnummer, optional, max 50 Zeichen)
- `notes`: Text (Zusätzliche Bemerkungen, optional)
- `createdAt`: DateTime (Erstellungsdatum)
- `updatedAt`: DateTime (Letzte Änderung)

### Genetische Testtypen

**HD (Hüftgelenksdysplasie):**
- Röntgenologische Untersuchung der Hüftgelenke
- Bewertung: A1, A2, B1, B2, C, D, E
- Wichtig für Zuchtfreigabe

**ED (Ellenbogengelenksdysplasie):**
- Röntgenologische Untersuchung der Ellenbogengelenke
- Bewertung: 0 (frei), 1 (leicht), 2 (mittel), 3 (schwer)
- Wichtig für Zuchtfreigabe

**PRA (Progressive Retina Atrophie):**
- Gentest auf erbliche Augenerkrankung
- Result: NORMAL, CARRIER, AFFECTED
- Wichtig für Zuchtplanung

**DM (Degenerative Myelopathie):**
- Gentest auf neurologische Erkrankung
- Result: NORMAL, CARRIER, AFFECTED
- Wichtig für Zuchtplanung

**VWD (Von-Willebrand-Krankheit):**
- Gentest auf Blutgerinnungsstörung
- Result: NORMAL, CARRIER, AFFECTED
- Wichtig für Zuchtplanung

### Testergebnisse

**NORMAL:**
- Hund ist frei von der getesteten Erkrankung
- Kann für Zucht verwendet werden

**CARRIER:**
- Hund trägt das Gen, ist aber nicht erkrankt
- Kann für Zucht verwendet werden, aber nur mit NORMAL-Partnern

**AFFECTED:**
- Hund ist von der Erkrankung betroffen
- Sollte nicht für Zucht verwendet werden

**UNKNOWN:**
- Testergebnis ist unklar oder nicht verfügbar
- Weitere Tests erforderlich

### Datenvalidierung

**Pflichtfelder:**
- `testType`: Muss gültiger Enum-Wert sein
- `testDate`: Muss gesetzt sein und darf nicht in der Zukunft liegen
- `result`: Muss gültiger Enum-Wert sein
- `laboratory`: Muss gesetzt sein und max 100 Zeichen haben

**Optionale Felder:**
- `certificateNumber`: Kann leer sein, max 50 Zeichen
- `notes`: Kann leer sein für zusätzliche Informationen

### Performance-Optimierung

**Indizes:**
```sql
-- Für schnelle Gentest-Abfragen pro Hund
CREATE INDEX idx_genetic_tests_dog_id ON genetic_tests(dogId);

-- Für Suche nach Testtyp
CREATE INDEX idx_genetic_tests_test_type ON genetic_tests(testType);

-- Für chronologische Sortierung
CREATE INDEX idx_genetic_tests_test_date ON genetic_tests(testDate);

-- Für Suche nach Ergebnis
CREATE INDEX idx_genetic_tests_result ON genetic_tests(result);

-- Für Suche nach Labor
CREATE INDEX idx_genetic_tests_laboratory ON genetic_tests(laboratory);
```

### Abfragebeispiele

**Alle Gentests eines Hundes:**
```sql
SELECT testType, testDate, result, laboratory, certificateNumber
FROM genetic_tests
WHERE dogId = ?
ORDER BY testDate DESC, testType;
```

**Hunde mit bestimmten Testergebnissen:**
```sql
SELECT d.name, d.gender, gt.testType, gt.result, gt.testDate
FROM dogs d
JOIN genetic_tests gt ON d.id = gt.dogId
WHERE gt.testType = 'HD' AND gt.result = 'NORMAL'
ORDER BY gt.testDate DESC;
```

**Zuchtplanung - Kompatible Partner finden:**
```sql
-- Hunde mit HD-A Ergebnis für Zucht
SELECT d.name, d.gender, d.birthDate
FROM dogs d
JOIN genetic_tests gt ON d.id = gt.dogId
WHERE gt.testType = 'HD'
  AND gt.result IN ('NORMAL', 'CARRIER')
  AND d.gender = 'MALE'  -- Für Deckrüden
ORDER BY d.name;
```

**Vererbungsanalyse:**
```sql
-- Nachkommen eines Hundes mit Gentests
SELECT d.name, d.gender, d.birthDate,
       gt.testType, gt.result, gt.testDate
FROM dogs d
JOIN genetic_tests gt ON d.id = gt.dogId
WHERE d.motherId = ? OR d.fatherId = ?
ORDER BY d.birthDate DESC, gt.testType;
```

### Access Control für Genetic Tests

**Berechtigungen:**
- **BREEDER/STUD_OWNER**: Können Gentests ihrer eigenen Hunde verwalten, können Gentests anderer Hunde für Zuchtplanung einsehen
- **MEMBER**: Können nur Gentests ihrer eigenen Hunde anzeigen
- **EDITOR**: Können alle Gentests anzeigen und bearbeiten (aber nicht löschen)
- **ADMIN**: Können alle Gentests verwalten
- **Öffentlich**: Kein Zugriff auf Gentests

### Integration in die Anwendung

**Hundeprofil:**
- Gentests werden nach Testtyp gruppiert angezeigt
- Chronologische Darstellung der Testergebnisse
- Export-Funktion für Zuchtpapiere

**Zuchtplanung:**
- Kompatibilitätsprüfung zwischen Zuchtpartnern
- Warnung bei inkompatiblen Kombinationen
- Empfehlungen für optimale Zuchtpaarungen

**Stammbaum-Analyse:**
- Vererbungsmuster von genetischen Merkmalen
- Risikobewertung für Nachkommen
- Langzeit-Trends in der Zuchtlinie

**Öffentliche Suche:**
- Filter nach Gentestergebnissen
- Anzeige von zuchtfreien Hunden
- Qualitätsbewertung für Zuchthunde

### Zuchtplanungsregeln

**HD/ED-Kombinationen:**
- NORMAL + NORMAL = Empfohlen
- NORMAL + CARRIER = Akzeptabel
- CARRIER + CARRIER = Vermeiden
- AFFECTED + beliebig = Nicht empfohlen

**PRA/DM/VWD-Kombinationen:**
- NORMAL + NORMAL = Empfohlen
- NORMAL + CARRIER = Akzeptabel
- CARRIER + CARRIER = Vermeiden
- AFFECTED + beliebig = Nicht empfohlen

### Genetische Divergenz in der Zuchtplanung

**Zweck der genetischen Divergenz:**
Die genetische Divergenz misst den Grad der genetischen Unterschiedlichkeit zwischen zwei Zuchtpartnern. Sie ist entscheidend für die Erhaltung der genetischen Vielfalt und die Vermeidung von Inzucht.

**Berechnung der genetischen Divergenz:**
- **Koeffizient der Verwandtschaft (COI - Coefficient of Inbreeding)**
- **Genetische Distanz basierend auf gemeinsamen Vorfahren**
- **Anzahl der Generationen bis zum letzten gemeinsamen Vorfahren**

**Empfohlene Divergenz-Werte:**

**Optimale Zuchtpaarung:**
- COI < 6.25% (mindestens 4 Generationen Abstand)
- Genetische Distanz > 0.8
- Keine gemeinsamen Vorfahren in den letzten 3 Generationen

**Akzeptable Zuchtpaarung:**
- COI zwischen 6.25% und 12.5% (3-4 Generationen Abstand)
- Genetische Distanz zwischen 0.6 und 0.8
- Maximal 1 gemeinsamer Vorfahre in den letzten 3 Generationen

**Kritische Zuchtpaarung:**
- COI > 12.5% (weniger als 3 Generationen Abstand)
- Genetische Distanz < 0.6
- Mehrere gemeinsame Vorfahren in den letzten 3 Generationen
- **Nicht empfohlen für Zucht**

**Zuchtplanungsalgorithmus:**

```sql
-- Berechnung der genetischen Divergenz zwischen zwei Hunden
WITH RECURSIVE common_ancestors AS (
  -- Direkte Eltern
  SELECT d1.id as dog1, d2.id as dog2, 1 as generation
  FROM dogs d1, dogs d2
  WHERE (d1.motherId = d2.motherId OR d1.fatherId = d2.fatherId)
    AND d1.id != d2.id

  UNION ALL

  -- Indirekte Vorfahren
  SELECT ca.dog1, ca.dog2, ca.generation + 1
  FROM common_ancestors ca
  JOIN dogs d1 ON ca.dog1 = d1.id
  JOIN dogs d2 ON ca.dog2 = d2.id
  WHERE ca.generation < 5  -- Maximal 5 Generationen
    AND ((d1.motherId = d2.motherId OR d1.fatherId = d2.fatherId)
         OR (d1.motherId = d2.fatherId OR d1.fatherId = d2.motherId))
)
SELECT dog1, dog2, MIN(generation) as closest_relationship
FROM common_ancestors
GROUP BY dog1, dog2;
```

**Zuchtempfehlungen basierend auf genetischer Divergenz:**

**Sehr empfehlenswert:**
- COI < 3.125% (5+ Generationen Abstand)
- Genetische Distanz > 0.9
- Keine gemeinsamen Vorfahren in den letzten 5 Generationen
- **Beste genetische Vielfalt**

**Empfehlenswert:**
- COI zwischen 3.125% und 6.25% (4-5 Generationen Abstand)
- Genetische Distanz zwischen 0.8 und 0.9
- Maximal 1 gemeinsamer Vorfahre in den letzten 4 Generationen
- **Gute genetische Vielfalt**

**Akzeptabel:**
- COI zwischen 6.25% und 12.5% (3-4 Generationen Abstand)
- Genetische Distanz zwischen 0.6 und 0.8
- Maximal 2 gemeinsame Vorfahren in den letzten 3 Generationen
- **Moderate genetische Vielfalt**

**Nicht empfohlen:**
- COI > 12.5% (weniger als 3 Generationen Abstand)
- Genetische Distanz < 0.6
- Mehrere gemeinsame Vorfahren in den letzten 3 Generationen
- **Risiko für Inzuchtdepression**

**Warnsystem für Zuchtplanung:**

**Grüne Ampel (Empfohlen):**
- Genetische Divergenz optimal
- Alle Gentests in Ordnung
- Keine bekannten Erbkrankheiten

**Gelbe Ampel (Vorsicht):**
- Genetische Divergenz grenzwertig
- Einige Gentests mit CARRIER-Status
- Bekannte Erbkrankheiten in der Linie

**Rote Ampel (Nicht empfohlen):**
- Genetische Divergenz zu gering
- Kritische Gentest-Kombinationen
- Mehrere Erbkrankheiten in der Linie

**Integration in die Anwendung:**

**Zuchtpartner-Suche:**
- Filter nach genetischer Divergenz
- Sortierung nach Divergenz-Score
- Warnung bei zu geringer Divergenz

**Stammbaum-Analyse:**
- Visualisierung der genetischen Verwandtschaft
- COI-Berechnung für geplante Paarungen
- Empfehlungen für optimale Partner

**Zuchtplanung:**
- Automatische Bewertung von Zuchtpaarungen
- Empfehlungen basierend auf genetischer Divergenz
- Warnung vor Inzucht-Risiken

### Labor-Integration

**Bekannte Labore:**
- Laboklin (Deutschland)
- VHL Genetics (Niederlande)
- Optigen (USA)
- Animal Genetics (UK)
- Genomia (Tschechien)
- Feragen (Deutschland)

**Zertifikatsnummern:**
- Eindeutige Identifikation der Testergebnisse
- Verifikation der Authentizität
- Verknüpfung mit Labor-Datenbanken

## REST-API für Datenimport

### Import-Endpoints

**POST /api/v1/import/dogs**
- Import einzelner Hundedaten aus Legacy-Systemen
- Akzeptiert JSON-Objekt mit vollständigen Hundedaten
- Inklusive aller zugehörigen Entitäten (Gesundheitsdaten, Befunde, Auszeichnungen, Gentests)

**POST /api/v1/import/dogs/batch**
- Batch-Import mehrerer Hunde (max. 100 pro Request)
- Effizienter für große Datenmengen
- Detaillierte Rückmeldung über Erfolg/Fehler pro Hund

### Import-Schema (DogImport)

**Grunddaten:**
```json
{
  "name": "Max von Beispiel",
  "gender": "MALE",
  "birthDate": "2020-05-15",
  "color": "Schwarzmarken",
  "microchipId": "123456789012345",
  "pedigreeNumber": "VDH-12345",
  "isStudAvailable": true,
  "description": "Ausgezeichneter Zuchtrüde"
}
```

**Elternverweise (Legacy-IDs):**
```json
{
  "motherId": "legacy_mother_123",
  "fatherId": "legacy_father_456"
}
```

**Gesundheitsdaten:**
```json
{
  "healthRecords": [
    {
      "recordType": "VACCINATION",
      "title": "Grundimmunisierung",
      "description": "Erste Impfung",
      "recordDate": "2020-07-15",
      "expiryDate": "2021-07-15",
      "veterinarian": "Dr. Müller",
      "legacyId": "health_001"
    }
  ]
}
```

**Medizinische Befunde:**
```json
{
  "medicalFindings": [
    {
      "date": "2021-03-10",
      "shortDescription": "HD-A: Normal",
      "remarks": "Röntgenuntersuchung ohne Befund",
      "legacyId": "finding_001"
    }
  ]
}
```

**Auszeichnungen:**
```json
{
  "awards": [
    {
      "code": "VDH-CH",
      "date": "2022-06-15",
      "description": "VDH Champion",
      "issuer": "VDH",
      "legacyId": "award_001"
    }
  ]
}
```

**Genetische Tests:**
```json
{
  "geneticTests": [
    {
      "testType": "HD",
      "testDate": "2021-03-10",
      "result": "NORMAL",
      "laboratory": "Laboklin",
      "certificateNumber": "HD-2021-001",
      "notes": "A1-Bewertung",
      "legacyId": "genetic_001"
    }
  ]
}
```

**Legacy-Metadaten:**
```json
{
  "legacyId": "dog_12345",
  "importSource": "old_database",
  "importDate": "2024-01-15T10:30:00Z"
}
```

### Import-Prozess

**1. Validierung:**
- Schema-Validierung der eingehenden Daten
- Überprüfung der Pflichtfelder
- Validierung der Enum-Werte
- Prüfung der Datenformate

**2. Transformation:**
- Konvertierung von Legacy-IDs zu UUIDs
- Mapping von Legacy-Feldnamen zu neuen Feldnamen
- Normalisierung von Datumsformaten
- Bereinigung von Textdaten

**3. Referenz-Auflösung:**
- Auflösung von Legacy-Eltern-IDs zu neuen UUIDs
- Verknüpfung mit bestehenden Hunden
- Erstellung von Mapping-Tabellen für spätere Referenzen

**4. Persistierung:**
- Transaktionale Speicherung aller Entitäten
- Rollback bei Fehlern
- Generierung neuer UUIDs
- Audit-Trail für Import-Aktivitäten

### Import-Ergebnis

**Erfolgreicher Import:**
```json
{
  "success": true,
  "dogId": "550e8400-e29b-41d4-a716-446655440000",
  "legacyId": "dog_12345",
  "warnings": [
    "Mutter-ID 'legacy_mother_123' nicht gefunden, Verweis entfernt"
  ],
  "errors": [],
  "importedRecords": {
    "healthRecords": 3,
    "medicalFindings": 2,
    "awards": 1,
    "geneticTests": 1
  }
}
```

**Fehlgeschlagener Import:**
```json
{
  "success": false,
  "legacyId": "dog_12345",
  "warnings": [],
  "errors": [
    "Ungültiges Geburtsdatum: 'invalid-date'",
    "Pflichtfeld 'color' fehlt"
  ],
  "importedRecords": {
    "healthRecords": 0,
    "medicalFindings": 0,
    "awards": 0,
    "geneticTests": 0
  }
}
```

### Batch-Import-Ergebnis

```json
{
  "totalProcessed": 50,
  "successful": 45,
  "failed": 5,
  "results": [
    {
      "success": true,
      "dogId": "550e8400-e29b-41d4-a716-446655440000",
      "legacyId": "dog_001"
    },
    {
      "success": false,
      "legacyId": "dog_002",
      "errors": ["Ungültige Daten"]
    }
  ],
  "summary": {
    "totalHealthRecords": 120,
    "totalMedicalFindings": 85,
    "totalAwards": 45,
    "totalGeneticTests": 60
  }
}
```

### Access Control für Import

**Berechtigungen:**
- **ADMIN**: Vollzugriff auf alle Import-Funktionen
- **EDITOR**: Kann Hunde importieren, aber nicht löschen
- **BREEDER/STUD_OWNER**: Können nur ihre eigenen Hunde importieren
- **MEMBER**: Kein Import-Zugriff

### Fehlerbehandlung

**Validierungsfehler:**
- Detaillierte Fehlermeldungen für jedes Feld
- Zeilennummern bei Batch-Import
- Vorschläge für Korrekturen

**Referenz-Fehler:**
- Warnung bei nicht gefundenen Eltern-IDs
- Option zur manuellen Verknüpfung
- Erstellung von Orphan-Records

**Datenkonflikte:**
- Erkennung von Duplikaten
- Merge-Strategien für identische Daten
- Benutzerabfrage bei Konflikten

### Performance-Optimierung

**Batch-Processing:**
- Transaktionale Verarbeitung in Chunks
- Parallele Verarbeitung bei unabhängigen Daten
- Memory-Management für große Datensätze

**Caching:**
- Cache für Legacy-ID-Mappings
- Zwischenspeicherung von Referenzdaten
- Optimierung von Datenbankabfragen

**Monitoring:**
- Fortschrittsanzeige bei Batch-Import
- Logging aller Import-Aktivitäten
- Metriken für Import-Performance
