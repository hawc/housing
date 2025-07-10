-- AlterTable
ALTER TABLE "Architects" ADD COLUMN     "born" DATE;
ALTER TABLE "Architects" ADD COLUMN     "died" DATE;

-- AlterTable
ALTER TABLE "Locations" ADD COLUMN     "geo" JSONB;
