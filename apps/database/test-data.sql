-- Testdaten für Hovawart-Züchterdatenbank
-- Diese Datei enthält INSERT- und DELETE-Statements für alle Testdaten

-- Zuerst alle bestehenden Testdaten löschen
DELETE FROM medical_findings WHERE "dogId" IN (SELECT id FROM dogs WHERE name LIKE '%Test%' OR name LIKE '%vom Schwarzen Wald%' OR name LIKE '%von der Eifel%' OR name LIKE '%aus dem Harz%' OR name LIKE '%vom Bodensee%' OR name LIKE '%von der Mosel%' OR name LIKE '%aus dem Schwarzwald%' OR name LIKE '%vom Neckar%' OR name LIKE '%aus dem Odenwald%');
DELETE FROM awards WHERE "dogId" IN (SELECT id FROM dogs WHERE name LIKE '%Test%' OR name LIKE '%vom Schwarzen Wald%' OR name LIKE '%von der Eifel%' OR name LIKE '%aus dem Harz%' OR name LIKE '%vom Bodensee%' OR name LIKE '%von der Mosel%' OR name LIKE '%aus dem Schwarzwald%' OR name LIKE '%vom Neckar%' OR name LIKE '%aus dem Odenwald%');
DELETE FROM genetic_tests WHERE "dogId" IN (SELECT id FROM dogs WHERE name LIKE '%Test%' OR name LIKE '%vom Schwarzen Wald%' OR name LIKE '%von der Eifel%' OR name LIKE '%aus dem Harz%' OR name LIKE '%vom Bodensee%' OR name LIKE '%von der Mosel%' OR name LIKE '%aus dem Schwarzwald%' OR name LIKE '%vom Neckar%' OR name LIKE '%aus dem Odenwald%');
DELETE FROM litters WHERE "litterNumber" LIKE 'W-2024-%';
DELETE FROM dogs WHERE name LIKE '%Test%' OR name LIKE '%vom Schwarzen Wald%' OR name LIKE '%von der Eifel%' OR name LIKE '%aus dem Harz%' OR name LIKE '%vom Bodensee%' OR name LIKE '%von der Mosel%' OR name LIKE '%aus dem Schwarzwald%' OR name LIKE '%vom Neckar%' OR name LIKE '%aus dem Odenwald%';
DELETE FROM user_roles WHERE "userId" IN ('user-max-mustermann', 'user-anna-schmidt', 'user-peter-weber', 'user-maria-fischer', 'user-lisa-mueller', 'user-sabine-klein', 'user-thomas-mueller', 'user-claudia-wagner', 'user-petra-hoffmann', 'user-andreas-richter', 'user-hans-schmidt', 'user-michael-bauer', 'user-stefan-neumann');
DELETE FROM users WHERE username IN ('max.mustermann', 'anna.schmidt', 'peter.weber', 'maria.fischer', 'lisa.mueller', 'sabine.klein', 'thomas.mueller', 'claudia.wagner', 'petra.hoffmann', 'andreas.richter', 'hans.schmidt', 'michael.bauer', 'stefan.neumann');

