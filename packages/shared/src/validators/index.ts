import { z } from 'zod'

// Base schemas
export const usernameSchema = z.string().min(3, 'Benutzername muss mindestens 3 Zeichen haben').max(50, 'Benutzername darf maximal 50 Zeichen haben')
export const emailSchema = z.string().email('Ungültige E-Mail-Adresse')
export const passwordSchema = z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben')
export const postalCodeSchema = z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben')
export const phoneSchema = z.string().optional()
export const uuidSchema = z.string().uuid('Ungültige UUID')

// User validation schemas
export const createUserSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  memberNumber: z.string().optional(),
  avatarUrl: z.string().url('Ungültige Avatar-URL').optional().or(z.literal('')),
  memberSince: z.date().optional(),
  phone: phoneSchema,
  address: z.string().optional(),
  postalCode: postalCodeSchema.optional(),
  city: z.string().optional(),
  country: z.string().default('Deutschland'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  website: z.string().url('Ungültige Website-URL').optional().or(z.literal('')),
  kennelName: z.string().min(1, 'Zwingername muss mindestens 1 Zeichen haben').max(100, 'Zwingername darf maximal 100 Zeichen haben').optional(),
  roles: z.array(z.enum(['BREEDER', 'STUD_OWNER', 'ADMIN', 'MEMBER', 'EDITOR'])).min(1, 'Mindestens eine Rolle erforderlich')
})

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: phoneSchema,
  address: z.string().optional(),
  postalCode: postalCodeSchema.optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  website: z.string().url('Ungültige Website-URL').optional().or(z.literal('')),
  kennelName: z.string().min(1, 'Zwingername muss mindestens 1 Zeichen haben').max(100, 'Zwingername darf maximal 100 Zeichen haben').optional(),
  isActive: z.boolean().optional()
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Benutzername ist erforderlich'),
  password: z.string().min(1, 'Passwort ist erforderlich')
})

// Dog validation schemas
export const createDogSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  gender: z.enum(['R', 'H']),
  birthDate: z.date().max(new Date(), 'Geburtsdatum darf nicht in der Zukunft liegen'),
  deathDate: z.date().max(new Date(), 'Todesdatum darf nicht in der Zukunft liegen').optional(),
  color: z.string().min(1, 'Farbe ist erforderlich'),
  microchipId: z.string().optional(),
  pedigreeNumber: z.string().optional(),
  isStudAvailable: z.boolean().default(false),
  description: z.string().optional(),
  motherId: uuidSchema.optional(),
  fatherId: uuidSchema.optional(),
  litterNumber: z.string().max(10, 'Wurfnummer darf maximal 10 Zeichen haben').optional(),
  website: z.string().url('Ungültige Website-URL').optional().or(z.literal('')),
  breedingStatus: z.enum(['VERSTORBEN', 'NICHT_VERFUEGBAR', 'WURF_GEPLANT', 'WURF_VORHANDEN']).optional()
}).refine((data) => {
  if (data.deathDate && data.birthDate) {
    return data.deathDate > data.birthDate
  }
  return true
}, {
  message: 'Todesdatum muss nach Geburtsdatum liegen',
  path: ['deathDate']
}).refine((data) => {
  // breedingStatus ist nur für Hündinnen (H) erlaubt
  if (data.breedingStatus && data.gender !== 'H') {
    return false
  }
  return true
}, {
  message: 'Zuchtstatus ist nur für Hündinnen erlaubt',
  path: ['breedingStatus']
})

export const updateDogSchema = z.object({
  name: z.string().min(1).optional(),
  gender: z.enum(['R', 'H']).optional(),
  birthDate: z.date().max(new Date()).optional(),
  deathDate: z.date().max(new Date()).optional(),
  color: z.string().min(1).optional(),
  microchipId: z.string().optional(),
  pedigreeNumber: z.string().optional(),
  isStudAvailable: z.boolean().optional(),
  description: z.string().optional(),
  motherId: uuidSchema.optional(),
  fatherId: uuidSchema.optional(),
  litterNumber: z.string().max(10).optional(),
  website: z.string().url('Ungültige Website-URL').optional().or(z.literal('')),
  breedingStatus: z.enum(['VERSTORBEN', 'NICHT_VERFUEGBAR', 'WURF_GEPLANT', 'WURF_VORHANDEN']).optional(),
  isActive: z.boolean().optional()
})

