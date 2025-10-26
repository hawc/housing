import { resourceTypesSelect } from '@/app/api/resourceTypes/selects';
import { Prisma } from '@prisma/client';

export const resourcesSelect = {
  id: true,
  name: true,
  description: true,
  source: true,
  license: true,
  copyright: true,
  url: true,
  resourceType: {
    select: resourceTypesSelect,
  },
} satisfies Prisma.ResourcesSelect;

export type ResourcesSelect = Prisma.ResourcesGetPayload<{
  select: typeof resourcesSelect;
}>;