-- Test-Benutzer einfügen
INSERT INTO users ("id", "username", "email", "password", "firstName", "lastName", "memberNumber", "memberSince", "kennelName", "website", "avatarUrl", "address", "city", "postalCode", "country", "latitude", "longitude", "createdAt", "updatedAt") VALUES
('user-max-mustermann', 'max.mustermann', 'max.mustermann@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Max', 'Mustermann', 'HZD-001', '2020-01-15', 'vom Schwarzen Wald', 'https://www.hovawart-muenchen.de', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Musterstraße 1', 'München', '80331', 'Deutschland', 48.1351, 11.5820, NOW(), NOW()),
('user-anna-schmidt', 'anna.schmidt', 'anna.schmidt@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Anna', 'Schmidt', 'HZD-002', '2019-03-20', 'aus dem Harz', 'https://www.hovawart-hamburg.de', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Hauptstraße 15', 'Hamburg', '20095', 'Deutschland', 53.5511, 9.9937, NOW(), NOW()),
('user-peter-weber', 'peter.weber', 'peter.weber@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Peter', 'Weber', 'HZD-003', '2021-06-10', 'von der Mosel', 'https://www.hovawart-koeln.de', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Rheinuferstraße 8', 'Köln', '50679', 'Deutschland', 50.9375, 6.9603, NOW(), NOW()),
('user-maria-fischer', 'maria.fischer', 'maria.fischer@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Maria', 'Fischer', 'HZD-004', '2018-11-05', 'vom Neckar', 'https://www.hovawart-stuttgart.de', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Königstraße 22', 'Stuttgart', '70173', 'Deutschland', 48.7758, 9.1829, NOW(), NOW()),
('user-lisa-mueller', 'lisa.mueller', 'lisa.mueller@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Lisa', 'Müller', 'HZD-005', '2020-09-12', 'vom Schwarzen Wald', 'https://www.hovawart-muenchen.de', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Schwabinger Straße 5', 'München', '80802', 'Deutschland', 48.1351, 11.5820, NOW(), NOW()),
('user-sabine-klein', 'sabine.klein', 'sabine.klein@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Sabine', 'Klein', 'HZD-006', '2019-07-18', 'aus dem Harz', 'https://www.hovawart-hamburg.de', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 'Alsterufer 12', 'Hamburg', '20354', 'Deutschland', 53.5511, 9.9937, NOW(), NOW()),
('user-thomas-mueller', 'thomas.mueller', 'thomas.mueller@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Thomas', 'Müller', 'HZD-007', '2021-02-28', 'vom Bodensee', 'https://www.hovawart-bodensee.de', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Seestraße 3', 'Konstanz', '78464', 'Deutschland', 47.6631, 9.1753, NOW(), NOW()),
('user-claudia-wagner', 'claudia.wagner', 'claudia.wagner@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Claudia', 'Wagner', 'HZD-008', '2020-04-14', 'von der Mosel', 'https://www.hovawart-koeln.de', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Moselufer 7', 'Koblenz', '56068', 'Deutschland', 50.3569, 7.5890, NOW(), NOW()),
('user-petra-hoffmann', 'petra.hoffmann', 'petra.hoffmann@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Petra', 'Hoffmann', 'HZD-009', '2019-12-03', 'vom Neckar', 'https://www.hovawart-stuttgart.de', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Neckarstraße 18', 'Heilbronn', '74072', 'Deutschland', 49.1427, 9.2109, NOW(), NOW()),
('user-andreas-richter', 'andreas.richter', 'andreas.richter@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Andreas', 'Richter', 'HZD-010', '2021-08-22', 'aus dem Odenwald', 'https://www.hovawart-odenwald.de', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face', 'Odenwaldstraße 25', 'Darmstadt', '64283', 'Deutschland', 49.8728, 8.6512, NOW(), NOW()),
('user-hans-schmidt', 'hans.schmidt', 'hans.schmidt@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Hans', 'Schmidt', 'HZD-011', '2020-05-30', NULL, 'https://www.hovawart-eifel.de', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Eifelstraße 9', 'Trier', '54290', 'Deutschland', 49.7596, 6.6439, NOW(), NOW()),
('user-michael-bauer', 'michael.bauer', 'michael.bauer@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Michael', 'Bauer', 'HZD-012', '2019-10-17', NULL, 'https://www.hovawart-schwarzwald.de', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Schwarzwaldstraße 14', 'Freiburg', '79098', 'Deutschland', 47.9990, 7.8421, NOW(), NOW()),
('user-stefan-neumann', 'stefan.neumann', 'stefan.neumann@email.de', '$2b$10$rQZ8K9vL2nM3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'Stefan', 'Neumann', 'HZD-013', '2021-01-08', NULL, 'https://www.hovawart-odenwald.de', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Odenwaldstraße 31', 'Heidelberg', '69117', 'Deutschland', 49.3988, 8.6724, NOW(), NOW());

-- Benutzer-Rollen einfügen
INSERT INTO user_roles ("id", "userId", "role", "assignedAt") VALUES
('role-max-1', 'user-max-mustermann', 'BREEDER', NOW()),
('role-anna-1', 'user-anna-schmidt', 'BREEDER', NOW()),
('role-peter-1', 'user-peter-weber', 'BREEDER', NOW()),
('role-maria-1', 'user-maria-fischer', 'BREEDER', NOW()),
('role-lisa-1', 'user-lisa-mueller', 'BREEDER', NOW()),
('role-sabine-1', 'user-sabine-klein', 'BREEDER', NOW()),
('role-thomas-1', 'user-thomas-mueller', 'BREEDER', NOW()),
('role-claudia-1', 'user-claudia-wagner', 'BREEDER', NOW()),
('role-petra-1', 'user-petra-hoffmann', 'BREEDER', NOW()),
('role-andreas-1', 'user-andreas-richter', 'BREEDER', NOW()),
('role-hans-1', 'user-hans-schmidt', 'STUD_OWNER', NOW()),
('role-michael-1', 'user-michael-bauer', 'STUD_OWNER', NOW()),
('role-stefan-1', 'user-stefan-neumann', 'STUD_OWNER', NOW());

-- Test-Hunde einfügen
INSERT INTO dogs ("id", "name", "gender", "birthDate", "deathDate", "color", "microchipId", "pedigreeNumber", "ownerId", "motherId", "fatherId", "litterNumber", "breedingStatus", "website", "description", "createdAt", "updatedAt") VALUES
('dog-bella-schwarzen-wald', 'Bella vom Schwarzen Wald', 'H', '2020-03-15', NULL, 'Schwarzmarken', 'DE123456789012345', 'HZD-2020-001', 'user-lisa-mueller', NULL, NULL, 'W-2020-A', 'WURF_VORHANDEN', 'https://www.hovawart-muenchen.de/bella', 'Sehr ruhige und ausgeglichene Zuchthündin', NOW(), NOW()),
('dog-thor-eifel', 'Thor von der Eifel', 'R', '2019-08-22', NULL, 'Schwarz', 'DE123456789012346', 'HZD-2019-002', 'user-hans-schmidt', NULL, NULL, 'W-2019-A', 'NORMAL', 'https://www.hovawart-eifel.de/thor', 'Erfahrener Deckrüde mit ausgezeichneten Wesensmerkmalen', NOW(), NOW()),
('dog-luna-harz', 'Luna aus dem Harz', 'H', '2021-01-10', NULL, 'Blond', 'DE123456789012347', 'HZD-2021-003', 'user-sabine-klein', NULL, NULL, 'W-2021-A', 'WURF_GEPLANT', 'https://www.hovawart-hamburg.de/luna', 'Sehr ruhige und ausgeglichene Hündin', NOW(), NOW()),
('dog-rex-bodensee', 'Rex vom Bodensee', 'R', '2018-11-05', NULL, 'Schwarzmarken', 'DE123456789012348', 'HZD-2018-004', 'user-thomas-mueller', NULL, NULL, 'W-2018-A', 'NORMAL', 'https://www.hovawart-bodensee.de/rex', 'Erfahrener Deckrüde', NOW(), NOW()),
('dog-nala-mosel', 'Nala von der Mosel', 'H', '2020-07-18', NULL, 'Schwarz', 'DE123456789012349', 'HZD-2020-005', 'user-claudia-wagner', NULL, NULL, 'W-2020-B', 'WURF_VORHANDEN', 'https://www.hovawart-koeln.de/nala', 'Entwickelt sich prächtig', NOW(), NOW()),
('dog-zeus-schwarzwald', 'Zeus aus dem Schwarzwald', 'R', '2019-04-12', NULL, 'Schwarzmarken', 'DE123456789012350', 'HZD-2019-006', 'user-michael-bauer', NULL, NULL, 'W-2019-B', 'NORMAL', 'https://www.hovawart-schwarzwald.de/zeus', 'Ausgezeichnete Arbeitsleistungen', NOW(), NOW()),
('dog-maya-neckar', 'Maya vom Neckar', 'H', '2021-09-03', NULL, 'Blond', 'DE123456789012351', 'HZD-2021-007', 'user-petra-hoffmann', NULL, NULL, 'W-2021-B', 'WURF_VORHANDEN', 'https://www.hovawart-stuttgart.de/maya', 'Stammt aus Arbeitslinien', NOW(), NOW()),
('dog-apollo-odenwald', 'Apollo aus dem Odenwald', 'R', '2020-12-20', NULL, 'Schwarz', 'DE123456789012352', 'HZD-2020-008', 'user-andreas-richter', NULL, NULL, 'W-2020-C', 'NORMAL', 'https://www.hovawart-odenwald.de/apollo', 'Ausgezeichnete Arbeitsleistungen', NOW(), NOW());

-- Test-Würfe einfügen
INSERT INTO litters ("id", "litterNumber", "litterSequence", "motherId", "fatherId", "breederId", "plannedDate", "expectedDate", "actualDate", "status", "expectedPuppies", "actualPuppies", "description", "isPublic", "contactInfo", "price", "location", "av", "iz", "puppyColors", "createdAt", "updatedAt") VALUES
('litter-w-2024-001', 'W-2024-001', 'A-Wurf', 'dog-bella-schwarzen-wald', 'dog-thor-eifel', 'user-max-mustermann', '2024-06-15', '2024-06-15', '2024-06-12', 'BORN', 6, 5, 'Wunderschöner Wurf aus bewährter Zuchtlinie. Beide Elterntiere sind HD/ED-frei und haben ausgezeichnete Wesensmerkmale.', true, 'max.mustermann@email.de, +49 89 12345678', 1200, 'München, Bayern', 8.5, 3.2, '{"Schwarz": {"born": 2, "available": 1}, "Blond": {"born": 2, "available": 1}, "Schwarzmarken": {"born": 1, "available": 1}}', NOW(), NOW()),
('litter-w-2024-002', 'W-2024-002', 'B-Wurf', 'dog-luna-harz', 'dog-rex-bodensee', 'user-anna-schmidt', '2024-08-20', '2024-08-20', NULL, 'PLANNED', 7, NULL, 'Geplanter Wurf für Herbst 2024. Mutter ist eine sehr ruhige und ausgeglichene Hündin, Vater ist ein erfahrener Deckrüde.', true, 'anna.schmidt@email.de, +49 40 87654321', 1100, 'Hamburg, Hamburg', NULL, NULL, NULL, NOW(), NOW()),
('litter-w-2024-003', 'W-2024-003', 'C-Wurf', 'dog-nala-mosel', 'dog-zeus-schwarzwald', 'user-peter-weber', '2024-05-10', '2024-05-10', '2024-05-08', 'RESERVED', 5, 6, 'Alle Welpen sind bereits reserviert. Wurf ist geboren und entwickelt sich prächtig.', true, 'peter.weber@email.de, +49 221 11223344', 1300, 'Köln, Nordrhein-Westfalen', 6.8, 2.1, '{"Schwarzmarken": {"born": 4, "available": 0}, "Blond": {"born": 2, "available": 0}}', NOW(), NOW()),
('litter-w-2024-004', 'W-2024-004', 'D-Wurf', 'dog-maya-neckar', 'dog-apollo-odenwald', 'user-maria-fischer', '2024-07-30', '2024-07-30', '2024-07-28', 'BORN', 6, 4, 'Kleiner aber feiner Wurf. Beide Elterntiere stammen aus Arbeitslinien und haben ausgezeichnete Arbeitsleistungen.', true, 'maria.fischer@email.de, +49 711 55667788', 1150, 'Stuttgart, Baden-Württemberg', 9.7, 3.8, '{"Schwarz": {"born": 3, "available": 1}, "Schwarzmarken": {"born": 1, "available": 1}}', NOW(), NOW());

-- Test-Auszeichnungen einfügen
INSERT INTO awards ("id", "dogId", "code", "date", "description", "issuer", "createdAt", "updatedAt") VALUES
('award-bella-1', 'dog-bella-schwarzen-wald', 'V1', '2023-05-15', 'Vielseitigkeitsprüfung 1', 'HZD', NOW(), NOW()),
('award-bella-2', 'dog-bella-schwarzen-wald', 'BH', '2022-08-20', 'Begleithundeprüfung', 'HZD', NOW(), NOW()),
('award-bella-3', 'dog-bella-schwarzen-wald', 'IPO1', '2023-09-10', 'IPO 1', 'HZD', NOW(), NOW()),
('award-thor-1', 'dog-thor-eifel', 'V2', '2023-07-22', 'Vielseitigkeitsprüfung 2', 'HZD', NOW(), NOW()),
('award-thor-2', 'dog-thor-eifel', 'IPO2', '2023-11-05', 'IPO 2', 'HZD', NOW(), NOW()),
('award-thor-3', 'dog-thor-eifel', 'FH', '2022-12-03', 'Fährtenhundeprüfung', 'HZD', NOW(), NOW()),
('award-luna-1', 'dog-luna-harz', 'BH', '2022-06-15', 'Begleithundeprüfung', 'HZD', NOW(), NOW()),
('award-luna-2', 'dog-luna-harz', 'IPO1', '2023-03-20', 'IPO 1', 'HZD', NOW(), NOW()),
('award-rex-1', 'dog-rex-bodensee', 'V1', '2023-04-18', 'Vielseitigkeitsprüfung 1', 'HZD', NOW(), NOW()),
('award-rex-2', 'dog-rex-bodensee', 'IPO2', '2023-08-12', 'IPO 2', 'HZD', NOW(), NOW()),
('award-rex-3', 'dog-rex-bodensee', 'FH', '2022-10-25', 'Fährtenhundeprüfung', 'HZD', NOW(), NOW()),
('award-nala-1', 'dog-nala-mosel', 'V1', '2023-02-14', 'Vielseitigkeitsprüfung 1', 'HZD', NOW(), NOW()),
('award-nala-2', 'dog-nala-mosel', 'BH', '2022-05-10', 'Begleithundeprüfung', 'HZD', NOW(), NOW()),
('award-nala-3', 'dog-nala-mosel', 'IPO1', '2023-06-08', 'IPO 1', 'HZD', NOW(), NOW()),
('award-zeus-1', 'dog-zeus-schwarzwald', 'V2', '2023-09-15', 'Vielseitigkeitsprüfung 2', 'HZD', NOW(), NOW()),
('award-zeus-2', 'dog-zeus-schwarzwald', 'IPO3', '2023-12-02', 'IPO 3', 'HZD', NOW(), NOW()),
('award-zeus-3', 'dog-zeus-schwarzwald', 'FH', '2022-11-18', 'Fährtenhundeprüfung', 'HZD', NOW(), NOW()),
('award-maya-1', 'dog-maya-neckar', 'BH', '2022-07-12', 'Begleithundeprüfung', 'HZD', NOW(), NOW()),
('award-maya-2', 'dog-maya-neckar', 'IPO1', '2023-01-25', 'IPO 1', 'HZD', NOW(), NOW()),
('award-apollo-1', 'dog-apollo-odenwald', 'V1', '2023-03-08', 'Vielseitigkeitsprüfung 1', 'HZD', NOW(), NOW()),
('award-apollo-2', 'dog-apollo-odenwald', 'IPO2', '2023-07-20', 'IPO 2', 'HZD', NOW(), NOW()),
('award-apollo-3', 'dog-apollo-odenwald', 'FH', '2022-09-14', 'Fährtenhundeprüfung', 'HZD', NOW(), NOW());

-- Test-Gesundheitsbefunde einfügen
INSERT INTO medical_findings ("id", "dogId", "date", "shortDescription", "remarks", "createdAt", "updatedAt") VALUES
('medical-bella-1', 'dog-bella-schwarzen-wald', '2023-01-15', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-bella-2', 'dog-bella-schwarzen-wald', '2023-06-20', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-thor-1', 'dog-thor-eifel', '2023-02-10', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-thor-2', 'dog-thor-eifel', '2023-07-15', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-luna-1', 'dog-luna-harz', '2023-03-05', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-luna-2', 'dog-luna-harz', '2023-08-10', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-rex-1', 'dog-rex-bodensee', '2023-01-20', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-rex-2', 'dog-rex-bodensee', '2023-06-25', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-nala-1', 'dog-nala-mosel', '2023-02-15', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-nala-2', 'dog-nala-mosel', '2023-07-20', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-zeus-1', 'dog-zeus-schwarzwald', '2023-01-25', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-zeus-2', 'dog-zeus-schwarzwald', '2023-06-30', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-maya-1', 'dog-maya-neckar', '2023-03-10', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-maya-2', 'dog-maya-neckar', '2023-08-15', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW()),
('medical-apollo-1', 'dog-apollo-odenwald', '2023-02-20', 'HD/ED-Untersuchung', 'HD-A1, ED-0 - Beide Hüften und Ellenbogen frei', NOW(), NOW()),
('medical-apollo-2', 'dog-apollo-odenwald', '2023-07-25', 'Augenuntersuchung', 'PRA frei, Katarakt frei', NOW(), NOW());

-- Test-Genetik-Tests einfügen
INSERT INTO genetic_tests ("id", "dogId", "testType", "testDate", "result", "laboratory", "certificateNumber", "notes", "createdAt", "updatedAt") VALUES
('genetic-bella-1', 'dog-bella-schwarzen-wald', 'PRA', '2023-01-10', 'FREI', 'Laboklin', 'LAB-2023-001', 'PRA frei getestet', NOW(), NOW()),
('genetic-bella-2', 'dog-bella-schwarzen-wald', 'DM', '2023-01-10', 'FREI', 'Laboklin', 'LAB-2023-002', 'DM frei getestet', NOW(), NOW()),
('genetic-thor-1', 'dog-thor-eifel', 'PRA', '2023-02-05', 'FREI', 'Laboklin', 'LAB-2023-003', 'PRA frei getestet', NOW(), NOW()),
('genetic-thor-2', 'dog-thor-eifel', 'DM', '2023-02-05', 'FREI', 'Laboklin', 'LAB-2023-004', 'DM frei getestet', NOW(), NOW()),
('genetic-luna-1', 'dog-luna-harz', 'PRA', '2023-03-01', 'FREI', 'Laboklin', 'LAB-2023-005', 'PRA frei getestet', NOW(), NOW()),
('genetic-luna-2', 'dog-luna-harz', 'DM', '2023-03-01', 'FREI', 'Laboklin', 'LAB-2023-006', 'DM frei getestet', NOW(), NOW()),
('genetic-rex-1', 'dog-rex-bodensee', 'PRA', '2023-01-15', 'FREI', 'Laboklin', 'LAB-2023-007', 'PRA frei getestet', NOW(), NOW()),
('genetic-rex-2', 'dog-rex-bodensee', 'DM', '2023-01-15', 'FREI', 'Laboklin', 'LAB-2023-008', 'DM frei getestet', NOW(), NOW()),
('genetic-nala-1', 'dog-nala-mosel', 'PRA', '2023-02-10', 'FREI', 'Laboklin', 'LAB-2023-009', 'PRA frei getestet', NOW(), NOW()),
('genetic-nala-2', 'dog-nala-mosel', 'DM', '2023-02-10', 'FREI', 'Laboklin', 'LAB-2023-010', 'DM frei getestet', NOW(), NOW()),
('genetic-zeus-1', 'dog-zeus-schwarzwald', 'PRA', '2023-01-20', 'FREI', 'Laboklin', 'LAB-2023-011', 'PRA frei getestet', NOW(), NOW()),
('genetic-zeus-2', 'dog-zeus-schwarzwald', 'DM', '2023-01-20', 'FREI', 'Laboklin', 'LAB-2023-012', 'DM frei getestet', NOW(), NOW()),
('genetic-maya-1', 'dog-maya-neckar', 'PRA', '2023-03-05', 'FREI', 'Laboklin', 'LAB-2023-013', 'PRA frei getestet', NOW(), NOW()),
('genetic-maya-2', 'dog-maya-neckar', 'DM', '2023-03-05', 'FREI', 'Laboklin', 'LAB-2023-014', 'DM frei getestet', NOW(), NOW()),
('genetic-apollo-1', 'dog-apollo-odenwald', 'PRA', '2023-02-15', 'FREI', 'Laboklin', 'LAB-2023-015', 'PRA frei getestet', NOW(), NOW()),
('genetic-apollo-2', 'dog-apollo-odenwald', 'DM', '2023-02-15', 'FREI', 'Laboklin', 'LAB-2023-016', 'DM frei getestet', NOW(), NOW());