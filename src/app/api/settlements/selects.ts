import { detailsSelect } from '@/app/api/details/selects';
import { locationsSelect } from '@/app/api/locations/selects';
import { resourcesSelect } from '@/app/api/resources/selects';
import { tagsSelect } from '@/app/api/tags/selects';
import { Prisma } from '@prisma/client';

export const settlementTypesSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  resources: {
    select: resourcesSelect,
    where: {
      published: true,
    },
  },
  details: {
    select: detailsSelect,
    where: {
      published: true,
    },
  },
} satisfies Prisma.SettlementTypesSelect;

export type SettlementTypesSelect = Prisma.SettlementTypesGetPayload<{
  select: typeof settlementTypesSelect;
}>;

export const settlementsSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  tags: {
    select: {
      tag: {
        select: tagsSelect,
      },
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SettlementsSelect;

export const settlementsSelectWithLocations = {
  ...settlementsSelect,
  location: {
    select: locationsSelect,
  },
} satisfies Prisma.SettlementsSelect;

export type SettlementsSelect = Prisma.SettlementsGetPayload<{
  select: typeof settlementsSelect | typeof settlementsSelectWithLocations;
}>;