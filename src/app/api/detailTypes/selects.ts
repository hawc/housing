import { Prisma } from '@prisma/client';


export const detailTypesSelect = {
  id: true,
  name: true,
  description: true,
} satisfies Prisma.DetailTypesSelect;

export type DetailsTypesSelect = Prisma.DetailTypesGetPayload<{
  select: typeof detailTypesSelect;
}>;
