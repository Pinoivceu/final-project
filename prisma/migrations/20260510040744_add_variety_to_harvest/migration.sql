/*
  Warnings:

  - You are about to drop the column `activeBranches` on the `plants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "harvests" ADD COLUMN     "variety" TEXT;

-- AlterTable
ALTER TABLE "plants" DROP COLUMN "activeBranches";
