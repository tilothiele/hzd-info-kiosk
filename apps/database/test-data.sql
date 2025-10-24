-- Vollständige, robuste Neu-Generierung nach aktuellem Schema
-- Wichtig: CamelCase-Spalten in doppelte Anführungszeichen setzen

DO $$ BEGIN RAISE NOTICE 'Seeding started'; END $$;

BEGIN;

-- 1) Bestehende Daten löschen (FK-Reihenfolge)
DELETE FROM "medical_findings";
DELETE FROM "awards";
DELETE FROM "genetic_tests";
DELETE FROM "litters";
DELETE FROM "dogs";
DELETE FROM "user_roles";
DELETE FROM "users";

-- 2) Benutzer (80)
WITH city(plz, city, country) AS (
  VALUES
    ('10115','Berlin','Deutschland'),
    ('20095','Hamburg','Deutschland'),
    ('50667','Köln','Deutschland'),
    ('80331','München','Deutschland'),
    ('70173','Stuttgart','Deutschland'),
    ('60311','Frankfurt','Deutschland'),
    ('01067','Dresden','Deutschland'),
    ('28195','Bremen','Deutschland'),
    ('90402','Nürnberg','Deutschland'),
    ('04109','Leipzig','Deutschland')
), u AS (
  SELECT
    'user-' || LPAD(i::text, 3, '0')               AS id,
    'user' || i::text                              AS username,
    'user' || i::text || '@example.com'            AS email,
    'hash'                                          AS password,
    CASE WHEN i % 2 = 0 THEN 'Max' ELSE 'Anna' END  AS "firstName",
    'Mustermann'                                    AS "lastName",
    CASE WHEN i % 5 = 0 THEN 'HZD-' || LPAD(i::text, 3, '0') ELSE NULL END AS "memberNumber",
    CASE WHEN i % 4 = 0 THEN (DATE '2018-01-01' + (i||' days')::interval) ELSE NULL END AS "memberSince",
    CASE WHEN i % 4 = 0 THEN 'vom Kennel ' || i::text ELSE NULL END AS "kennelName",
    'https://example.com/user/' || i::text          AS website,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' AS "avatarUrl",
    'Musterstraße ' || (i % 50 + 1)                 AS address,
    c.city,
    c.plz                                           AS "postalCode",
    c.country,
    NOW()                                           AS "createdAt",
    NOW()                                           AS "updatedAt"
  FROM generate_series(1,80) AS g(i)
  JOIN LATERAL (SELECT * FROM city OFFSET ((i-1) % 10) LIMIT 1) AS c ON TRUE
)
INSERT INTO "users" ("id","username","email","password","firstName","lastName","memberNumber","memberSince","kennelName","website","avatarUrl","address","city","postalCode","country","createdAt","updatedAt")
SELECT id, username, email, password, "firstName", "lastName", "memberNumber", "memberSince", "kennelName", website, "avatarUrl", address, city, "postalCode", country, "createdAt", "updatedAt"
FROM u;

-- 3) Hunde (110): 55 Hündinnen (15 Zucht), 55 Rüden (10 Deckrüden)
WITH d AS (
  SELECT
    'dog-' || LPAD(i::text, 3, '0') AS id,
    CASE WHEN i <= 55 THEN 'H' ELSE 'R' END AS gender,
    'Hund ' || i::text AS name,
    (DATE '2018-01-01' + (i*10 || ' days')::interval) AS "birthDate",
    NULL::date AS "deathDate",
    CASE (i % 3) WHEN 0 THEN 'Schwarz' WHEN 1 THEN 'Blond' ELSE 'Schwarzmarken' END AS color,
    'DE' || LPAD(i::text, 15, '0') AS "microchipId",
    'HZD-' || LPAD(i::text, 4, '0') AS "pedigreeNumber",
    'https://picsum.photos/seed/dog' || i::text || '/300/300' AS "avatarUrl",
    (SELECT id FROM "users" ORDER BY id LIMIT 1 OFFSET ((i-1) % 80)) AS "xownerId",
    CASE WHEN i <= 15 THEN 'WURF_VORHANDEN' ELSE NULL END AS "breedingStatus",
    CASE WHEN i > 55 AND i <= 65 THEN TRUE ELSE FALSE END AS "isStudAvailable",
    'https://example.com/dog/' || i::text AS website,
    'Automatisch generierter Testhund ' || i::text AS description,
    NOW() AS "createdAt",
    NOW() AS "updatedAt"
  FROM generate_series(1,110) AS g(i)
)
INSERT INTO "dogs" ("id","name","gender","birthDate","deathDate","color","microchipId","pedigreeNumber","avatarUrl","ownerId","motherId","fatherId","litterNumber","breedingStatus","website","description","createdAt","updatedAt")
SELECT id, name, gender, "birthDate", "deathDate", color, "microchipId", "pedigreeNumber", "avatarUrl", "xownerId", NULL, NULL, NULL, "breedingStatus", website, description, "createdAt", "updatedAt"
FROM d;

