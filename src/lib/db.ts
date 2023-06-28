import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function createArchitect(
  data: Prisma.ArchitectsCreateInput
) {
  return await prisma.architects.create({
    data: data,
  });
}

export async function deleteArchitect(
  data: Prisma.ArchitectsWhereUniqueInput
) {
  return await prisma.architects.delete({
    where: {
      id: data.id
    }
  });
}

export async function findArchitects(
  data?: Prisma.ArchitectsWhereInput
) {
  if (data) {
    return await prisma.architects.findMany({
      where: {
        id: data.id,
        name: data.name,
      }
    });
  }
  return await prisma.architects.findMany();
}

export async function createSettlement(
  data: Prisma.SettlementsCreateInput
) {
  return await prisma.settlements.create({
    data: data,
  });
}

export async function deleteSettlement(
  data: Prisma.SettlementsWhereUniqueInput
) {
  return await prisma.settlements.delete({
    where: {
      id: data.id
    }
  });
}

export async function findSettlements(
  data: Prisma.SettlementsWhereInput
) {
  if (data) {
    return await prisma.settlements.findMany({
      where: {
        title: data.title
      },
      include: {
        architects: true,
        details: true,
        resources: true,
        tags: true,
        events: true,
        location: true,
      }
    });

  }
  return await prisma.settlements.findMany();
}

export async function createTag(
  data: Prisma.TagsCreateInput
) {
  return await prisma.tags.create({
    data: data,
  });
}

export async function deleteTag(
  data: Prisma.TagsWhereUniqueInput
) {
  return await prisma.tags.delete({
    where: {
      id: data.id
    }
  });
}

export async function findEvents(
  data: Prisma.EventsWhereInput
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


export async function findEventTypes(
  data?: Prisma.EventsWhereInput
) {
  if (data) {
    return await prisma.eventTypes.findMany({
      where: {
        id: data.id,
      }
    });
  }
  return await prisma.eventTypes.findMany();
}


export async function findResources(
  data?: Prisma.ResourcesWhereInput
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


export async function findResourceTypes(
  data?: Prisma.ResourceTypesWhereInput
) {
  if (data) {
    return await prisma.resourceTypes.findMany({
      where: {
        id: data.id,
      }
    });

  }
  return await prisma.resourceTypes.findMany();
}


export async function findDetails(
  data: Prisma.DetailsWhereInput
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
  data?: Prisma.TagsWhereInput
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
