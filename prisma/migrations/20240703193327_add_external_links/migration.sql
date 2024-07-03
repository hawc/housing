-- CreateTable
CREATE TABLE "Platforms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "description" STRING,
    "url" STRING,
    "published" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalLinks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING,
    "description" STRING,
    "url" STRING NOT NULL,
    "published" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "architectsId" UUID,
    "platformsId" UUID,

    CONSTRAINT "ExternalLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platforms_name_key" ON "Platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Platforms_slug_key" ON "Platforms"("slug");

-- AddForeignKey
ALTER TABLE "ExternalLinks" ADD CONSTRAINT "ExternalLinks_platformsId_fkey" FOREIGN KEY ("platformsId") REFERENCES "Platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLinks" ADD CONSTRAINT "ExternalLinks_architectsId_fkey" FOREIGN KEY ("architectsId") REFERENCES "Architects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
