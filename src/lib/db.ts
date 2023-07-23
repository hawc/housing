import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

const tagsSelect = Prisma.validator<Prisma.TagsSelect>()({
  id: true,
  name: true,
  description: true,
});

const settlementsOnTagsSelect = Prisma.validator<Prisma.SettlementsOnTagsSelect>()({
  tag: {
    select: tagsSelect
  }
});

const settlementsSelect = Prisma.validator<Prisma.SettlementsSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  tags: {
    select: settlementsOnTagsSelect
  }
});

const architectsSelect = Prisma.validator<Prisma.ArchitectsSelect>()({
  id: true,
  name: true,
  description: true,
  url: true,
  slug: true
});

const settlementsOnArchitectsSelect = Prisma.validator<Prisma.SettlementsOnArchitectsSelect>()({
  architect: {
    select: architectsSelect
  }
});

const detailTypesSelect = Prisma.validator<Prisma.DetailTypesSelect>()({
  id: true,
  name: true,
  description: true
});

const detailsSelect = Prisma.validator<Prisma.DetailsSelect>()({
  id: true,
  name: true,
  description: true,
  annotation: true,
  source: true,
  detailDate: true,
  detailType: {
    select: detailTypesSelect
  }
});

const resourceTypesSelect = Prisma.validator<Prisma.ResourceTypesSelect>()({
  id: true,
  name: true,
  description: true
});

const resourcesSelect = Prisma.validator<Prisma.ResourcesSelect>()({
  id: true,
  name: true,
  description: true,
  source: true,
  license: true,
  copyright: true,
  url: true,
  resourceType: {
    select: resourceTypesSelect
  },
});

const eventTypesSelect = Prisma.validator<Prisma.EventTypesSelect>()({
  id: true,
  name: true,
  description: true
});

const eventsSelect = Prisma.validator<Prisma.EventsSelect>()({
  id: true,
  name: true,
  description: true,
  eventDate: true,
  eventType: {
    select: eventTypesSelect
  }
});

const settlementTypesSelect = Prisma.validator<Prisma.SettlementTypesSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  resources: {
    select: resourcesSelect,
    where: {
      published: true,
    }
  },
  details: {
    select: detailsSelect,
    where: {
      published: true,
    }
  },
});

const settlementsOnSettlementTypesSelect = Prisma.validator<Prisma.SettlementsOnSettlementTypesSelect>()({
  settlementType: {
    select: settlementTypesSelect
  }
})

const locationsSelect = Prisma.validator<Prisma.LocationsSelect>()({
  id: true,
  name: true,
  address: true,
  district: true,
  zipCode: true,
  city: true,
  lat: true,
  lng: true,
});

export type SettlementsOnTagsSelect = Prisma.SettlementsOnTagsGetPayload<{ select: typeof settlementsOnTagsSelect }>
export type SettlementsSelect = Prisma.SettlementsGetPayload<{ select: typeof settlementsSelect }>
export type ArchitectsSelect = Prisma.ArchitectsGetPayload<{ select: typeof architectsSelect }>
export type SettlementsOnArchitectsSelect = Prisma.SettlementsOnArchitectsGetPayload<{ select: typeof settlementsOnArchitectsSelect }>
export type TagsSelect = Prisma.TagsGetPayload<{ select: typeof tagsSelect }>
export type DetailsTypesSelect = Prisma.DetailTypesGetPayload<{ select: typeof detailTypesSelect }>
export type DetailsSelect = Prisma.DetailsGetPayload<{ select: typeof detailsSelect }>
export type ResourceTypesSelect = Prisma.ResourceTypesGetPayload<{ select: typeof resourceTypesSelect }>
export type ResourcesSelect = Prisma.ResourcesGetPayload<{ select: typeof resourcesSelect }>
export type EventTypesSelect = Prisma.EventTypesGetPayload<{ select: typeof eventTypesSelect }>
export type EventsSelect = Prisma.EventsGetPayload<{ select: typeof eventsSelect }>
export type SettlementTypesSelect = Prisma.SettlementTypesGetPayload<{ select: typeof settlementTypesSelect }>
export type SettlementsOnSettlementTypesSelect = Prisma.SettlementsOnSettlementTypesGetPayload<{ select: typeof settlementsOnSettlementTypesSelect }>
export type LocationsSelect = Prisma.LocationsGetPayload<{ select: typeof locationsSelect }>

