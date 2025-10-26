import { Prisma } from '@prisma/client';

export const tagsSelect = {
  id: true,
  name: true,
  description: true,
} satisfies Prisma.TagsSelect;

export type TagsSelect = Prisma.TagsGetPayload<{ select: typeof tagsSelect }>;
