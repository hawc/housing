import prisma from '@/lib/prisma';
import { groupUpdatesByDate } from './groupUpdatesByDate';
import { mergeAndSortUpdates } from './mergeAndSortUpdates';

const ownerSelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  updatedSections: true,
} as const;

// Only public owner metadata is needed; avoid downloading every detail/resource
// and never read research proposals, evidence or reviewer information here.
export async function getUpdates(db = prisma) {
  const [settlements, architects] = await Promise.all([
    db.settlements.findMany({
      where: { published: true },
      select: { ...ownerSelect, location: { select: { city: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    db.architects.findMany({
      where: { published: true },
      select: ownerSelect,
      orderBy: { updatedAt: 'desc' },
    }),
  ]);
  return mergeAndSortUpdates(
    groupUpdatesByDate(settlements, 'settlement'),
    groupUpdatesByDate(architects, 'architect'),
  );
}
