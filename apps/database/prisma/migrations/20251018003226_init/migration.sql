-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('BREEDER', 'STUD_OWNER', 'ADMIN', 'MEMBER', 'EDITOR');

-- CreateEnum
CREATE TYPE "HealthRecordType" AS ENUM ('VACCINATION', 'HEALTH_CERTIFICATE', 'BREEDING_CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "GeneticTestType" AS ENUM ('HD', 'ED', 'PRA', 'DM', 'VWD', 'OTHER');

-- CreateEnum
CREATE TYPE "GeneticTestResult" AS ENUM ('NORMAL', 'CARRIER', 'AFFECTED', 'UNKNOWN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Deutschland',
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRoleType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dogs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "deathDate" TIMESTAMP(3),
    "color" TEXT NOT NULL,
    "microchipId" TEXT,
    "pedigreeNumber" TEXT,
    "isStudAvailable" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "motherId" TEXT,
    "fatherId" TEXT,
    "litterNumber" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_records" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "recordType" "HealthRecordType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "veterinarian" TEXT,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_findings" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "shortDescription" VARCHAR(100) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awards" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "date" TIMESTAMP(3),
    "description" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genetic_tests" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "testType" "GeneticTestType" NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "result" "GeneticTestResult" NOT NULL,
    "laboratory" VARCHAR(100) NOT NULL,
    "certificateNumber" VARCHAR(50),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genetic_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stud_services" (
    "id" TEXT NOT NULL,
    "studDogId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "price" DECIMAL(65,30),
    "description" TEXT,
    "contactInfo" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stud_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_postalCode_idx" ON "users"("postalCode");

-- CreateIndex
CREATE INDEX "users_latitude_longitude_idx" ON "users"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_role_key" ON "user_roles"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "dogs_microchipId_key" ON "dogs"("microchipId");

-- CreateIndex
CREATE UNIQUE INDEX "dogs_pedigreeNumber_key" ON "dogs"("pedigreeNumber");

-- CreateIndex
CREATE INDEX "dogs_name_idx" ON "dogs"("name");

-- CreateIndex
CREATE INDEX "dogs_gender_idx" ON "dogs"("gender");

-- CreateIndex
CREATE INDEX "dogs_birthDate_idx" ON "dogs"("birthDate");

-- CreateIndex
CREATE INDEX "dogs_deathDate_idx" ON "dogs"("deathDate");

-- CreateIndex
CREATE INDEX "dogs_color_idx" ON "dogs"("color");

-- CreateIndex
CREATE INDEX "dogs_ownerId_idx" ON "dogs"("ownerId");

-- CreateIndex
CREATE INDEX "dogs_motherId_idx" ON "dogs"("motherId");

-- CreateIndex
CREATE INDEX "dogs_fatherId_idx" ON "dogs"("fatherId");

-- CreateIndex
CREATE INDEX "dogs_litterNumber_idx" ON "dogs"("litterNumber");

-- CreateIndex
CREATE INDEX "dogs_isStudAvailable_idx" ON "dogs"("isStudAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "dogs_motherId_litterNumber_key" ON "dogs"("motherId", "litterNumber");

-- CreateIndex
CREATE INDEX "health_records_dogId_idx" ON "health_records"("dogId");

-- CreateIndex
CREATE INDEX "health_records_recordDate_idx" ON "health_records"("recordDate");

-- CreateIndex
CREATE INDEX "health_records_expiryDate_idx" ON "health_records"("expiryDate");

-- CreateIndex
CREATE INDEX "medical_findings_dogId_idx" ON "medical_findings"("dogId");

-- CreateIndex
CREATE INDEX "medical_findings_date_idx" ON "medical_findings"("date");

-- CreateIndex
CREATE INDEX "medical_findings_shortDescription_idx" ON "medical_findings"("shortDescription");

-- CreateIndex
CREATE INDEX "awards_dogId_idx" ON "awards"("dogId");

-- CreateIndex
CREATE INDEX "awards_code_idx" ON "awards"("code");

-- CreateIndex
CREATE INDEX "awards_date_idx" ON "awards"("date");

-- CreateIndex
CREATE INDEX "awards_issuer_idx" ON "awards"("issuer");

-- CreateIndex
CREATE INDEX "genetic_tests_dogId_idx" ON "genetic_tests"("dogId");

-- CreateIndex
CREATE INDEX "genetic_tests_testType_idx" ON "genetic_tests"("testType");

-- CreateIndex
CREATE INDEX "genetic_tests_testDate_idx" ON "genetic_tests"("testDate");

-- CreateIndex
CREATE INDEX "genetic_tests_result_idx" ON "genetic_tests"("result");

-- CreateIndex
CREATE INDEX "genetic_tests_laboratory_idx" ON "genetic_tests"("laboratory");

-- CreateIndex
CREATE INDEX "stud_services_studDogId_idx" ON "stud_services"("studDogId");

-- CreateIndex
CREATE INDEX "stud_services_isAvailable_idx" ON "stud_services"("isAvailable");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "dogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "dogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_findings" ADD CONSTRAINT "medical_findings_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awards" ADD CONSTRAINT "awards_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genetic_tests" ADD CONSTRAINT "genetic_tests_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stud_services" ADD CONSTRAINT "stud_services_studDogId_fkey" FOREIGN KEY ("studDogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stud_services" ADD CONSTRAINT "stud_services_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
