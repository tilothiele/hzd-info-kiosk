"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dogImportSchema = exports.userSearchSchema = exports.dogSearchSchema = exports.updateLitterSchema = exports.createLitterSchema = exports.updateStudServiceSchema = exports.createStudServiceSchema = exports.updateGeneticTestSchema = exports.createGeneticTestSchema = exports.updateAwardSchema = exports.createAwardSchema = exports.updateMedicalFindingSchema = exports.createMedicalFindingSchema = exports.updateHealthRecordSchema = exports.createHealthRecordSchema = exports.updateDogSchema = exports.createDogSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = exports.uuidSchema = exports.phoneSchema = exports.postalCodeSchema = exports.passwordSchema = exports.emailSchema = exports.usernameSchema = void 0;
const zod_1 = require("zod");
// Base schemas
exports.usernameSchema = zod_1.z.string().min(3, 'Benutzername muss mindestens 3 Zeichen haben').max(50, 'Benutzername darf maximal 50 Zeichen haben');
exports.emailSchema = zod_1.z.string().email('Ungültige E-Mail-Adresse');
exports.passwordSchema = zod_1.z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben');
exports.postalCodeSchema = zod_1.z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben');
exports.phoneSchema = zod_1.z.string().optional();
exports.uuidSchema = zod_1.z.string().uuid('Ungültige UUID');
// User validation schemas
exports.createUserSchema = zod_1.z.object({
    username: exports.usernameSchema,
    email: exports.emailSchema,
    password: exports.passwordSchema,
    firstName: zod_1.z.string().min(1, 'Vorname ist erforderlich'),
    lastName: zod_1.z.string().min(1, 'Nachname ist erforderlich'),
    memberNumber: zod_1.z.string().optional(),
    avatarUrl: zod_1.z.string().url('Ungültige Avatar-URL').optional().or(zod_1.z.literal('')),
    memberSince: zod_1.z.date().optional(),
    phone: exports.phoneSchema,
    address: zod_1.z.string().optional(),
    postalCode: exports.postalCodeSchema.optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().default('Deutschland'),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    website: zod_1.z.string().url('Ungültige Website-URL').optional().or(zod_1.z.literal('')),
    kennelName: zod_1.z.string().min(1, 'Zwingername muss mindestens 1 Zeichen haben').max(100, 'Zwingername darf maximal 100 Zeichen haben').optional(),
    roles: zod_1.z.array(zod_1.z.enum(['BREEDER', 'STUD_OWNER', 'ADMIN', 'MEMBER', 'EDITOR'])).min(1, 'Mindestens eine Rolle erforderlich')
});
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    phone: exports.phoneSchema,
    address: zod_1.z.string().optional(),
    postalCode: exports.postalCodeSchema.optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    website: zod_1.z.string().url('Ungültige Website-URL').optional().or(zod_1.z.literal('')),
    kennelName: zod_1.z.string().min(1, 'Zwingername muss mindestens 1 Zeichen haben').max(100, 'Zwingername darf maximal 100 Zeichen haben').optional(),
    isActive: zod_1.z.boolean().optional()
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Benutzername ist erforderlich'),
    password: zod_1.z.string().min(1, 'Passwort ist erforderlich')
});
// Dog validation schemas
exports.createDogSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name ist erforderlich'),
    gender: zod_1.z.enum(['R', 'H']),
    birthDate: zod_1.z.date().max(new Date(), 'Geburtsdatum darf nicht in der Zukunft liegen'),
    deathDate: zod_1.z.date().max(new Date(), 'Todesdatum darf nicht in der Zukunft liegen').optional(),
    color: zod_1.z.string().min(1, 'Farbe ist erforderlich'),
    microchipId: zod_1.z.string().optional(),
    pedigreeNumber: zod_1.z.string().optional(),
    isStudAvailable: zod_1.z.boolean().default(false),
    description: zod_1.z.string().optional(),
    motherId: exports.uuidSchema.optional(),
    fatherId: exports.uuidSchema.optional(),
    litterNumber: zod_1.z.string().max(10, 'Wurfnummer darf maximal 10 Zeichen haben').optional(),
    website: zod_1.z.string().url('Ungültige Website-URL').optional().or(zod_1.z.literal('')),
    breedingStatus: zod_1.z.enum(['VERSTORBEN', 'NICHT_VERFUEGBAR', 'WURF_GEPLANT', 'WURF_VORHANDEN']).optional()
}).refine((data) => {
    if (data.deathDate && data.birthDate) {
        return data.deathDate > data.birthDate;
    }
    return true;
}, {
    message: 'Todesdatum muss nach Geburtsdatum liegen',
    path: ['deathDate']
}).refine((data) => {
    // breedingStatus ist nur für Hündinnen (H) erlaubt
    if (data.breedingStatus && data.gender !== 'H') {
        return false;
    }
    return true;
}, {
    message: 'Zuchtstatus ist nur für Hündinnen erlaubt',
    path: ['breedingStatus']
});
exports.updateDogSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    gender: zod_1.z.enum(['R', 'H']).optional(),
    birthDate: zod_1.z.date().max(new Date()).optional(),
    deathDate: zod_1.z.date().max(new Date()).optional(),
    color: zod_1.z.string().min(1).optional(),
    microchipId: zod_1.z.string().optional(),
    pedigreeNumber: zod_1.z.string().optional(),
    isStudAvailable: zod_1.z.boolean().optional(),
    description: zod_1.z.string().optional(),
    motherId: exports.uuidSchema.optional(),
    fatherId: exports.uuidSchema.optional(),
    litterNumber: zod_1.z.string().max(10).optional(),
    website: zod_1.z.string().url('Ungültige Website-URL').optional().or(zod_1.z.literal('')),
    breedingStatus: zod_1.z.enum(['VERSTORBEN', 'NICHT_VERFUEGBAR', 'WURF_GEPLANT', 'WURF_VORHANDEN']).optional(),
    isActive: zod_1.z.boolean().optional()
});
// Health record validation schemas
exports.createHealthRecordSchema = zod_1.z.object({
    dogId: exports.uuidSchema,
    recordType: zod_1.z.enum(['VACCINATION', 'HEALTH_CERTIFICATE', 'BREEDING_CERTIFICATE', 'OTHER']),
    title: zod_1.z.string().min(1, 'Titel ist erforderlich'),
    description: zod_1.z.string().optional(),
    recordDate: zod_1.z.date().max(new Date(), 'Datum darf nicht in der Zukunft liegen'),
    expiryDate: zod_1.z.date().optional(),
    veterinarian: zod_1.z.string().optional(),
    documentUrl: zod_1.z.string().url('Ungültige URL').optional()
});
exports.updateHealthRecordSchema = zod_1.z.object({
    recordType: zod_1.z.enum(['VACCINATION', 'HEALTH_CERTIFICATE', 'BREEDING_CERTIFICATE', 'OTHER']).optional(),
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    recordDate: zod_1.z.date().max(new Date()).optional(),
    expiryDate: zod_1.z.date().optional(),
    veterinarian: zod_1.z.string().optional(),
    documentUrl: zod_1.z.string().url().optional()
});
// Medical finding validation schemas
exports.createMedicalFindingSchema = zod_1.z.object({
    dogId: exports.uuidSchema,
    date: zod_1.z.date().max(new Date(), 'Datum darf nicht in der Zukunft liegen'),
    shortDescription: zod_1.z.string().min(1, 'Kurzbezeichnung ist erforderlich').max(100, 'Kurzbezeichnung darf maximal 100 Zeichen haben'),
    remarks: zod_1.z.string().optional()
});
exports.updateMedicalFindingSchema = zod_1.z.object({
    date: zod_1.z.date().max(new Date()).optional(),
    shortDescription: zod_1.z.string().min(1).max(100).optional(),
    remarks: zod_1.z.string().optional()
});
// Award validation schemas
exports.createAwardSchema = zod_1.z.object({
    dogId: exports.uuidSchema,
    code: zod_1.z.string().min(1, 'Code ist erforderlich').max(50, 'Code darf maximal 50 Zeichen haben'),
    date: zod_1.z.date().max(new Date(), 'Datum darf nicht in der Zukunft liegen').optional(),
    description: zod_1.z.string().min(1, 'Beschreibung ist erforderlich').max(200, 'Beschreibung darf maximal 200 Zeichen haben'),
    issuer: zod_1.z.string().min(1, 'Aussteller ist erforderlich').max(100, 'Aussteller darf maximal 100 Zeichen haben')
});
exports.updateAwardSchema = zod_1.z.object({
    code: zod_1.z.string().min(1).max(50).optional(),
    date: zod_1.z.date().max(new Date()).optional(),
    description: zod_1.z.string().min(1).max(200).optional(),
    issuer: zod_1.z.string().min(1).max(100).optional()
});
// Genetic test validation schemas
exports.createGeneticTestSchema = zod_1.z.object({
    dogId: exports.uuidSchema,
    testType: zod_1.z.enum(['HD', 'ED', 'PRA', 'DM', 'VWD', 'OTHER']),
    testDate: zod_1.z.date().max(new Date(), 'Testdatum darf nicht in der Zukunft liegen'),
    result: zod_1.z.enum(['NORMAL', 'CARRIER', 'AFFECTED', 'UNKNOWN']),
    laboratory: zod_1.z.string().min(1, 'Labor ist erforderlich').max(100, 'Labor darf maximal 100 Zeichen haben'),
    certificateNumber: zod_1.z.string().max(50, 'Zertifikatsnummer darf maximal 50 Zeichen haben').optional(),
    notes: zod_1.z.string().optional()
});
exports.updateGeneticTestSchema = zod_1.z.object({
    testType: zod_1.z.enum(['HD', 'ED', 'PRA', 'DM', 'VWD', 'OTHER']).optional(),
    testDate: zod_1.z.date().max(new Date()).optional(),
    result: zod_1.z.enum(['NORMAL', 'CARRIER', 'AFFECTED', 'UNKNOWN']).optional(),
    laboratory: zod_1.z.string().min(1).max(100).optional(),
    certificateNumber: zod_1.z.string().max(50).optional(),
    notes: zod_1.z.string().optional()
});
// Stud service validation schemas
exports.createStudServiceSchema = zod_1.z.object({
    studDogId: exports.uuidSchema,
    isAvailable: zod_1.z.boolean().default(true),
    price: zod_1.z.number().positive('Preis muss positiv sein').optional(),
    description: zod_1.z.string().optional(),
    contactInfo: zod_1.z.string().min(1, 'Kontaktinformationen sind erforderlich'),
    location: zod_1.z.string().optional()
});
exports.updateStudServiceSchema = zod_1.z.object({
    isAvailable: zod_1.z.boolean().optional(),
    price: zod_1.z.number().positive().optional(),
    description: zod_1.z.string().optional(),
    contactInfo: zod_1.z.string().min(1).optional(),
    location: zod_1.z.string().optional()
});
// Litter validation schemas
exports.createLitterSchema = zod_1.z.object({
    motherId: exports.uuidSchema,
    fatherId: exports.uuidSchema.optional(),
    litterNumber: zod_1.z.string().min(1, 'Wurfnummer ist erforderlich').max(10, 'Wurfnummer darf maximal 10 Zeichen haben'),
    litterSequence: zod_1.z.string().min(1, 'Wurffolge ist erforderlich').max(10, 'Wurffolge darf maximal 10 Zeichen haben').optional(),
    plannedDate: zod_1.z.date().optional(),
    expectedDate: zod_1.z.date().optional(),
    actualDate: zod_1.z.date().optional(),
    status: zod_1.z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED']).default('PLANNED'),
    expectedPuppies: zod_1.z.number().positive().optional(),
    actualPuppies: zod_1.z.number().positive().optional(),
    puppyColors: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        born: zod_1.z.number().min(0),
        available: zod_1.z.number().min(0)
    })).optional(),
    av: zod_1.z.number().min(0).max(100).optional(),
    iz: zod_1.z.number().min(0).max(100).optional(),
    description: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().default(true),
    contactInfo: zod_1.z.string().optional(),
    price: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().optional(),
    website: zod_1.z.string().url('Ungültige Website-URL').optional().or(zod_1.z.literal('')),
    imageUrl: zod_1.z.string().url('Ungültige Bild-URL').optional().or(zod_1.z.literal(''))
}).refine((data) => {
    // puppyColors ist nur für BORN, RESERVED, SOLD erlaubt
    if (data.puppyColors && !['BORN', 'RESERVED', 'SOLD'].includes(data.status)) {
        return false;
    }
    return true;
}, {
    message: 'Welpenfarben sind nur für Status BORN, RESERVED oder SOLD erlaubt',
    path: ['puppyColors']
});
exports.updateLitterSchema = zod_1.z.object({
    fatherId: exports.uuidSchema.optional(),
    litterNumber: zod_1.z.string().min(1).max(10).optional(),
    litterSequence: zod_1.z.string().min(1).max(10).optional(),
    plannedDate: zod_1.z.date().optional(),
    expectedDate: zod_1.z.date().optional(),
    actualDate: zod_1.z.date().optional(),
    status: zod_1.z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED']).optional(),
    expectedPuppies: zod_1.z.number().positive().optional(),
    actualPuppies: zod_1.z.number().positive().optional(),
    puppyColors: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        born: zod_1.z.number().min(0),
        available: zod_1.z.number().min(0)
    })).optional(),
    av: zod_1.z.number().min(0).max(100).optional(),
    iz: zod_1.z.number().min(0).max(100).optional(),
    description: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().optional(),
    contactInfo: zod_1.z.string().optional(),
    price: zod_1.z.number().positive().optional(),
    location: zod_1.z.string().optional(),
    website: zod_1.z.string().url('Ungültige Website-URL').optional().or(zod_1.z.literal('')),
    imageUrl: zod_1.z.string().url('Ungültige Bild-URL').optional().or(zod_1.z.literal(''))
});
// Search and filter validation schemas
exports.dogSearchSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    gender: zod_1.z.enum(['R', 'H']).optional(),
    color: zod_1.z.string().optional(),
    ownerId: exports.uuidSchema.optional(),
    isStudAvailable: zod_1.z.boolean().optional(),
    birthDateFrom: zod_1.z.date().optional(),
    birthDateTo: zod_1.z.date().optional(),
    postalCode: exports.postalCodeSchema.optional(),
    radius: zod_1.z.number().positive().max(1000, 'Radius darf maximal 1000km sein').optional(),
    page: zod_1.z.number().positive().default(1),
    limit: zod_1.z.number().positive().max(100).default(20)
});
exports.userSearchSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    role: zod_1.z.enum(['BREEDER', 'STUD_OWNER', 'ADMIN', 'MEMBER', 'EDITOR']).optional(),
    city: zod_1.z.string().optional(),
    postalCode: exports.postalCodeSchema.optional(),
    page: zod_1.z.number().positive().default(1),
    limit: zod_1.z.number().positive().max(100).default(20)
});
// Import validation schemas
exports.dogImportSchema = zod_1.z.object({
    legacyId: zod_1.z.string().min(1, 'Legacy ID ist erforderlich'),
    name: zod_1.z.string().min(1),
    gender: zod_1.z.enum(['R', 'H']),
    birthDate: zod_1.z.date(),
    deathDate: zod_1.z.date().optional(),
    color: zod_1.z.string().min(1),
    microchipId: zod_1.z.string().optional(),
    pedigreeNumber: zod_1.z.string().optional(),
    isStudAvailable: zod_1.z.boolean().default(false),
    description: zod_1.z.string().optional(),
    motherId: zod_1.z.string().optional(),
    fatherId: zod_1.z.string().optional(),
    litterNumber: zod_1.z.string().max(10).optional(),
    healthRecords: zod_1.z.array(zod_1.z.any()).optional(),
    medicalFindings: zod_1.z.array(zod_1.z.any()).optional(),
    awards: zod_1.z.array(zod_1.z.any()).optional(),
    geneticTests: zod_1.z.array(zod_1.z.any()).optional()
});
//# sourceMappingURL=index.js.map