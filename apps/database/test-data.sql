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
    (SELECT id FROM "users" ORDER BY id LIMIT 1 OFFSET ((i-1) % 80)) AS "ownerId",
    CASE WHEN i <= 15 THEN 'WURF_VORHANDEN' ELSE NULL END AS "breedingStatus",
    CASE WHEN i > 55 AND i <= 65 THEN TRUE ELSE FALSE END AS "isStudAvailable",
    'https://example.com/dog/' || i::text AS website,
    'Automatisch generierter Testhund ' || i::text AS description,
    NOW() AS "createdAt",
    NOW() AS "updatedAt"
  FROM generate_series(1,110) AS g(i)
)
INSERT INTO "dogs" ("id","name","gender","birthDate","deathDate","color","microchipId","pedigreeNumber","avatarUrl","ownerId","motherId","fatherId","litterNumber","breedingStatus","website","description","createdAt","updatedAt")
SELECT id, name, gender, "birthDate", "deathDate", color, "microchipId", "pedigreeNumber", "avatarUrl", "ownerId", NULL, NULL, NULL, "breedingStatus", website, description, "createdAt", "updatedAt"
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
    CASE WHEN i % 2 = 0 THEN 'BORN' ELSE 'PLANNED' END AS status,
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
    NOW() AS "createdAt",
    NOW() AS "updatedAt"
  FROM generate_series(1,20) AS g(i)
)
INSERT INTO "litters" ("id","litterNumber","litterSequence","motherId","fatherId","breederId","plannedDate","expectedDate","actualDate","status","expectedPuppies","actualPuppies","description","isPublic","contactInfo","price","location","av","iz","puppyColors","createdAt","updatedAt")
SELECT * FROM lit;

COMMIT;

DO $$ BEGIN RAISE NOTICE 'Seeding finished'; END $$;