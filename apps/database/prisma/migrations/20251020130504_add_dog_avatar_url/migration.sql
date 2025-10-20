/*
  Warnings:

  - You are about to drop the column `latitude` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `gender` on the `dogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `testType` on the `genetic_tests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `result` on the `genetic_tests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recordType` on the `health_records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user_roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_latitude_longitude_idx";

-- AlterTable
ALTER TABLE "awards" ALTER COLUMN "code" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "issuer" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "dogs" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "breedingStatus" TEXT,
ADD COLUMN     "litterId" TEXT,
ADD COLUMN     "website" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL,
ALTER COLUMN "litterNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "genetic_tests" DROP COLUMN "testType",
ADD COLUMN     "testType" TEXT NOT NULL,
DROP COLUMN "result",
ADD COLUMN     "result" TEXT NOT NULL,
ALTER COLUMN "laboratory" SET DATA TYPE TEXT,
ALTER COLUMN "certificateNumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "health_records" DROP COLUMN "recordType",
ADD COLUMN     "recordType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medical_findings" ALTER COLUMN "shortDescription" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_roles" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "kennelName" TEXT,
ADD COLUMN     "memberNumber" TEXT,
ADD COLUMN     "memberSince" TIMESTAMP(3),
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- DropEnum
DROP TYPE "public"."Gender";

-- DropEnum
DROP TYPE "public"."GeneticTestResult";

-- DropEnum
DROP TYPE "public"."GeneticTestType";

-- DropEnum
DROP TYPE "public"."HealthRecordType";

-- DropEnum
DROP TYPE "public"."UserRoleType";

-- CreateTable
CREATE TABLE "litters" (
    "id" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "fatherId" TEXT,
    "breederId" TEXT NOT NULL,
    "litterNumber" TEXT NOT NULL,
    "litterSequence" TEXT,
    "plannedDate" TIMESTAMP(3),
    "expectedDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "expectedPuppies" INTEGER,
    "actualPuppies" INTEGER,
    "puppyColors" JSONB,
    "av" DECIMAL(65,30),
    "iz" DECIMAL(65,30),
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "contactInfo" TEXT,
    "price" DECIMAL(65,30),
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "litters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "litters_motherId_idx" ON "litters"("motherId");

-- CreateIndex
CREATE INDEX "litters_fatherId_idx" ON "litters"("fatherId");

-- CreateIndex
CREATE INDEX "litters_breederId_idx" ON "litters"("breederId");

-- CreateIndex
CREATE INDEX "litters_status_idx" ON "litters"("status");

-- CreateIndex
CREATE INDEX "litters_isPublic_idx" ON "litters"("isPublic");

-- CreateIndex
CREATE INDEX "litters_plannedDate_idx" ON "litters"("plannedDate");

-- CreateIndex
CREATE INDEX "litters_expectedDate_idx" ON "litters"("expectedDate");

-- CreateIndex
CREATE INDEX "litters_actualDate_idx" ON "litters"("actualDate");

-- CreateIndex
CREATE UNIQUE INDEX "litters_motherId_litterNumber_key" ON "litters"("motherId", "litterNumber");

-- CreateIndex
CREATE INDEX "dogs_gender_idx" ON "dogs"("gender");

-- CreateIndex
CREATE INDEX "dogs_litterId_idx" ON "dogs"("litterId");

-- CreateIndex
CREATE INDEX "genetic_tests_testType_idx" ON "genetic_tests"("testType");

-- CreateIndex
CREATE INDEX "genetic_tests_result_idx" ON "genetic_tests"("result");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_role_key" ON "user_roles"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_memberNumber_key" ON "users"("memberNumber");

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_litterId_fkey" FOREIGN KEY ("litterId") REFERENCES "litters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "litters" ADD CONSTRAINT "litters_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "litters" ADD CONSTRAINT "litters_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "dogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "litters" ADD CONSTRAINT "litters_breederId_fkey" FOREIGN KEY ("breederId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
