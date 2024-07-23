import { Prisma } from '@prisma/client';


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
  },
  createdAt: true,
  updatedAt: true,
});

const settlementsSelectWithLocations = Prisma.validator<Prisma.SettlementsSelect>()({
  ...settlementsSelect,
  location: {
    select: locationsSelect
  }
});

const platformsSelect = Prisma.validator<Prisma.PlatformsSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  url: true,
  urlIdentifier: true,
});

const externalLinksSelect = Prisma.validator<Prisma.ExternalLinksSelect>()({
  id: true,
  name: true,
  description: true,
  url: true,
  platform: {
    select: platformsSelect
  },
});

const architectsSelect = Prisma.validator<Prisma.ArchitectsSelect>()({
  id: true,
  name: true,
  description: true,
  slug: true,
  urls: {
    select: externalLinksSelect
  },
  createdAt: true,
  updatedAt: true,
});

const settlementsOnArchitectsSelect = Prisma.validator<Prisma.SettlementsOnArchitectsSelect>()({
  architect: {
    select: architectsSelect
  },
  role: true
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
  source: true,
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
});

export type SettlementsOnTagsSelect = Prisma.SettlementsOnTagsGetPayload<{ select: typeof settlementsOnTagsSelect }>
export type SettlementsSelect = Prisma.SettlementsGetPayload<{ select: typeof settlementsSelect | typeof settlementsSelectWithLocations }>
export type ArchitectsSelect = Prisma.ArchitectsGetPayload<{ select: typeof architectsSelect }>
export type ExternalLinksSelect = Prisma.ExternalLinksGetPayload<{ select: typeof externalLinksSelect }>
export type PlatformsSelect = Prisma.PlatformsGetPayload<{ select: typeof platformsSelect }>
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

export const eventsInclude = Prisma.validator<Prisma.EventsInclude>()({
  eventType: true
});

export const detailsInclude = Prisma.validator<Prisma.DetailsInclude>()({
  detailType: true
});
export const externalLinksInclude = Prisma.validator<Prisma.ExternalLinksInclude>()({
  platform: true
});

export const platformsInclude = Prisma.validator<Prisma.PlatformsInclude>()({
  externalLinks: true
});

export const resourcesInclude = Prisma.validator<Prisma.ResourcesInclude>()({
  resourceType: true
});

export const tagsInclude = Prisma.validator<Prisma.TagsInclude>()({
  settlements: {
    select: {
      settlement: {
        select: settlementsSelect
      }
    },
  },
});

export const eventTypesInclude = Prisma.validator<Prisma.EventTypesInclude>()({
  events: true
});
export const detailTypesInclude = Prisma.validator<Prisma.DetailTypesInclude>()({
  details: true
});
export const resourceTypesInclude = Prisma.validator<Prisma.ResourceTypesInclude>()({
  resources: true
});

export const architectsInclude = Prisma.validator<Prisma.ArchitectsInclude>()({
  urls: {
    select: externalLinksSelect,
    where: {
      published: true
    }
  },
  settlements: {
    select: {
      settlement: {
        select: settlementsSelectWithLocations
      },
      role: true
    },
  },
});

export const locationsInclude = Prisma.validator<Prisma.LocationsInclude>()({
  settlement: {
    select: settlementsSelectWithLocations
  },
});

export const settlementsOnTagsInclude = Prisma.validator<Prisma.SettlementsOnTagsInclude>()({
  tag: {
    select: tagsSelect
  },
  settlement: {
    select: settlementsSelect
  },
});

export const settlementsOnArchitectsInclude = Prisma.validator<Prisma.SettlementsOnArchitectsInclude>()({
  architect: {
    select: architectsSelect
  },
  settlement: {
    select: settlementsSelect
  }
});

export const settlementsInclude = Prisma.validator<Prisma.SettlementsInclude>()({
  architects: {
    select: settlementsOnArchitectsSelect
  },
  details: {
    select: detailsSelect,
    where: {
      published: true
    }
  },
  resources: {
    select: resourcesSelect,
    where: {
      published: true
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
      published: true
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
export type ExternalLinksInclude = Prisma.ExternalLinksGetPayload<{ include: typeof externalLinksInclude }>
export type PlatformsInclude = Prisma.PlatformsGetPayload<{ include: typeof platformsInclude }>
export type SettlementsInclude = Prisma.SettlementsGetPayload<{ include: typeof settlementsInclude }>
export type SettlementsOnTagsInclude = Prisma.SettlementsOnTagsGetPayload<{ include: typeof settlementsOnTagsInclude }>
export type SettlementsOnArchitectsInclude = Prisma.SettlementsOnArchitectsGetPayload<{ include: typeof settlementsOnArchitectsInclude }>
export type TagsInclude = Prisma.TagsGetPayload<{ include: typeof tagsInclude }>
export type EventTypesInclude = Prisma.EventTypesGetPayload<{ include: typeof eventTypesInclude }>
export type DetailTypesInclude = Prisma.DetailTypesGetPayload<{ include: typeof detailTypesInclude }>
export type ResourceTypesInclude = Prisma.ResourceTypesGetPayload<{ include: typeof resourceTypesInclude }>