// Health record validation schemas
export const createHealthRecordSchema = z.object({
  dogId: uuidSchema,
  recordType: z.enum(['VACCINATION', 'HEALTH_CERTIFICATE', 'BREEDING_CERTIFICATE', 'OTHER']),
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().optional(),
  recordDate: z.date().max(new Date(), 'Datum darf nicht in der Zukunft liegen'),
  expiryDate: z.date().optional(),
  veterinarian: z.string().optional(),
  documentUrl: z.string().url('Ungültige URL').optional()
})

export const updateHealthRecordSchema = z.object({
  recordType: z.enum(['VACCINATION', 'HEALTH_CERTIFICATE', 'BREEDING_CERTIFICATE', 'OTHER']).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  recordDate: z.date().max(new Date()).optional(),
  expiryDate: z.date().optional(),
  veterinarian: z.string().optional(),
  documentUrl: z.string().url().optional()
})

// Medical finding validation schemas
export const createMedicalFindingSchema = z.object({
  dogId: uuidSchema,
  date: z.date().max(new Date(), 'Datum darf nicht in der Zukunft liegen'),
  shortDescription: z.string().min(1, 'Kurzbezeichnung ist erforderlich').max(100, 'Kurzbezeichnung darf maximal 100 Zeichen haben'),
  remarks: z.string().optional()
})

export const updateMedicalFindingSchema = z.object({
  date: z.date().max(new Date()).optional(),
  shortDescription: z.string().min(1).max(100).optional(),
  remarks: z.string().optional()
})

// Award validation schemas
export const createAwardSchema = z.object({
  dogId: uuidSchema,
  code: z.string().min(1, 'Code ist erforderlich').max(50, 'Code darf maximal 50 Zeichen haben'),
  date: z.date().max(new Date(), 'Datum darf nicht in der Zukunft liegen').optional(),
  description: z.string().min(1, 'Beschreibung ist erforderlich').max(200, 'Beschreibung darf maximal 200 Zeichen haben'),
  issuer: z.string().min(1, 'Aussteller ist erforderlich').max(100, 'Aussteller darf maximal 100 Zeichen haben')
})

export const updateAwardSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  date: z.date().max(new Date()).optional(),
  description: z.string().min(1).max(200).optional(),
  issuer: z.string().min(1).max(100).optional()
})

// Genetic test validation schemas
export const createGeneticTestSchema = z.object({
  dogId: uuidSchema,
  testType: z.enum(['HD', 'ED', 'PRA', 'DM', 'VWD', 'OTHER']),
  testDate: z.date().max(new Date(), 'Testdatum darf nicht in der Zukunft liegen'),
  result: z.enum(['NORMAL', 'CARRIER', 'AFFECTED', 'UNKNOWN']),
  laboratory: z.string().min(1, 'Labor ist erforderlich').max(100, 'Labor darf maximal 100 Zeichen haben'),
  certificateNumber: z.string().max(50, 'Zertifikatsnummer darf maximal 50 Zeichen haben').optional(),
  notes: z.string().optional()
})

export const updateGeneticTestSchema = z.object({
  testType: z.enum(['HD', 'ED', 'PRA', 'DM', 'VWD', 'OTHER']).optional(),
  testDate: z.date().max(new Date()).optional(),
  result: z.enum(['NORMAL', 'CARRIER', 'AFFECTED', 'UNKNOWN']).optional(),
  laboratory: z.string().min(1).max(100).optional(),
  certificateNumber: z.string().max(50).optional(),
  notes: z.string().optional()
})

// Stud service validation schemas
export const createStudServiceSchema = z.object({
  studDogId: uuidSchema,
  isAvailable: z.boolean().default(true),
  price: z.number().positive('Preis muss positiv sein').optional(),
  description: z.string().optional(),
  contactInfo: z.string().min(1, 'Kontaktinformationen sind erforderlich'),
  location: z.string().optional()
})

export const updateStudServiceSchema = z.object({
  isAvailable: z.boolean().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  contactInfo: z.string().min(1).optional(),
  location: z.string().optional()
})

