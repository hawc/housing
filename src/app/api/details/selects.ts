import { detailTypesSelect } from '@/app/api/detailTypes/selects';
import { Prisma } from '@prisma/client';

export const detailsSelect = {
  id: true,
  name: true,
  description: true,
  annotation: true,
  source: true,
  detailDate: true,
  detailType: {
    select: detailTypesSelect,
  },
} satisfies Prisma.DetailsSelect;

export type DetailsSelect = Prisma.DetailsGetPayload<{
  select: typeof detailsSelect;
}>;