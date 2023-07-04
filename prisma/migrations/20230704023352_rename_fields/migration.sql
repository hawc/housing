/*
  Warnings:

  - Made the column `name` on table `Settlements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Settlements" ALTER COLUMN "name" SET NOT NULL;
