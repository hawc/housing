import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { ArchitectsInclude, ArchitectsSelect, createArchitect, createSettlement, createTag, deleteArchitect, deleteSettlement, deleteTag, DetailsSelect, DetailsTypesSelect, EventsSelect, EventTypesSelect, findArchitect, findArchitects, findDetails, findEvents, findEventTypes, findResources, findResourceTypes, findSettlement, findSettlements, findTags, flushCache, LocationsSelect, ResourcesSelect, ResourceTypesSelect, SettlementsInclude, SettlementsSelect, SettlementTypesSelect, TagsSelect, updateSettlement } from '@/lib/db';

import { Architect, BaseArchitect, BaseSettlement, Detail, DetailType, Event, EventType, Location, Resource, ResourceType, Settlement, SettlementType, Tag } from '@/pages/admin';

export const baseTransformers = {
  settlement: (settlement: SettlementsInclude): BaseSettlement => {
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      details: settlement.details.map(transformers.detail),
      types: settlement.settlementTypes.map(settlementsOnSettlementType => transformers.settlementType(settlementsOnSettlementType.settlementType)),
      architects: settlement.architects.map((settlementsOnArchitect) => transformers.architect(settlementsOnArchitect.architect)),
      resources: settlement.resources.map(transformers.resource),
      tags: settlement.tags.map(tagRelation => transformers.tag(tagRelation.tag)),
      events: settlement.events.map(transformers.event),
      location: transformers.location(settlement.location),
    };
  },
  architect: (architect: ArchitectsInclude): BaseArchitect => {
    return {
      id: architect.id,
      name: architect.name,
      slug: architect.slug,
      description: architect.description ?? '',
      url: architect.url ?? '',
      settlements: architect.settlements.map((settlementsOnArchitect) => transformers.settlement(settlementsOnArchitect.settlement)),
    };
  },
}
const transformers = {
  settlement: (settlement: SettlementsSelect): Settlement => {
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      tags: settlement.tags.map(settlementsOnTag => transformers.tag(settlementsOnTag.tag)),
    };
  },
  architect: (architect: ArchitectsSelect): Architect => {
    return {
      id: architect.id,
      name: architect.name,
      slug: architect.slug,
      description: architect.description ?? '',
      url: architect.url ?? '',
    };
  },
  event: (event: EventsSelect): Event => {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      eventDate: event.eventDate.toDateString(),
      type: transformers.eventType(event.eventType)
    };
  },
  eventType: (eventType: EventTypesSelect): EventType => {
    return {
      id: eventType.id,
      name: eventType.name,
      description: eventType.description ?? '',
    };
  },
  tag: (tag: TagsSelect): Tag => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description ?? '',
    };
  },
  settlementType: (settlementType: SettlementTypesSelect): SettlementType => {
    return {
      id: settlementType.id,
      name: settlementType.name,
      slug: settlementType.slug,
      description: settlementType.description ?? '',
      resources: settlementType.resources.map(transformers.resource),
      details: settlementType.details.map(transformers.detail),
    };
  },
  location: (location: LocationsSelect): Location | null => {
    if (!location) return null;
    return {
      id: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    };
  },
  resource: (resource: ResourcesSelect): Resource => {
    return {
      id: resource.id,
      name: resource.name,
      url: resource.url,
      source: resource.source ?? '',
      license: resource.license ?? '',
      copyright: resource.copyright ?? '',
      type: transformers.resourceType(resource.resourceType),
      description: resource.description ?? '',
    };
  },
  resourceType: (resourceType: ResourceTypesSelect): ResourceType => {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  },
  detail: (detail: DetailsSelect): Detail => {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.description ?? '',
      type: transformers.detailType(detail.detailType),
    };
  },
  detailType: (detailType: DetailsTypesSelect): DetailType => {
    return {
      id: detailType.id,
      name: detailType.name,
      description: detailType.description ?? '',
    };
  },
}

