-- AlterTable
ALTER TABLE "Locations" ADD COLUMN     "address" STRING;
ALTER TABLE "Locations" ADD COLUMN     "city" STRING;
ALTER TABLE "Locations" ADD COLUMN     "district" STRING;
ALTER TABLE "Locations" ADD COLUMN     "zipCode" STRING;
ALTER TABLE "Locations" ALTER COLUMN "name" DROP NOT NULL;
