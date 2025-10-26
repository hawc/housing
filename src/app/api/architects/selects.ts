import { externalLinksSelect } from '@/app/api/externalLinks/selects';
import { Prisma } from '@prisma/client';

export const architectsSelect = {
  id: true,
  name: true,
  description: true,
  slug: true,
  urls: {
    select: externalLinksSelect,
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ArchitectsSelect;

export type ArchitectsSelect = Prisma.ArchitectsGetPayload<{
  select: typeof architectsSelect;
}>;