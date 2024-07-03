/*
  Warnings:

  - You are about to drop the column `architectsId` on the `ExternalLinks` table. All the data in the column will be lost.
  - You are about to drop the column `platformsId` on the `ExternalLinks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExternalLinks" DROP CONSTRAINT "ExternalLinks_architectsId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalLinks" DROP CONSTRAINT "ExternalLinks_platformsId_fkey";

-- AlterTable
ALTER TABLE "ExternalLinks" DROP COLUMN "architectsId";
ALTER TABLE "ExternalLinks" DROP COLUMN "platformsId";
ALTER TABLE "ExternalLinks" ADD COLUMN     "architectId" UUID;
ALTER TABLE "ExternalLinks" ADD COLUMN     "platformId" UUID;

-- AddForeignKey
ALTER TABLE "ExternalLinks" ADD CONSTRAINT "ExternalLinks_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLinks" ADD CONSTRAINT "ExternalLinks_architectId_fkey" FOREIGN KEY ("architectId") REFERENCES "Architects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