-- 4) Rollen zuweisen
INSERT INTO "user_roles" ("id","userId","role","assignedAt")
SELECT 'role-breeder-' || u.id, u.id, 'BREEDER', NOW()
FROM (
  SELECT DISTINCT "ownerId" AS id FROM "dogs" WHERE gender = 'H' AND "breedingStatus" IS NOT NULL
) AS u
ON CONFLICT DO NOTHING;

INSERT INTO "user_roles" ("id","userId","role","assignedAt")
SELECT 'role-stud-' || u.id, u.id, 'STUD_OWNER', NOW()
FROM (
  SELECT DISTINCT "ownerId" AS id FROM "dogs" WHERE gender = 'R' AND "isStudAvailable" = TRUE
) AS u
ON CONFLICT DO NOTHING;

-- 5) 20 Würfe: Mutter aus 15 Zuchthündinnen; Vater aus 10 Deckrüden; Züchterin = Besitzerin der Mutter
WITH mothers AS (
  SELECT id, "ownerId", ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM "dogs"
  WHERE gender = 'H' AND "breedingStatus" IS NOT NULL
  LIMIT 15
), studs AS (
  SELECT id, "ownerId", ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM "dogs"
  WHERE gender = 'R' AND "isStudAvailable" = TRUE
  LIMIT 10
), lit AS (
  SELECT
    'litter-' || LPAD(i::text, 3, '0') AS id,
    'W-2025-' || LPAD(i::text, 3, '0') AS "litterNumber",
    CASE WHEN i % 3 = 1 THEN 'A-Wurf' WHEN i % 3 = 2 THEN 'B-Wurf' ELSE 'C-Wurf' END AS "litterSequence",
    (SELECT id FROM mothers ORDER BY rn LIMIT 1 OFFSET ((i-1) % 15)) AS "motherId",
    (SELECT id FROM studs ORDER BY rn LIMIT 1 OFFSET ((i-1) % 10)) AS "fatherId",
    (SELECT "ownerId" FROM mothers ORDER BY rn LIMIT 1 OFFSET ((i-1) % 15)) AS "breederId",
    (DATE '2025-06-01' + ((i*7) || ' days')::interval) AS "plannedDate",
    (DATE '2025-07-01' + ((i*7) || ' days')::interval) AS "expectedDate",
    CASE WHEN i % 2 = 0 THEN (DATE '2025-07-01' + ((i*7-3) || ' days')::interval) ELSE NULL END AS "actualDate",
    CASE
      WHEN i % 4 = 0 THEN 'BORN'
      WHEN i % 4 = 1 THEN 'PLANNED'
      WHEN i % 4 = 2 THEN 'CLOSED'
      ELSE 'CANCELLED'
    END AS status,
    CASE WHEN i % 2 = 0 THEN NULL ELSE 6 + (i % 3) END AS "expectedPuppies",
    CASE WHEN i % 2 = 0 THEN 5 + (i % 3) ELSE NULL END AS "actualPuppies",
    'Automatisch generierter Wurf ' || i::text AS description,
    TRUE AS "isPublic",
    'kontakt+' || i::text || '@example.com, +49 30 12345' AS "contactInfo",
    1200 + (i % 4) * 100 AS price,
    NULL::text AS location,
    CASE WHEN i % 2 = 0 THEN 7.2 + (i % 5) ELSE NULL END AS av,
    CASE WHEN i % 2 = 0 THEN 3.1 + (i % 4) ELSE NULL END AS iz,
    NULL::json AS "puppyColors",
    -- Fellfarben-Attribute (nur für BORN und CLOSED)
    CASE WHEN i % 4 = 0 OR i % 4 = 2 THEN 1 + (i % 3) ELSE NULL END AS "blackmarkenBorn",
    CASE WHEN i % 4 = 0 OR i % 4 = 2 THEN (i % 2) ELSE NULL END AS "blackmarkenAvailable",
    CASE WHEN i % 4 = 0 OR i % 4 = 2 THEN 1 + (i % 2) ELSE NULL END AS "blackBorn",
    CASE WHEN i % 4 = 0 OR i % 4 = 2 THEN (i % 2) ELSE NULL END AS "blackAvailable",
    CASE WHEN i % 4 = 0 OR i % 4 = 2 THEN 1 + (i % 2) ELSE NULL END AS "blondBorn",
    CASE WHEN i % 4 = 0 OR i % 4 = 2 THEN (i % 2) ELSE NULL END AS "blondAvailable",
    NOW() AS "createdAt",
    NOW() AS "updatedAt"
  FROM generate_series(1,20) AS g(i)
)
INSERT INTO "litters" ("id","litterNumber","litterSequence","motherId","fatherId","breederId","plannedDate","expectedDate","actualDate","status","expectedPuppies","actualPuppies","description","isPublic","contactInfo","price","location","av","iz","puppyColors","blackmarkenBorn","blackmarkenAvailable","blackBorn","blackAvailable","blondBorn","blondAvailable","createdAt","updatedAt")
SELECT * FROM lit;

