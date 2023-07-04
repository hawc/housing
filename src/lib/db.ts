import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

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
    },
    where: {
      published: true,
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
    },
    where: {
      published: true,
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
            },
            where: {
              published: true,
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
            },
            where: {
              published: true,
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
    },
    where: {
      published: true,
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
  return await prisma.architects.update({
    where: {
      id: data.id,
    },
    data: {
      published: false
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
        published: true,
      },
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
  return await prisma.settlements.update({
    where: {
      id: data.id
    },
    data: {
      published: false
    }
  });
}

export async function updateSettlement(
  data: Prisma.SettlementsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.settlements.update({
    where: {
      id: data.where.id
    },
    data: {
      ...updateData
    },
    include: settlementsInclude
  });
}

export type SettlementsFull = Prisma.SettlementsGetPayload<{
  include: typeof settlementsInclude;
}>;

export async function findSettlement(
  data: Prisma.SettlementsFindUniqueArgs
) {
  if (data.where.slug) {
    return await prisma.settlements.findUnique({
      where: {
        slug: data.where.slug,
      },
      include: settlementsInclude
    });
  }
  return await prisma.settlements.findUnique({
    where: {
      id: data.where.id,
    },
    include: settlementsInclude
  });
}

export async function findSettlements(
  data: Prisma.SettlementsFindManyArgs
) {
  if (data && data.where) {
    if (data.where.slug) {
      return await prisma.settlements.findMany({
        where: {
          slug: data.where.slug,
          published: true,
        },
        include: settlementsInclude
      });
    }
    return await prisma.settlements.findMany({
      where: {
        id: data.where.id,
        published: true,
      },
      include: settlementsInclude
    });

  }
  return await prisma.settlements.findMany({
    where: {
      published: true,
    },
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
        published: true,
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
        published: true,
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
        published: true,
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
        published: true,
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
        published: true,
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
        published: true,
      }
    });

  }
  return await prisma.tags.findMany();
}

export async function flushCache() {
  return await prisma.tags.upsert({
    where: {
      name: 'flush',
    },
    update: {
      published: false
    },
    create: {
      name: 'flush',
      published: false
    }
  })
}