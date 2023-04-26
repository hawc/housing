-- CreateTable
CREATE TABLE "_migration_internal_statements" (
    "statement_order" BIGINT NOT NULL,
    "statement_id" UUID NOT NULL,
    "data" JSONB,

    CONSTRAINT "_migration_internal_statements_pkey" PRIMARY KEY ("statement_order")
);

-- CreateTable
CREATE TABLE "architects" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "event_type" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "architects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detail_types" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "detail_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "details" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "detail_type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_types" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "event_type" INTEGER NOT NULL,
    "event_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_types" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "resource_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "resource_type" INTEGER NOT NULL,
    "url" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_type" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "resources" INTEGER,
    "details" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "settlement_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_type_architects" (
    "settlement_type_id" INTEGER NOT NULL,
    "architects_id" INTEGER NOT NULL,

    CONSTRAINT "settlement_type_architects_pkey" PRIMARY KEY ("settlement_type_id","architects_id")
);

-- CreateTable
CREATE TABLE "settlement_type_tags" (
    "settlement_type_id" INTEGER NOT NULL,
    "tags_id" INTEGER NOT NULL,

    CONSTRAINT "settlement_type_tags_pkey" PRIMARY KEY ("settlement_type_id","tags_id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" INTEGER NOT NULL,
    "title" VARCHAR,
    "description" TEXT,
    "events" INTEGER,
    "location" INTEGER,
    "resources" INTEGER,
    "details" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements_architects" (
    "settlements_id" INTEGER NOT NULL,
    "architects_id" INTEGER NOT NULL,

    CONSTRAINT "settlements_architects_pkey" PRIMARY KEY ("settlements_id","architects_id")
);

-- CreateTable
CREATE TABLE "settlements_settlement_type" (
    "settlements_id" INTEGER NOT NULL,
    "settlement_type_id" INTEGER NOT NULL,

    CONSTRAINT "settlements_settlement_type_pkey" PRIMARY KEY ("settlements_id","settlement_type_id")
);

-- CreateTable
CREATE TABLE "settlements_tags" (
    "settlements_id" INTEGER NOT NULL,
    "tags_id" INTEGER NOT NULL,

    CONSTRAINT "settlements_tags_pkey" PRIMARY KEY ("settlements_id","tags_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "_migration_internal_statements_statement_id_key" ON "_migration_internal_statements"("statement_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_types_name_key" ON "event_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resource_types_name_key" ON "resource_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "settlement_type_name_key" ON "settlement_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "details" ADD CONSTRAINT "details_detail_type_fkey" FOREIGN KEY ("detail_type") REFERENCES "detail_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_fkey" FOREIGN KEY ("event_type") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_resource_type_fkey" FOREIGN KEY ("resource_type") REFERENCES "resource_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlement_type" ADD CONSTRAINT "settlement_type_details_fkey" FOREIGN KEY ("details") REFERENCES "details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlement_type" ADD CONSTRAINT "settlement_type_resources_fkey" FOREIGN KEY ("resources") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlement_type_architects" ADD CONSTRAINT "settlement_type_architects_architects_id_fkey" FOREIGN KEY ("architects_id") REFERENCES "architects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlement_type_architects" ADD CONSTRAINT "settlement_type_architects_settlement_type_id_fkey" FOREIGN KEY ("settlement_type_id") REFERENCES "settlement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlement_type_tags" ADD CONSTRAINT "settlement_type_tags_settlement_type_id_fkey" FOREIGN KEY ("settlement_type_id") REFERENCES "settlement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlement_type_tags" ADD CONSTRAINT "settlement_type_tags_tags_id_fkey" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_details_fkey" FOREIGN KEY ("details") REFERENCES "details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_events_fkey" FOREIGN KEY ("events") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_location_fkey" FOREIGN KEY ("location") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_resources_fkey" FOREIGN KEY ("resources") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements_architects" ADD CONSTRAINT "settlements_architects_architects_id_fkey" FOREIGN KEY ("architects_id") REFERENCES "architects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements_architects" ADD CONSTRAINT "settlements_architects_settlements_id_fkey" FOREIGN KEY ("settlements_id") REFERENCES "settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements_settlement_type" ADD CONSTRAINT "settlements_settlement_type_settlement_type_id_fkey" FOREIGN KEY ("settlement_type_id") REFERENCES "settlement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements_settlement_type" ADD CONSTRAINT "settlements_settlement_type_settlements_id_fkey" FOREIGN KEY ("settlements_id") REFERENCES "settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements_tags" ADD CONSTRAINT "settlements_tags_settlements_id_fkey" FOREIGN KEY ("settlements_id") REFERENCES "settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "settlements_tags" ADD CONSTRAINT "settlements_tags_tags_id_fkey" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