// Litter validation schemas
export const createLitterSchema = z.object({
  motherId: uuidSchema,
  fatherId: uuidSchema.optional(),
  litterNumber: z.string().min(1, 'Wurfnummer ist erforderlich').max(10, 'Wurfnummer darf maximal 10 Zeichen haben'),
  plannedDate: z.date().optional(),
  expectedDate: z.date().optional(),
  actualDate: z.date().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED']).default('PLANNED'),
  expectedPuppies: z.number().positive().optional(),
  actualPuppies: z.number().positive().optional(),
  puppyColors: z.record(z.string(), z.object({
    born: z.number().min(0),
    available: z.number().min(0)
  })).optional(),
  av: z.number().min(0).max(100).optional(),
  iz: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  contactInfo: z.string().optional(),
  price: z.number().positive().optional(),
  location: z.string().optional(),
  website: z.string().url('Ungültige Website-URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Ungültige Bild-URL').optional().or(z.literal(''))
}).refine((data) => {
  // puppyColors ist nur für BORN, RESERVED, SOLD erlaubt
  if (data.puppyColors && !['BORN', 'RESERVED', 'SOLD'].includes(data.status)) {
    return false
  }
  return true
}, {
  message: 'Welpenfarben sind nur für Status BORN, RESERVED oder SOLD erlaubt',
  path: ['puppyColors']
})

export const updateLitterSchema = z.object({
  fatherId: uuidSchema.optional(),
  litterNumber: z.string().min(1).max(10).optional(),
  plannedDate: z.date().optional(),
  expectedDate: z.date().optional(),
  actualDate: z.date().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'BORN', 'AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED']).optional(),
  expectedPuppies: z.number().positive().optional(),
  actualPuppies: z.number().positive().optional(),
  puppyColors: z.record(z.string(), z.object({
    born: z.number().min(0),
    available: z.number().min(0)
  })).optional(),
  av: z.number().min(0).max(100).optional(),
  iz: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  contactInfo: z.string().optional(),
  price: z.number().positive().optional(),
  location: z.string().optional(),
  website: z.string().url('Ungültige Website-URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Ungültige Bild-URL').optional().or(z.literal(''))
})

// Search and filter validation schemas
export const dogSearchSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['R', 'H']).optional(),
  color: z.string().optional(),
  ownerId: uuidSchema.optional(),
  isStudAvailable: z.boolean().optional(),
  birthDateFrom: z.date().optional(),
  birthDateTo: z.date().optional(),
  postalCode: postalCodeSchema.optional(),
  radius: z.number().positive().max(1000, 'Radius darf maximal 1000km sein').optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20)
})

export const userSearchSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.enum(['BREEDER', 'STUD_OWNER', 'ADMIN', 'MEMBER', 'EDITOR']).optional(),
  city: z.string().optional(),
  postalCode: postalCodeSchema.optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20)
})

// Import validation schemas
export const dogImportSchema = z.object({
  legacyId: z.string().min(1, 'Legacy ID ist erforderlich'),
  name: z.string().min(1),
  gender: z.enum(['R', 'H']),
  birthDate: z.date(),
  deathDate: z.date().optional(),
  color: z.string().min(1),
  microchipId: z.string().optional(),
  pedigreeNumber: z.string().optional(),
  isStudAvailable: z.boolean().default(false),
  description: z.string().optional(),
  motherId: z.string().optional(),
  fatherId: z.string().optional(),
  litterNumber: z.string().max(10).optional(),
  healthRecords: z.array(z.any()).optional(),
  medicalFindings: z.array(z.any()).optional(),
  awards: z.array(z.any()).optional(),
  geneticTests: z.array(z.any()).optional()
})

// Type exports for use in other packages
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateDogInput = z.infer<typeof createDogSchema>
export type UpdateDogInput = z.infer<typeof updateDogSchema>
export type CreateHealthRecordInput = z.infer<typeof createHealthRecordSchema>
export type UpdateHealthRecordInput = z.infer<typeof updateHealthRecordSchema>
export type CreateMedicalFindingInput = z.infer<typeof createMedicalFindingSchema>
export type UpdateMedicalFindingInput = z.infer<typeof updateMedicalFindingSchema>
export type CreateAwardInput = z.infer<typeof createAwardSchema>
export type UpdateAwardInput = z.infer<typeof updateAwardSchema>
export type CreateGeneticTestInput = z.infer<typeof createGeneticTestSchema>
export type UpdateGeneticTestInput = z.infer<typeof updateGeneticTestSchema>
export type CreateStudServiceInput = z.infer<typeof createStudServiceSchema>
export type UpdateStudServiceInput = z.infer<typeof updateStudServiceSchema>
export type CreateLitterInput = z.infer<typeof createLitterSchema>
export type UpdateLitterInput = z.infer<typeof updateLitterSchema>
export type DogSearchInput = z.infer<typeof dogSearchSchema>
export type UserSearchInput = z.infer<typeof userSearchSchema>
export type DogImportInput = z.infer<typeof dogImportSchema>
