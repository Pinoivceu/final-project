/*
  Warnings:

  - You are about to drop the column `ownerId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_ownerId_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "ownerId";
