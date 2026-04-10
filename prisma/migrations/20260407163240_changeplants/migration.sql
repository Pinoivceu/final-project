/*
  Warnings:

  - The `locationCoordinate` column on the `plants` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "plants" DROP COLUMN "locationCoordinate",
ADD COLUMN     "locationCoordinate" JSONB;
