import { Prisma } from '@prisma/client';

export const eventTypesSelect = {
  id: true,
  name: true,
  description: true,
} satisfies Prisma.EventTypesSelect;

export type EventTypesSelect = Prisma.EventTypesGetPayload<{
  select: typeof eventTypesSelect;
}>;
