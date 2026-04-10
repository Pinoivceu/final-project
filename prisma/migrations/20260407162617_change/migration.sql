/*
  Warnings:

  - The `coordinates` column on the `lands` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "lands" DROP COLUMN "coordinates",
ADD COLUMN     "coordinates" JSONB;
