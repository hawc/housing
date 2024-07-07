/*
  Warnings:

  - A unique constraint covering the columns `[urlIdentifier]` on the table `Platforms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Platforms" ADD COLUMN     "urlIdentifier" STRING;

-- CreateIndex
CREATE UNIQUE INDEX "Platforms_urlIdentifier_key" ON "Platforms"("urlIdentifier");
