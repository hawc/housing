import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

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
  data?: Prisma.architectsWhereInput
) {
  if (data) {
    return await prisma.architects.findMany({
      where: {
        id: data.id,
        name: data.name
      }
    });

  }
  return await prisma.architects.findMany();
}

export async function createSettlement(
  data: Prisma.settlementsUncheckedCreateInput
) {
  return await prisma.settlements.create({
    data: data,
  });
}

export async function deleteSettlement(
  data: Prisma.settlementsWhereUniqueInput
) {
  return await prisma.settlements.delete({
    where: {
      id: data.id
    }
  });
}

export async function findSettlements(
  data: Prisma.settlementsWhereInput
) {
  if (data) {
    return await prisma.settlements.findMany({
      where: {
        title: data.title,
      }
    });

  }
  return await prisma.settlements.findMany();
}


export async function findEvents(
  data: Prisma.eventsWhereInput
) {
  if (data) {
    return await prisma.events.findMany({
      where: {
        id: data.id,
      }
    });

  }
  return await prisma.events.findMany();
}


export async function findResources(
  data: Prisma.resourcesWhereInput
) {
  if (data) {
    return await prisma.resources.findMany({
      where: {
        id: data.id,
      }
    });

  }
  return await prisma.resources.findMany();
}


export async function findDetails(
  data: Prisma.detailsWhereInput
) {
  if (data) {
    return await prisma.details.findMany({
      where: {
        id: data.id,
      }
    });

  }
  return await prisma.details.findMany();
}


export async function findTags(
  data: Prisma.tagsWhereInput
) {
  if (data) {
    return await prisma.tags.findMany({
      where: {
        id: data.id,
      }
    });

  }
  return await prisma.tags.findMany();
}