const eventsInclude = Prisma.validator<Prisma.EventsInclude>()({
  eventType: true
});

const detailsInclude = Prisma.validator<Prisma.DetailsInclude>()({
  detailType: true
});

const resourcesInclude = Prisma.validator<Prisma.ResourcesInclude>()({
  resourceType: true
});

const tagsInclude = Prisma.validator<Prisma.TagsInclude>()({
  settlements: {
    select: {
      settlement: {
        select: settlementsSelect
      }
    },
  },
});

const eventTypesInclude = Prisma.validator<Prisma.EventTypesInclude>()({});
const detailTypesInclude = Prisma.validator<Prisma.DetailTypesInclude>()({});
const resourceTypesInclude = Prisma.validator<Prisma.ResourceTypesInclude>()({});

const architectsInclude = Prisma.validator<Prisma.ArchitectsInclude>()({
  settlements: {
    select: {
      settlement: {
        select: settlementsSelect
      }
    },
  },
});

const locationsInclude = Prisma.validator<Prisma.LocationsInclude>()({
  settlement: {
    select: settlementsSelect
  },
});

const settlementsOnTagsInclude = Prisma.validator<Prisma.SettlementsOnTagsInclude>()({
  tag: {
    select: tagsSelect
  },
  settlement: {
    select: settlementsSelect
  },
});

const settlementsOnArchitectsInclude = Prisma.validator<Prisma.SettlementsOnArchitectsInclude>()({
  architect: {
    select: architectsSelect
  },
  settlement: {
    select: settlementsSelect
  },
});

const settlementsInclude = Prisma.validator<Prisma.SettlementsInclude>()({
  architects: {
    select: settlementsOnArchitectsSelect
  },
  details: {
    select: detailsSelect,
    where: {
      published: true,
    }
  },
  resources: {
    select: resourcesSelect,
    where: {
      published: true,
    }
  },
  tags: {
    select: settlementsOnTagsSelect
  },
  settlementTypes: {
    select: settlementsOnSettlementTypesSelect
  },
  events: {
    select: eventsSelect,
    where: {
      published: true,
    }
  },
  location: {
    select: locationsSelect
  },
});

export type LocationsInclude = Prisma.LocationsGetPayload<{ include: typeof locationsInclude }>
export type EventsInclude = Prisma.EventsGetPayload<{ include: typeof eventsInclude }>
export type DetailsInclude = Prisma.DetailsGetPayload<{ include: typeof detailsInclude }>
export type ResourcesInclude = Prisma.ResourcesGetPayload<{ include: typeof resourcesInclude }>
export type ArchitectsInclude = Prisma.ArchitectsGetPayload<{ include: typeof architectsInclude }>
export type SettlementsInclude = Prisma.SettlementsGetPayload<{ include: typeof settlementsInclude }>
export type SettlementsOnTagsInclude = Prisma.SettlementsOnTagsGetPayload<{ include: typeof settlementsOnTagsInclude }>
export type SettlementsOnArchitectsInclude = Prisma.SettlementsOnArchitectsGetPayload<{ include: typeof settlementsOnArchitectsInclude }>
export type TagsInclude = Prisma.TagsGetPayload<{ include: typeof tagsInclude }>
export type EventTypesInclude = Prisma.EventTypesGetPayload<{ include: typeof eventTypesInclude }>
export type DetailTypesInclude = Prisma.DetailTypesGetPayload<{ include: typeof detailTypesInclude }>
export type ResourceTypesInclude = Prisma.ResourceTypesGetPayload<{ include: typeof resourceTypesInclude }>

