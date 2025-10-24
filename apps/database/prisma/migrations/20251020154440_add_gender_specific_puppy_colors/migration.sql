/*
  Warnings:

  - You are about to drop the column `blackAvailable` on the `litters` table. All the data in the column will be lost.
  - You are about to drop the column `blackBorn` on the `litters` table. All the data in the column will be lost.
  - You are about to drop the column `blackmarkenAvailable` on the `litters` table. All the data in the column will be lost.
  - You are about to drop the column `blackmarkenBorn` on the `litters` table. All the data in the column will be lost.
  - You are about to drop the column `blondAvailable` on the `litters` table. All the data in the column will be lost.
  - You are about to drop the column `blondBorn` on the `litters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "litters" DROP COLUMN "blackAvailable",
DROP COLUMN "blackBorn",
DROP COLUMN "blackmarkenAvailable",
DROP COLUMN "blackmarkenBorn",
DROP COLUMN "blondAvailable",
DROP COLUMN "blondBorn",
ADD COLUMN     "blackFemaleAvailable" INTEGER,
ADD COLUMN     "blackFemaleBorn" INTEGER,
ADD COLUMN     "blackMaleAvailable" INTEGER,
ADD COLUMN     "blackMaleBorn" INTEGER,
ADD COLUMN     "blackmarkenFemaleAvailable" INTEGER,
ADD COLUMN     "blackmarkenFemaleBorn" INTEGER,
ADD COLUMN     "blackmarkenMaleAvailable" INTEGER,
ADD COLUMN     "blackmarkenMaleBorn" INTEGER,
ADD COLUMN     "blondFemaleAvailable" INTEGER,
ADD COLUMN     "blondFemaleBorn" INTEGER,
ADD COLUMN     "blondMaleAvailable" INTEGER,
ADD COLUMN     "blondMaleBorn" INTEGER;
