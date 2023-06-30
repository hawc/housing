-- AlterTable
ALTER TABLE "DetailTypes" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Details" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EventTypes" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Locations" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ResourceTypes" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Resources" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "SettlementTypes" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "published" BOOL NOT NULL DEFAULT true;
