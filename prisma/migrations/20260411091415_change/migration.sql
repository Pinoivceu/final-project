/*
  Warnings:

  - The primary key for the `lands` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "harvests" DROP CONSTRAINT "harvests_landId_fkey";

-- DropForeignKey
ALTER TABLE "plants" DROP CONSTRAINT "plants_landId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_landId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_logs" DROP CONSTRAINT "treatment_logs_landId_fkey";

-- AlterTable
ALTER TABLE "harvests" ALTER COLUMN "landId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "lands" DROP CONSTRAINT "lands_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "lands_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "lands_id_seq";

-- AlterTable
ALTER TABLE "plants" ALTER COLUMN "landId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "landId" SET DATA TYPE TEXT,
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tasks_id_seq";

-- AlterTable
ALTER TABLE "treatment_logs" ALTER COLUMN "landId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "plants" ADD CONSTRAINT "plants_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatment_logs" ADD CONSTRAINT "treatment_logs_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_landId_fkey" FOREIGN KEY ("landId") REFERENCES "lands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
