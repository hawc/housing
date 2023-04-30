import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

function createSettlement(data: Prisma.settlementsCreateInput) {
  prisma.settlements.create({
    data: data,
  });
}
