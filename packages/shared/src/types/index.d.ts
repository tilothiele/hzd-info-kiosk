export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    memberNumber?: string;
    avatarUrl?: string;
    memberSince?: Date;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country: string;
    website?: string;
    kennelName?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    dogs?: Dog[];
    studServices?: StudService[];
    litters?: Litter[];
    userRoles: UserRole[];
}
export interface UserRole {
    id: string;
    userId: string;
    role: UserRoleType;
    isActive: boolean;
    assignedAt: Date;
    assignedBy?: string;
    user?: User;
    assignedByUser?: User;
}
export interface Dog {
    id: string;
    name: string;
    gender: Gender;
    birthDate: Date;
    deathDate?: Date;
    color: string;
    microchipId?: string;
    pedigreeNumber?: string;
    isStudAvailable: boolean;
    isActive: boolean;
    description?: string;
    ownerId: string;
    motherId?: string;
    fatherId?: string;
    litterNumber?: string;
    website?: string;
    breedingStatus?: BreedingStatus;
    createdAt: Date;
    updatedAt: Date;
    owner?: User;
    mother?: Dog;
    father?: Dog;
    offspringAsMother?: Dog[];
    offspringAsFather?: Dog[];
    littersAsMother?: Litter[];
    littersAsFather?: Litter[];
    litter?: Litter;
    litterId?: string;
    healthRecords?: HealthRecord[];
    medicalFindings?: MedicalFinding[];
    awards?: Award[];
    geneticTests?: GeneticTest[];
    studServices?: StudService[];
}
export interface HealthRecord {
    id: string;
    dogId: string;
    recordType: HealthRecordType;
    title: string;
    description?: string;
    recordDate: Date;
    expiryDate?: Date;
    veterinarian?: string;
    documentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    dog?: Dog;
}
export interface MedicalFinding {
    id: string;
    dogId: string;
    date: Date;
    shortDescription: string;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
    dog?: Dog;
}
export interface Award {
    id: string;
    dogId: string;
    code: string;
    date?: Date;
    description: string;
    issuer: string;
    createdAt: Date;
    updatedAt: Date;
    dog?: Dog;
}
export interface GeneticTest {
    id: string;
    dogId: string;
    testType: GeneticTestType;
    testDate: Date;
    result: GeneticTestResult;
    laboratory: string;
    certificateNumber?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    dog?: Dog;
}
export interface StudService {
    id: string;
    studDogId: string;
    ownerId: string;
    isAvailable: boolean;
    price?: number;
    description?: string;
    contactInfo: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
    studDog?: Dog;
    owner?: User;
}
export interface Litter {
    id: string;
    motherId: string;
    fatherId?: string;
    breederId: string;
    litterNumber: string;
    litterSequence?: string;
    plannedDate?: Date;
    expectedDate?: Date;
    actualDate?: Date;
    status: LitterStatus;
    expectedPuppies?: number;
    actualPuppies?: number;
    puppyColors?: Record<string, {
        born: number;
        available: number;
    }>;
    av?: number;
    iz?: number;
    description?: string;
    isPublic: boolean;
    contactInfo?: string;
    price?: number;
    location?: string;
    website?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    mother?: Dog;
    father?: Dog;
    breeder?: User;
    puppies?: Dog[];
}
export declare enum Gender {
    R = "R",
    H = "H"
}
export declare enum UserRoleType {
    BREEDER = "BREEDER",
    STUD_OWNER = "STUD_OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    EDITOR = "EDITOR"
}
export declare enum HealthRecordType {
    VACCINATION = "VACCINATION",
    HEALTH_CERTIFICATE = "HEALTH_CERTIFICATE",
    BREEDING_CERTIFICATE = "BREEDING_CERTIFICATE",
    OTHER = "OTHER"
}
export declare enum GeneticTestType {
    HD = "HD",
    ED = "ED",
    PRA = "PRA",
    DM = "DM",
    VWD = "VWD",
    OTHER = "OTHER"
}
export declare enum GeneticTestResult {
    NORMAL = "NORMAL",
    CARRIER = "CARRIER",
    AFFECTED = "AFFECTED",
    UNKNOWN = "UNKNOWN"
}
export declare enum LitterStatus {
    PLANNED = "PLANNED",
    IN_PROGRESS = "IN_PROGRESS",
    BORN = "BORN",
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    SOLD = "SOLD",
    CANCELLED = "CANCELLED"
}
export declare enum BreedingStatus {
    VERSTORBEN = "VERSTORBEN",
    NICHT_VERFUEGBAR = "NICHT_VERFUEGBAR",
    WURF_GEPLANT = "WURF_GEPLANT",
    WURF_VORHANDEN = "WURF_VORHANDEN"
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface DogSearchFilters {
    name?: string;
    gender?: Gender;
    color?: string;
    ownerId?: string;
    isStudAvailable?: boolean;
    birthDateFrom?: Date;
    birthDateTo?: Date;
    postalCode?: string;
    radius?: number;
}
export interface UserSearchFilters {
    name?: string;
    email?: string;
    role?: UserRoleType;
    city?: string;
    postalCode?: string;
}
export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    roles: UserRoleType[];
}
export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
}
export interface CreateDogRequest {
    name: string;
    gender: Gender;
    birthDate: Date;
    deathDate?: Date;
    color: string;
    microchipId?: string;
    pedigreeNumber?: string;
    isStudAvailable?: boolean;
    description?: string;
    motherId?: string;
    fatherId?: string;
    litterNumber?: string;
}
export interface UpdateDogRequest {
    name?: string;
    gender?: Gender;
    birthDate?: Date;
    deathDate?: Date;
    color?: string;
    microchipId?: string;
    pedigreeNumber?: string;
    isStudAvailable?: boolean;
    description?: string;
    motherId?: string;
    fatherId?: string;
    litterNumber?: string;
    isActive?: boolean;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: User;
    token: string;
    expiresIn: number;
}
export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}
export interface DogImport {
    legacyId: string;
    name: string;
    gender: Gender;
    birthDate: Date;
    deathDate?: Date;
    color: string;
    microchipId?: string;
    pedigreeNumber?: string;
    isStudAvailable?: boolean;
    description?: string;
    motherId?: string;
    fatherId?: string;
    litterNumber?: string;
    healthRecords?: HealthRecordImport[];
    medicalFindings?: MedicalFindingImport[];
    awards?: AwardImport[];
    geneticTests?: GeneticTestImport[];
}
export interface HealthRecordImport {
    legacyId: string;
    recordType: HealthRecordType;
    title: string;
    description?: string;
    recordDate: Date;
    expiryDate?: Date;
    veterinarian?: string;
    documentUrl?: string;
}
export interface MedicalFindingImport {
    legacyId: string;
    date: Date;
    shortDescription: string;
    remarks?: string;
}
export interface AwardImport {
    legacyId: string;
    code: string;
    date?: Date;
    description: string;
    issuer: string;
}
export interface GeneticTestImport {
    legacyId: string;
    testType: GeneticTestType;
    testDate: Date;
    result: GeneticTestResult;
    laboratory: string;
    certificateNumber?: string;
    notes?: string;
}
export interface ImportResult {
    success: boolean;
    dogId?: string;
    legacyId: string;
    errors?: string[];
}
export interface BatchImportResult {
    total: number;
    successful: number;
    failed: number;
    results: ImportResult[];
}
//# sourceMappingURL=index.d.ts.map