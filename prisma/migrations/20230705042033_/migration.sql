/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Architects` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Architects` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Architects" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Architects_slug_key" ON "Architects"("slug");
