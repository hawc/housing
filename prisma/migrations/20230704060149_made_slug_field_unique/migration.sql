/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `SettlementTypes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Settlements` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Settlements` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `SettlementTypes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Settlements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SettlementTypes" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "Settlements" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SettlementTypes_slug_key" ON "SettlementTypes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_name_key" ON "Settlements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Settlements_slug_key" ON "Settlements"("slug");
