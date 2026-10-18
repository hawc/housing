import prisma from '../prisma';
import { researchConfigured } from './provider';

export async function getResearchDashboard(
  status: 'PENDING' | 'APPLIED' | 'REJECTED' | 'STALE' = 'PENDING',
  db = prisma,
) {
  const [
    settlements,
    detailTypes,
    resourceTypes,
    runs,
    proposals,
    worker,
    pendingCount,
  ] = await Promise.all([
    db.settlements.findMany({
      where: { published: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        location: { select: { city: true } },
        _count: { select: { details: { where: { published: true } } } },
      },
    }),
    db.detailTypes.findMany({
      select: { id: true, name: true },
    }),
    db.resourceTypes.findMany({ select: { id: true, name: true } }),
    db.researchRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        jobs: {
          include: {
            settlement: { select: { name: true } },
            _count: { select: { proposals: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    db.changeProposal.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        source: true,
        settlement: { select: { name: true, slug: true } },
        changeLog: {
          select: {
            id: true,
            resultId: true,
            reviewedBy: true,
            createdAt: true,
            after: true,
          },
        },
      },
    }),
    db.researchWorker.findUnique({ where: { id: 'research' } }),
    db.changeProposal.count({ where: { status: 'PENDING' } }),
  ]);
  return {
    settlements,
    detailTypes,
    resourceTypes,
    runs,
    proposals,
    pendingCount,
    configured: researchConfigured(),
    workerOnline: Boolean(
      worker && Date.now() - worker.updatedAt.getTime() < 60000,
    ),
  };
}
