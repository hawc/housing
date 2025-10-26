import { Prisma } from '@prisma/client';

export const resourceTypesSelect = {
  id: true,
  name: true,
  description: true,
} satisfies Prisma.ResourceTypesSelect;

export type ResourceTypesSelect = Prisma.ResourceTypesGetPayload<{
  select: typeof resourceTypesSelect;
}>;
