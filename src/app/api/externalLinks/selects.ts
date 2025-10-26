import { platformsSelect } from '@/app/api/platforms/selects';
import { Prisma } from '@prisma/client';

export const externalLinksSelect = {
    id: true,
    name: true,
    description: true,
    url: true,
    platform: {
      select: platformsSelect,
    },
  } satisfies Prisma.ExternalLinksSelect;

export type ExternalLinksSelect = Prisma.ExternalLinksGetPayload<{
  select: typeof externalLinksSelect;
}>;
