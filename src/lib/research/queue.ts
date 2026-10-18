import prisma from '../prisma';
import { parseSettlementIds, ResearchError } from './validation';
import { researchConfigured, researchModel } from './provider';
import { transaction } from './transaction';

export async function startResearch(
  ids: unknown,
  createdBy: string,
  db = prisma,
) {
  const settlementIds = parseSettlementIds(ids);
  if (!researchConfigured())
    throw new ResearchError(
      'Für die Recherche fehlt OPENAI_API_KEY auf dem Server.',
      503,
    );
  return transaction(db, async (tx) => {
    const active = await tx.researchJob.count({
      where: { status: { in: ['QUEUED', 'RUNNING'] } },
    });
    if (active)
      throw new ResearchError(
        'Es läuft bereits eine Recherche. Bitte erst diesen Lauf abschließen.',
        409,
      );
    const pending = await tx.changeProposal.count({
      where: { status: 'PENDING' },
    });
    if (pending >= 100)
      throw new ResearchError(
        'Bitte zuerst die offenen Vorschläge reviewen (Limit: 100).',
        409,
      );
    const count = await tx.settlements.count({
      where: { id: { in: settlementIds }, published: true },
    });
    if (count !== settlementIds.length)
      throw new ResearchError(
        'Eine ausgewählte Siedlung ist nicht mehr verfügbar.',
        409,
      );
    return tx.researchRun.create({
      data: {
        createdBy,
        model: researchModel(),
        jobs: {
          create: settlementIds.map((settlementId) => ({ settlementId })),
        },
      },
      select: { id: true },
    });
  });
}

export async function cancelResearch(
  runId: string,
  reviewer: string,
  db = prisma,
) {
  const result = await db.researchJob.updateMany({
    where: { runId, status: { in: ['QUEUED', 'RUNNING'] } },
    data: {
      status: 'FAILED',
      error: `Manuell abgebrochen von ${reviewer}.`,
      finishedAt: new Date(),
      leaseToken: null,
      leaseUntil: null,
    },
  });
  return { cancelled: result.count };
}