-- Zusätzliche Würfe mit verschiedenen Status und Fellfarben
INSERT INTO "litters" ("id","litterNumber","litterSequence","motherId","fatherId","breederId","plannedDate","expectedDate","actualDate","status","expectedPuppies","actualPuppies","description","isPublic","contactInfo","price","location","av","iz","puppyColors","blackmarkenBorn","blackmarkenAvailable","blackBorn","blackAvailable","blondBorn","blondAvailable","createdAt","updatedAt")
VALUES
  ('litter-021', 'W-2025-021', 'A-Wurf', (SELECT id FROM "dogs" WHERE gender = 'H' LIMIT 1), (SELECT id FROM "dogs" WHERE gender = 'R' LIMIT 1), (SELECT "ownerId" FROM "dogs" WHERE gender = 'H' LIMIT 1), '2025-08-01', '2025-09-01', '2025-08-28', 'BORN', NULL, 6, 'Wurf mit geborenen Welpen', TRUE, 'kontakt@example.com, +49 30 12345', 1500, 'Berlin', 8.5, 4.2, NULL, 2, 1, 2, 1, 2, 1, NOW(), NOW()),
  ('litter-022', 'W-2025-022', 'B-Wurf', (SELECT id FROM "dogs" WHERE gender = 'H' LIMIT 1 OFFSET 1), (SELECT id FROM "dogs" WHERE gender = 'R' LIMIT 1 OFFSET 1), (SELECT "ownerId" FROM "dogs" WHERE gender = 'H' LIMIT 1 OFFSET 1), '2025-08-15', '2025-09-15', '2025-09-10', 'CLOSED', NULL, 5, 'Wurf mit geschlossenen Welpen', TRUE, 'kontakt2@example.com, +49 30 12346', 1400, 'München', 7.8, 3.5, NULL, 1, 0, 3, 2, 1, 0, NOW(), NOW());

