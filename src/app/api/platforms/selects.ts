import { Prisma } from '@prisma/client';

export const platformsSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  url: true,
  urlIdentifier: true,
} satisfies Prisma.PlatformsSelect;

export type PlatformsSelect = Prisma.PlatformsGetPayload<{
  select: typeof platformsSelect;
}>;
