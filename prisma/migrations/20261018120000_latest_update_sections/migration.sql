-- AlterTable
ALTER TABLE "Settlements" ADD COLUMN     "updatedSections" STRING[] DEFAULT ARRAY[]::STRING[];

-- AlterTable
ALTER TABLE "Architects" ADD COLUMN     "updatedSections" STRING[] DEFAULT ARRAY[]::STRING[];