const resolvers = {
  clearCache: async (): Promise<void> => {
    await flushCache();
  },
  addArchitect: async (payload: Prisma.ArchitectsCreateArgs): Promise<Architect> => {
    return transformers.architect(await createArchitect(payload));
  },
  addSettlement: async (payload: Prisma.SettlementsCreateArgs): Promise<Settlement> => {
    return baseTransformers.settlement(await createSettlement(payload));
  },
  updateSettlement: async (payload: Prisma.SettlementsUpdateArgs): Promise<Settlement> => {
    return baseTransformers.settlement(await updateSettlement(payload));
  },
  addTag: async (payload: Prisma.TagsCreateArgs): Promise<Tag> => {
    return transformers.tag(await createTag(payload));
  },
  deleteArchitect: async (payload: Prisma.ArchitectsDeleteArgs): Promise<Architect> => {
    return baseTransformers.architect(await deleteArchitect(payload));
  },
  deleteTag: async (payload: Prisma.TagsDeleteArgs): Promise<Tag> => {
    return transformers.tag(await deleteTag(payload));
  },
  deleteSettlement: async (payload: Prisma.SettlementsDeleteArgs): Promise<Settlement> => {
    return baseTransformers.settlement(await deleteSettlement(payload));
  },
  getArchitects: async (payload?: Prisma.ArchitectsFindManyArgs): Promise<Architect[]> => {
    const architects = await (payload ? findArchitects(payload) : findArchitects());
    return architects.map(baseTransformers.architect);
  },
  getArchitect: async (payload: Prisma.ArchitectsFindUniqueArgs): Promise<Architect> => {
    const architect = await findArchitect(payload);
    if (!architect) throw new Error('architect not found');
    return baseTransformers.architect(architect);
  },
  getSettlements: async (payload?: Prisma.SettlementsFindManyArgs): Promise<Settlement[]> => {
    const settlements = await (payload ? findSettlements(payload) : findSettlements());
    return settlements.map(baseTransformers.settlement);
  },
  getSettlement: async (payload: Prisma.SettlementsFindUniqueArgs): Promise<Settlement> => {
    const settlement = await findSettlement(payload);
    if (!settlement) throw new Error('settlement not found');
    return baseTransformers.settlement(settlement);
  },
  getEvents: async (payload: Prisma.EventsFindManyArgs): Promise<void> => {
    const events = await findEvents(payload);
    return;
    // return events.map(transformers.event);
  },
  getEventTypes: async (payload?: Prisma.EventTypesFindManyArgs): Promise<EventType[]> => {
    const eventTypes = await (payload ? findEventTypes(payload) : findEventTypes());
    return eventTypes.map(transformers.eventType);
  },
  getResources: async (payload?: Prisma.ResourcesFindManyArgs): Promise<void> => {
    const resources = await (payload ? findResources(payload) : findResources());
    return;
    // return resources.map(transformers.resource);
  },
  getResourceTypes: async (payload?: Prisma.ResourceTypesFindManyArgs): Promise<ResourceType[]> => {
    const resourceTypes = await (payload ? findResourceTypes(payload) : findResourceTypes());
    return resourceTypes.map(transformers.resourceType);
  },
  getDetails: async (payload: Prisma.DetailsFindManyArgs): Promise<void> => {
    const details = await findDetails(payload);
    return;
    // return details.map(transformers.detail);
  },
  getTags: async (payload?: Prisma.TagsFindManyArgs): Promise<Tag[]> => {
    const tags = await (payload ? findTags(payload) : findTags());
    return tags.map(transformers.tag);
  }
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const body = await JSON.parse(req.body);
  const method = body.type as keyof typeof resolvers;
  if (!resolvers[method]) {
    throw new Error('wrong action');
  }
  if (!body) {
    throw new Error('body missing');
  }
  const response = await resolvers[method](body.payload);

  res.status(200).json(response);
}