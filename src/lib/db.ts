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

const settlementsInclude = Prisma.validator<Prisma.SettlementsInclude>()({
  architects: {
    select: {
      architect: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  details: {
    select: {
      id: true,
      name: true,
      description: true,
      detailType: {
        select: {
          id: true,
          name: true,
          description: true
        }
      }
    }
  },
  resources: {
    select: {
      id: true,
      name: true,
      description: true,
      url: true,
      resourceType: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
    }
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          description: true,
        }
      }
    }
  },
  settlementTypes: {
    select: {
      settlementType: {
        select: {
          id: true,
          name: true,
          description: true,
          resources: {
            select: {
              id: true,
              name: true,
              description: true,
              url: true,
              resourceType: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              },
            }
          },
          details: {
            select: {
              id: true,
              name: true,
              description: true,
              detailType: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              }
            }
          },
        }
      }
    }
  },
  events: {
    select: {
      id: true,
      name: true,
      description: true,
      eventDate: true,
      eventType: {
        select: {
          id: true,
          name: true,
          description: true
        }
      }
    }
  },
  location: {
    select: {
      id: true,
      name: true,
      lat: true,
      lng: true,
    }
  },
});

export type SettlementsFull = Prisma.SettlementsGetPayload<{
  include: typeof settlementsInclude;
}>;

export async function findSettlement(
  data: Prisma.SettlementsWhereUniqueInput
) {
  return await prisma.settlements.findUnique({
    where: {
      id: data.id
    },
    include: settlementsInclude
  });
}

export async function findSettlements(
  data?: Prisma.SettlementsWhereInput
) {
  if (data) {
    return await prisma.settlements.findMany({
      where: {
        id: data.id
      },
      include: settlementsInclude
    });

  }
  return await prisma.settlements.findMany({
    include: settlementsInclude
  });
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