export async function createLocation(
  data: Prisma.LocationsCreateArgs
) {
  const updateData = data.data;
  return await prisma.locations.create({
    data: {
      lat: updateData.lat,
      lng: updateData.lng,
      name: updateData.name,
      address: updateData.address,
      district: updateData.district,
      zipCode: updateData.zipCode,
      city: updateData.city,
      settlement: {
        connect: {
          id: updateData.settlementId
        }
      }
    },
    include: locationsInclude
  });
}

export async function updateLocation(
  data: Prisma.LocationsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.locations.update({
    where: {
      id: data.where.id,
    },
    data: {
      ...updateData
    },
    include: locationsInclude
  });
}

export async function createArchitect(
  data: Prisma.ArchitectsCreateArgs
) {
  return await prisma.architects.create({
    data: {
      name: data.data.name,
      slug: data.data.slug,
    },
    include: architectsInclude
  });
}

export async function updateArchitect(
  data: Prisma.ArchitectsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.architects.update({
    where: {
      id: data.where.id
    },
    data: {
      ...updateData
    },
    include: architectsInclude
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
    },
    include: architectsInclude
  });
}

export async function createSettlement(
  data: Prisma.SettlementsCreateArgs
) {
  return await prisma.settlements.create({
    data: {
      name: data.data.name,
      description: data.data.description ?? '',
      slug: data.data.slug
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

export async function updateTag(
  data: Prisma.TagsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.tags.update({
    where: {
      id: data.where.id
    },
    data: {
      ...updateData
    },
    include: tagsInclude
  });
}

export type SettlementsOnTagsFull = Prisma.SettlementsOnTagsGetPayload<{
  include: typeof settlementsOnTagsInclude;
}>;

export async function addSettlementOnTag(
  data: Prisma.SettlementsOnTagsCreateArgs
) {
  const updateData = data.data;
  return await prisma.settlementsOnTags.create({
    data: {
      tagId: updateData.tagId,
      settlementId: updateData.settlementId,
    },
    include: settlementsOnTagsInclude
  });
}

export async function addSettlementOnArchitect(
  data: Prisma.SettlementsOnArchitectsCreateArgs
) {
  const updateData = data.data;
  return await prisma.settlementsOnArchitects.create({
    data: {
      architectId: updateData.architectId,
      settlementId: updateData.settlementId,
    },
    include: settlementsOnArchitectsInclude
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

export async function findArchitects(
  data?: Prisma.ArchitectsFindManyArgs
) {
  if (data && data.where) {
    if (data.where.slug) {
      return await prisma.architects.findMany({
        where: {
          slug: data.where.slug,
          published: true,
        },
        include: architectsInclude
      });
    }
    return await prisma.architects.findMany({
      where: {
        id: data.where.id,
        published: true,
      },
      include: architectsInclude
    });
  }
  return await prisma.architects.findMany({
    where: {
      published: true,
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

export async function findSettlements() {
  return await prisma.settlements.findMany({
    where: {
      published: true,
    },
    include: settlementsInclude
  });
}

export async function findLocations() {
  return await prisma.locations.findMany({
    where: {
      published: true,
    },
    include: locationsInclude
  });
}

export async function createTag(
  data: Prisma.TagsCreateArgs
) {
  const updateData = data.data;
  return await prisma.tags.create({
    data: {
      name: updateData.name,
      description: updateData.description,
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

export async function findEvent(
  data: Prisma.EventsFindUniqueArgs
) {
  return await prisma.events.findUnique({
    where: {
      id: data.where.id,
    },
    include: eventsInclude
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

export async function createEvent(
  data: Prisma.EventsCreateArgs
) {
  const updateData = data.data;
  return await prisma.events.create({
    data: {
      name: updateData.name,
      description: updateData.description,
      eventTypeId: updateData.eventTypeId,
      settlementId: updateData.settlementId
    },
    include: eventsInclude
  });
}

export async function updateEvent(
  data: Prisma.EventsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.events.update({
    where: {
      id: data.where.id
    },
    data: {
      ...updateData
    },
    include: eventsInclude
  });
}

export async function findEventTypes(
  data?: Prisma.EventTypesFindManyArgs
) {
  if (data?.where) {
    return await prisma.eventTypes.findMany({
      where: {
        published: true,
      }
    });
  }
  return await prisma.eventTypes.findMany();
}

export async function findResource(
  data: Prisma.ResourcesFindUniqueArgs
) {
  return await prisma.resources.findUnique({
    where: {
      id: data.where.id,
    },
    include: resourcesInclude
  });
}

export async function findResources(
  data?: Prisma.ResourcesFindManyArgs
) {
  if (data?.where?.settlementId) {
    return await prisma.resources.findMany({
      where: {
        published: true,
        settlementId: data.where.settlementId
      },
      include: resourcesInclude
    });
  }
  return await prisma.resources.findMany({
    where: {
      published: true,
    },
    include: resourcesInclude
  });
}

export async function createResource(
  data: Prisma.ResourcesCreateArgs
) {
  const updateData = data.data;
  return await prisma.resources.create({
    data: {
      name: updateData.name,
      description: updateData.description,
      source: updateData.source,
      url: updateData.url,
      license: updateData.license,
      copyright: updateData.copyright,
      resourceTypeId: updateData.resourceTypeId,
      settlementId: updateData.settlementId
    },
    include: resourcesInclude
  });
}

export async function updateResource(
  data: Prisma.DetailsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.resources.update({
    where: {
      id: data.where.id
    },
    data: {
      ...updateData
    },
    include: resourcesInclude
  });
}

export async function findResourceTypes(
  data?: Prisma.ResourceTypesFindManyArgs
) {
  if (data?.where) {
    return await prisma.resourceTypes.findMany({
      where: {
        published: true,
      }
    });

  }
  return await prisma.resourceTypes.findMany({
    where: {
      published: true,
    },
  });
}

export async function findDetail(
  data: Prisma.DetailsFindUniqueArgs
) {
  return await prisma.details.findUnique({
    where: {
      id: data.where.id,
    },
    include: detailsInclude
  });
}

export async function findDetails(
  data: Prisma.DetailsFindManyArgs
) {
  if (data?.where?.settlementId) {
    return await prisma.details.findMany({
      where: {
        published: true,
        settlementId: data.where.settlementId
      },
      include: detailsInclude
    });
  }
  return await prisma.details.findMany({
    where: {
      published: true,
    },
    include: detailsInclude
  });
}

export async function findDetailTypes(
  data?: Prisma.DetailTypesFindManyArgs
) {
  if (data?.where) {
    return await prisma.detailTypes.findMany({
      where: {
        published: true,
      }
    });
  }
  return await prisma.detailTypes.findMany({
    where: {
      published: true,
    },
  });
}

export async function createDetail(
  data: Prisma.DetailsCreateArgs
) {
  const updateData = data.data;
  return await prisma.details.create({
    data: {
      name: updateData.name,
      description: updateData.description,
      annotation: updateData.annotation,
      source: updateData.source,
      detailDate: updateData.detailDate,
      detailTypeId: updateData.detailTypeId,
      settlementId: updateData.settlementId
    },
    include: detailsInclude
  });
}

export async function updateDetail(
  data: Prisma.DetailsUpdateArgs
) {
  const updateData = data.data;
  return await prisma.details.update({
    where: {
      id: data.where.id
    },
    data: {
      ...updateData
    },
    include: detailsInclude
  });
}

export async function findTags() {
  return await prisma.tags.findMany({
    where: {
      published: true,
    },
    include: tagsInclude
  });
}

export async function flushCache() {
  await prisma.tags.upsert({
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
  });
  return true;
}