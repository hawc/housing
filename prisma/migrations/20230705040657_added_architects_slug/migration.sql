/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Architects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Architects" ADD COLUMN     "slug" STRING;

-- CreateIndex
CREATE UNIQUE INDEX "Architects_name_key" ON "Architects"("name");
