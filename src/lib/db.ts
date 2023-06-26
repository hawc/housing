import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export function createSettlement(data: Prisma.settlementsCreateInput) {
  prisma.settlements.create({
    data: data,
  });
}

export async function createArchitect(
  data: Prisma.architectsUncheckedCreateInput
) {
  return await prisma.architects.create({
    data: data,
  });
}

export async function deleteArchitect(
  data: Prisma.architectsWhereUniqueInput
) {
  return await prisma.architects.delete({
    where: {
      id: data.id
    }
  });
}

export async function findArchitects(
  data: Prisma.architectsUncheckedCreateInput
) {
  if (data) {
    return await prisma.architects.findMany({
      where: {
        name: data.name
      }
    });

  }
  return await prisma.architects.findMany();
}
