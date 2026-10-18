import { randomUUID } from 'node:crypto';
import prisma from '../prisma';
import { researchConfigured, researchSettlement } from './provider';
import {
  isSourceResourceType,
  persistResearch,
  settlementResearchInclude,
  transaction,
} from './service';
import { ResearchError } from './validation';

export async function workOnce() {
  const job = await transaction(prisma, async (tx) => {
    // A crashed worker may have spent API budget already: only one bounded retry.
    await tx.researchJob.updateMany({
      where: {
        status: 'RUNNING',
        leaseUntil: { lt: new Date() },
        attempts: { gte: 2 },
      },
      data: {
        status: 'FAILED',
        error: 'Worker zweimal unterbrochen. Bitte neuen Lauf starten.',
        finishedAt: new Date(),
        leaseToken: null,
        leaseUntil: null,
      },
    });
    const next = await tx.researchJob.findFirst({
      where: {
        OR: [
          { status: 'QUEUED' },
          {
            status: 'RUNNING',
            leaseUntil: { lt: new Date() },
            attempts: { lt: 2 },
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: { run: true },
    });
    if (!next) return null;
    const token = randomUUID();
    const claimed = await tx.researchJob.updateMany({
      where: {
        id: next.id,
        status: next.status,
        leaseToken: next.leaseToken,
        attempts: next.attempts,
      },
      data: {
        status: 'RUNNING',
        leaseToken: token,
        leaseUntil: new Date(Date.now() + 10 * 60 * 1000),
        attempts: { increment: 1 },
        error: null,
      },
    });
    return claimed.count ? { ...next, token } : null;
  });
  if (!job) return false;
  try {
    const [settlement, detailTypes, resourceTypes] = await Promise.all([
      prisma.settlements.findUnique({
        where: { id: job.settlementId },
        include: settlementResearchInclude,
      }),
      prisma.detailTypes.findMany({
        where: { published: true },
        select: { id: true, name: true },
      }),
      prisma.resourceTypes.findMany({
        where: { published: true },
        select: { id: true, name: true },
      }),
    ]);
    if (!settlement?.published)
      throw new ResearchError('Siedlung ist nicht mehr veröffentlicht.');
    const result = await researchSettlement(
      {
        name: settlement.name,
        city: settlement.location?.city ?? '',
        detailTypes,
        resourceTypes: resourceTypes.filter((type) =>
          isSourceResourceType(type.name),
        ),
        existing: {
          details: settlement.details.filter((item) => item.published),
          resources: settlement.resources.filter((item) => item.published),
        },
      },
      job.run.model,
    );
    const created = await persistResearch(
      job.id,
      job.token,
      settlement,
      result,
    );
    process.stdout.write(
      `Recherche abgeschlossen: ${settlement.name} (${created} neue Vorschläge).\n`,
    );
  } catch (error) {
    // Never log provider bodies or URLs that might contain credentials.
    const message =
      error instanceof ResearchError
        ? error.message
        : 'Technischer Recherchefehler. Bitte Konfiguration und Anbieter prüfen.';
    await prisma.researchJob.updateMany({
      where: { id: job.id, status: 'RUNNING', leaseToken: job.token },
      data: {
        status: 'FAILED',
        error: message,
        finishedAt: new Date(),
        leaseToken: null,
        leaseUntil: null,
      },
    });
    process.stderr.write(`${job.id}: ${message}\n`);
  }
  return true;
}

export async function runWorker(once = false) {
  if (!researchConfigured())
    throw new ResearchError(
      'OPENAI_API_KEY fehlt. Worker wurde nicht gestartet.',
    );
  let stopping = false;
  const stop = () => {
    stopping = true;
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  const heartbeat = () =>
    prisma.researchWorker.upsert({
      where: { id: 'research' },
      create: { id: 'research' },
      update: { updatedAt: new Date() },
    });
  await heartbeat();
  const interval = setInterval(() => {
    heartbeat().catch(() =>
      process.stderr.write('Worker-Heartbeat fehlgeschlagen.\n'),
    );
  }, 15000);
  process.stdout.write(
    'Rechercheworker bereit. Wartet auf manuell gestartete Läufe.\n',
  );
  try {
    do {
      const worked = await workOnce();
      if (once && !worked) break;
      if (!worked) await new Promise((resolve) => setTimeout(resolve, 3000));
    } while (!stopping);
  } finally {
    clearInterval(interval);
    process.off('SIGINT', stop);
    process.off('SIGTERM', stop);
    await prisma.$disconnect();
  }
}
