import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

const architectsInclude = Prisma.validator<Prisma.ArchitectsInclude>()({
  settlements: {
    select: {
      settlement: {
        select: {
          id: true,
          name: true,
          description: true,
          slug: true,
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
          }
        }
      }
    },
  },
})

const settlementsInclude = Prisma.validator<Prisma.SettlementsInclude>()({
  architects: {
    select: {
      architect: {
        select: {
          id: true,
          name: true,
          slug: true
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
      source: true,
      license: true,
      copyright: true,
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
          slug: true,
          description: true,
          resources: {
            select: {
              id: true,
              name: true,
              description: true,
              source: true,
              license: true,
              copyright: true,
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
  data: Prisma.ArchitectsCreateArgs
) {
  return await prisma.architects.create({
    data: {
      name: data.data.name,
      slug: data.data.slug,
    },
  });
}

export async function deleteArchitect(
  data: Prisma.ArchitectsDeleteArgs
) {
  return await prisma.architects.update({
    where: {
      id: data.where.id,
    },
    data: {
      published: false
    }
  });
}

export async function findArchitects(
  data?: Prisma.ArchitectsFindManyArgs
) {
  if (data?.where) {
    return await prisma.architects.findMany({
      where: {
        id: data.where.id,
        name: data.where.name,
        published: true,
      },
    });
  }
  return await prisma.architects.findMany();
}

export async function createSettlement(
  data: Prisma.SettlementsCreateArgs
) {
  return await prisma.settlements.create({
    data: {
      name: data.data.name,
      slug: '',
    },
    include: settlementsInclude
  });
}

export async function deleteSettlement(
  data: Prisma.SettlementsDeleteArgs
) {
  return await prisma.settlements.update({
    where: {
      id: data.where.id
    },
    data: {
      published: false
    },
    include: settlementsInclude
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

export async function findArchitect(
  data: Prisma.ArchitectsFindUniqueArgs
) {
  if (data.where.slug) {
    return await prisma.architects.findUnique({
      where: {
        slug: data.where.slug,
      },
      include: architectsInclude
    });
  }
  return await prisma.architects.findUnique({
    where: {
      id: data.where.id,
    },
    include: architectsInclude
  });
}

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
  data?: Prisma.SettlementsFindManyArgs
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
  data: Prisma.TagsCreateArgs
) {
  return await prisma.tags.create({
    data: {
      name: data.data.name
    },
  });
}

export async function deleteTag(
  data: Prisma.TagsDeleteArgs
) {
  return await prisma.tags.delete({
    where: {
      id: data.where.id
    }
  });
}

export async function findEvents(
  data: Prisma.EventsFindManyArgs
) {
  if (data?.where) {
    return await prisma.events.findMany({
      where: {
        id: data.where.id,
        published: true,
      }
    });

  }
  return await prisma.events.findMany();
}


export async function findEventTypes(
  data?: Prisma.EventTypesFindManyArgs
) {
  if (data?.where) {
    return await prisma.eventTypes.findMany({
      where: {
        id: data.where.id,
        published: true,
      }
    });
  }
  return await prisma.eventTypes.findMany();
}


export async function findResources(
  data?: Prisma.ResourcesFindManyArgs
) {
  if (data?.where) {
    return await prisma.resources.findMany({
      where: {
        id: data.where.id,
        published: true,
      }
    });

  }
  return await prisma.resources.findMany();
}


export async function findResourceTypes(
  data?: Prisma.ResourceTypesFindManyArgs
) {
  if (data?.where) {
    return await prisma.resourceTypes.findMany({
      where: {
        id: data.where.id,
        published: true,
      }
    });

  }
  return await prisma.resourceTypes.findMany();
}


export async function findDetails(
  data: Prisma.DetailsFindManyArgs
) {
  if (data?.where) {
    return await prisma.details.findMany({
      where: {
        id: data.where.id,
        published: true,
      }
    });

  }
  return await prisma.details.findMany();
}


export async function findTags(
  data?: Prisma.TagsFindManyArgs
) {
  if (data?.where) {
    return await prisma.tags.findMany({
      where: {
        id: data.where.id,
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