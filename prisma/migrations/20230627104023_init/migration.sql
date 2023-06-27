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
    "detailTypesId" UUID NOT NULL,
    "settlementsId" UUID,
    "settlementTypesId" UUID,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "description" STRING,
    "event_date" TIMESTAMP(6),
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
    "lat" FLOAT8 NOT NULL DEFAULT 0,
    "lng" FLOAT8 NOT NULL DEFAULT 0,
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
CREATE TABLE "SettlementTypeOnArchitects" (
    "settlementTypeId" UUID NOT NULL,
    "architectsId" UUID NOT NULL,

    CONSTRAINT "SettlementTypeOnArchitects_pkey" PRIMARY KEY ("settlementTypeId","architectsId")
);

-- CreateTable
CREATE TABLE "SettlementTypeOnTags" (
    "settlementTypeId" UUID NOT NULL,
    "tagsId" UUID NOT NULL,

    CONSTRAINT "SettlementTypeOnTags_pkey" PRIMARY KEY ("settlementTypeId","tagsId")
);

-- CreateTable
CREATE TABLE "SettlementsOnArchitects" (
    "settlementsId" UUID NOT NULL,
    "architectsId" UUID NOT NULL,

    CONSTRAINT "SettlementsOnArchitects_pkey" PRIMARY KEY ("settlementsId","architectsId")
);

-- CreateTable
CREATE TABLE "SettlementsOnSettlementType" (
    "settlementsId" UUID NOT NULL,
    "settlementTypeId" UUID NOT NULL,

    CONSTRAINT "SettlementsOnSettlementType_pkey" PRIMARY KEY ("settlementsId","settlementTypeId")
);

-- CreateTable
CREATE TABLE "SettlementsOnTags" (
    "settlementsId" UUID NOT NULL,
    "tagsId" UUID NOT NULL,

    CONSTRAINT "SettlementsOnTags_pkey" PRIMARY KEY ("settlementsId","tagsId")
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
ALTER TABLE "Details" ADD CONSTRAINT "Details_detailTypesId_fkey" FOREIGN KEY ("detailTypesId") REFERENCES "DetailTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_settlementsId_fkey" FOREIGN KEY ("settlementsId") REFERENCES "Settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_settlementTypesId_fkey" FOREIGN KEY ("settlementTypesId") REFERENCES "SettlementTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "SettlementTypeOnArchitects" ADD CONSTRAINT "SettlementTypeOnArchitects_architectsId_fkey" FOREIGN KEY ("architectsId") REFERENCES "Architects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementTypeOnArchitects" ADD CONSTRAINT "SettlementTypeOnArchitects_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementTypeOnTags" ADD CONSTRAINT "SettlementTypeOnTags_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementTypeOnTags" ADD CONSTRAINT "SettlementTypeOnTags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnArchitects" ADD CONSTRAINT "SettlementsOnArchitects_architectsId_fkey" FOREIGN KEY ("architectsId") REFERENCES "Architects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnArchitects" ADD CONSTRAINT "SettlementsOnArchitects_settlementsId_fkey" FOREIGN KEY ("settlementsId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnSettlementType" ADD CONSTRAINT "SettlementsOnSettlementType_settlementTypeId_fkey" FOREIGN KEY ("settlementTypeId") REFERENCES "SettlementTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnSettlementType" ADD CONSTRAINT "SettlementsOnSettlementType_settlementsId_fkey" FOREIGN KEY ("settlementsId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnTags" ADD CONSTRAINT "SettlementsOnTags_settlementsId_fkey" FOREIGN KEY ("settlementsId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SettlementsOnTags" ADD CONSTRAINT "SettlementsOnTags_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