-- Auszeichnungen (Awards) für Hunde
INSERT INTO "awards" ("id", "dogId", "code", "date", "description", "issuer", "createdAt", "updatedAt")
VALUES
  -- Auszeichnungen für die ersten 10 Hunde
  ('award-001', (SELECT id FROM "dogs" LIMIT 1), 'V1', '2023-05-15', 'Vorzüglich', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-002', (SELECT id FROM "dogs" LIMIT 1), 'SG', '2023-08-20', 'Sehr Gut', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-003', (SELECT id FROM "dogs" LIMIT 1), 'BH', '2023-03-10', 'Begleithund', 'VDH', NOW(), NOW()),

  ('award-004', (SELECT id FROM "dogs" LIMIT 1 OFFSET 1), 'V1', '2023-06-12', 'Vorzüglich', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-005', (SELECT id FROM "dogs" LIMIT 1 OFFSET 1), 'IPO1', '2023-09-05', 'IPO 1', 'VDH', NOW(), NOW()),

  ('award-006', (SELECT id FROM "dogs" LIMIT 1 OFFSET 2), 'SG', '2023-07-18', 'Sehr Gut', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-007', (SELECT id FROM "dogs" LIMIT 1 OFFSET 2), 'BH', '2023-04-22', 'Begleithund', 'VDH', NOW(), NOW()),
  ('award-008', (SELECT id FROM "dogs" LIMIT 1 OFFSET 2), 'RettHund', '2023-11-30', 'Rettungshund', 'DRK', NOW(), NOW()),

  ('award-009', (SELECT id FROM "dogs" LIMIT 1 OFFSET 3), 'V1', '2023-05-08', 'Vorzüglich', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-010', (SELECT id FROM "dogs" LIMIT 1 OFFSET 3), 'IPO2', '2023-10-15', 'IPO 2', 'VDH', NOW(), NOW()),
  ('award-011', (SELECT id FROM "dogs" LIMIT 1 OFFSET 3), 'SchH1', '2023-12-03', 'Schutzhund 1', 'VDH', NOW(), NOW()),

  ('award-012', (SELECT id FROM "dogs" LIMIT 1 OFFSET 4), 'SG', '2023-08-14', 'Sehr Gut', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-013', (SELECT id FROM "dogs" LIMIT 1 OFFSET 4), 'BH', '2023-03-25', 'Begleithund', 'VDH', NOW(), NOW()),

  ('award-014', (SELECT id FROM "dogs" LIMIT 1 OFFSET 5), 'V1', '2023-06-30', 'Vorzüglich', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-015', (SELECT id FROM "dogs" LIMIT 1 OFFSET 5), 'IPO1', '2023-09-18', 'IPO 1', 'VDH', NOW(), NOW()),
  ('award-016', (SELECT id FROM "dogs" LIMIT 1 OFFSET 5), 'RettHund', '2023-11-12', 'Rettungshund', 'DRK', NOW(), NOW()),

  ('award-017', (SELECT id FROM "dogs" LIMIT 1 OFFSET 6), 'SG', '2023-07-05', 'Sehr Gut', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-018', (SELECT id FROM "dogs" LIMIT 1 OFFSET 6), 'BH', '2023-04-08', 'Begleithund', 'VDH', NOW(), NOW()),

  ('award-019', (SELECT id FROM "dogs" LIMIT 1 OFFSET 7), 'V1', '2023-05-22', 'Vorzüglich', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-020', (SELECT id FROM "dogs" LIMIT 1 OFFSET 7), 'IPO2', '2023-10-28', 'IPO 2', 'VDH', NOW(), NOW()),
  ('award-021', (SELECT id FROM "dogs" LIMIT 1 OFFSET 7), 'SchH2', '2023-12-15', 'Schutzhund 2', 'VDH', NOW(), NOW()),

  ('award-022', (SELECT id FROM "dogs" LIMIT 1 OFFSET 8), 'SG', '2023-08-02', 'Sehr Gut', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-023', (SELECT id FROM "dogs" LIMIT 1 OFFSET 8), 'BH', '2023-03-18', 'Begleithund', 'VDH', NOW(), NOW()),
  ('award-024', (SELECT id FROM "dogs" LIMIT 1 OFFSET 8), 'RettHund', '2023-11-25', 'Rettungshund', 'DRK', NOW(), NOW()),

  ('award-025', (SELECT id FROM "dogs" LIMIT 1 OFFSET 9), 'V1', '2023-06-08', 'Vorzüglich', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-026', (SELECT id FROM "dogs" LIMIT 1 OFFSET 9), 'IPO1', '2023-09-12', 'IPO 1', 'VDH', NOW(), NOW()),

  ('award-027', (SELECT id FROM "dogs" LIMIT 1 OFFSET 10), 'SG', '2023-07-25', 'Sehr Gut', 'Hovawart Club Deutschland', NOW(), NOW()),
  ('award-028', (SELECT id FROM "dogs" LIMIT 1 OFFSET 10), 'BH', '2023-04-15', 'Begleithund', 'VDH', NOW(), NOW()),
  ('award-029', (SELECT id FROM "dogs" LIMIT 1 OFFSET 10), 'RettHund', '2023-11-08', 'Rettungshund', 'DRK', NOW(), NOW());

COMMIT;

DO $$ BEGIN RAISE NOTICE 'Seeding finished'; END $$;