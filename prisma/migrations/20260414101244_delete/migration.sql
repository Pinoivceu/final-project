/*
  Warnings:

  - You are about to drop the column `mandorId` on the `harvests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "harvests" DROP CONSTRAINT "harvests_mandorId_fkey";

-- AlterTable
ALTER TABLE "harvests" DROP COLUMN "mandorId";
