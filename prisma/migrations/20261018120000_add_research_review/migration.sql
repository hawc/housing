-- CreateEnum
CREATE TYPE "ResearchStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProposalKind" AS ENUM ('DETAIL', 'RESOURCE');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'APPLIED', 'REJECTED', 'STALE');

-- CreateTable
CREATE TABLE "ResearchRun" (
    "id" UUID NOT NULL,
    "createdBy" STRING NOT NULL,
    "model" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchJob" (
    "id" UUID NOT NULL,
    "runId" UUID NOT NULL,
    "settlementId" UUID NOT NULL,
    "status" "ResearchStatus" NOT NULL DEFAULT 'QUEUED',
    "leaseToken" STRING,
    "leaseUntil" TIMESTAMP(3),
    "attempts" INT4 NOT NULL DEFAULT 0,
    "error" STRING,
    "notes" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ResearchJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchSource" (
    "id" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "url" STRING NOT NULL,
    "title" STRING NOT NULL,
    "contentHash" STRING NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeProposal" (
    "id" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "settlementId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "kind" "ProposalKind" NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "revision" INT4 NOT NULL DEFAULT 1,
    "fingerprint" STRING NOT NULL,
    "payload" JSONB NOT NULL,
    "baseline" JSONB NOT NULL,
    "evidence" STRING NOT NULL,
    "locator" STRING NOT NULL,
    "warnings" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" STRING,
    "reviewNote" STRING,

    CONSTRAINT "ChangeProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeLog" (
    "id" UUID NOT NULL,
    "proposalId" UUID NOT NULL,
    "kind" "ProposalKind" NOT NULL,
    "resultId" UUID NOT NULL,
    "before" JSONB NOT NULL,
    "after" JSONB NOT NULL,
    "reviewedBy" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchWorker" (
    "id" STRING NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchWorker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchJob_status_createdAt_idx" ON "ResearchJob"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchJob_runId_settlementId_key" ON "ResearchJob"("runId", "settlementId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchSource_jobId_url_key" ON "ResearchSource"("jobId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "ChangeProposal_fingerprint_key" ON "ChangeProposal"("fingerprint");

-- CreateIndex
CREATE INDEX "ChangeProposal_status_createdAt_idx" ON "ChangeProposal"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChangeLog_proposalId_key" ON "ChangeLog"("proposalId");

-- AddForeignKey
ALTER TABLE "ResearchJob" ADD CONSTRAINT "ResearchJob_runId_fkey" FOREIGN KEY ("runId") REFERENCES "ResearchRun"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ResearchJob" ADD CONSTRAINT "ResearchJob_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ResearchSource" ADD CONSTRAINT "ResearchSource_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ResearchJob"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ChangeProposal" ADD CONSTRAINT "ChangeProposal_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "ResearchJob"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ChangeProposal" ADD CONSTRAINT "ChangeProposal_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ChangeProposal" ADD CONSTRAINT "ChangeProposal_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ResearchSource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "ChangeProposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
