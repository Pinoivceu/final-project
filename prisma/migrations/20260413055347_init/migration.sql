/*
  Warnings:

  - You are about to drop the column `photoEvidenceId` on the `harvests` table. All the data in the column will be lost.
  - The primary key for the `lands` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `lands` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `landId` on the `harvests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `landId` on the `plants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `landId` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `landId` on the `treatment_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "harvests" DROP CONSTRAINT "harvests_landId_fkey";

-- DropForeignKey
ALTER TABLE "harvests" DROP CONSTRAINT "harvests_photoEvidenceId_fkey";

-- DropForeignKey
ALTER TABLE "plants" DROP CONSTRAINT "plants_landId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_landId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_logs" DROP CONSTRAINT "treatment_logs_landId_fkey";

-- AlterTable
ALTER TABLE "harvests" DROP COLUMN "photoEvidenceId",
DROP COLUMN "landId",
ADD COLUMN     "landId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lands" DROP CONSTRAINT "lands_pkey",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "lands_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "plants" DROP COLUMN "landId",
ADD COLUMN     "landId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "landId",
ADD COLUMN     "landId" INTEGER NOT NULL,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "treatment_logs" DROP COLUMN "landId",
ADD COLUMN     "landId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_logs" ADD CONSTRAINT "treatment_logs_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
