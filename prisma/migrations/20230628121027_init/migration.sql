-- CreateTable
CREATE TABLE "Settlements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" STRING,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementTypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Architects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Architects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "detailTypeId" UUID NOT NULL,
    "settlementId" UUID,
    "settlementTypeId" UUID,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "eventDate" TIMESTAMP(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventTypeId" UUID NOT NULL,
    "settlementId" UUID NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "url" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceTypeId" UUID NOT NULL,
    "settlementId" UUID,
    "settlementTypeId" UUID,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "lat" FLOAT8 NOT NULL DEFAULT 0.0,
    "lng" FLOAT8 NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settlementId" UUID NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailTypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceTypes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementTypesOnArchitects" (
    "settlementTypeId" UUID NOT NULL,
    "architectId" UUID NOT NULL,

    CONSTRAINT "SettlementTypesOnArchitects_pkey" PRIMARY KEY ("settlementTypeId","architectId")
);

-- CreateTable
CREATE TABLE "SettlementTypesOnTags" (
    "settlementTypeId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "SettlementTypesOnTags_pkey" PRIMARY KEY ("settlementTypeId","tagId")
);

-- CreateTable
CREATE TABLE "SettlementsOnArchitects" (
    "settlementId" UUID NOT NULL,
    "architectId" UUID NOT NULL,

    CONSTRAINT "SettlementsOnArchitects_pkey" PRIMARY KEY ("settlementId","architectId")
);

-- CreateTable
CREATE TABLE "SettlementsOnSettlementTypes" (
    "settlementId" UUID NOT NULL,
    "settlementTypeId" UUID NOT NULL,

    CONSTRAINT "SettlementsOnSettlementTypes_pkey" PRIMARY KEY ("settlementId","settlementTypeId")
);

-- CreateTable
CREATE TABLE "SettlementsOnTags" (
    "settlementId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "SettlementsOnTags_pkey" PRIMARY KEY ("settlementId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SettlementTypes_name_key" ON "SettlementTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_settlementId_key" ON "Locations"("settlementId");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventTypes_name_key" ON "EventTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceTypes_name_key" ON "ResourceTypes"("name");

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_detailTypeId_fkey" FOREIGN KEY ("detailTypeId") REFERENCES "DetailTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_resourceTypeId_fkey" FOREIGN KEY ("resourceTypeId") REFERENCES "ResourceTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementTypesOnArchitects" ADD CONSTRAINT "SettlementTypesOnArchitects_architectId_fkey" FOREIGN KEY ("architectId") REFERENCES "Architects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementTypesOnArchitects" ADD CONSTRAINT "SettlementTypesOnArchitects_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementTypesOnTags" ADD CONSTRAINT "SettlementTypesOnTags_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementTypesOnTags" ADD CONSTRAINT "SettlementTypesOnTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnArchitects" ADD CONSTRAINT "SettlementsOnArchitects_architectId_fkey" FOREIGN KEY ("architectId") REFERENCES "Architects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnArchitects" ADD CONSTRAINT "SettlementsOnArchitects_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnSettlementTypes" ADD CONSTRAINT "SettlementsOnSettlementTypes_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnSettlementTypes" ADD CONSTRAINT "SettlementsOnSettlementTypes_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnTags" ADD CONSTRAINT "SettlementsOnTags_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnTags" ADD CONSTRAINT "SettlementsOnTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
