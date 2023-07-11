import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { addSettlementOnTag, ArchitectsInclude, ArchitectsSelect, createArchitect, createLocation, createSettlement, createTag, deleteArchitect, deleteSettlement, deleteTag, DetailsSelect, DetailsTypesSelect, EventsInclude, EventsSelect, EventTypesSelect, findArchitect, findArchitects, findDetails, findEvent, findEvents, findEventTypes, findResources, findResourceTypes, findSettlement, findSettlements, findTags, flushCache, LocationsSelect, ResourcesSelect, ResourceTypesSelect, SettlementsInclude, SettlementsOnTagsInclude, SettlementsSelect, SettlementTypesSelect, TagsInclude, TagsSelect, updateArchitect, updateEvent, updateLocation, updateSettlement, updateTag } from '@/lib/db';

import { Architect, BaseArchitect, BaseEvent, BaseLocation, BaseSettlement, BaseSettlementOnTag, BaseTag, Detail, DetailType, Event, EventType, Location, Resource, ResourceType, Settlement, SettlementType, Tag } from '@/pages/admin';

export const baseTransformers = {
  location: (location: LocationsSelect): Location => {
    return {
      id: location.id,
      name: location.name,
      address: location.address ?? '',
      district: location.district ?? '',
      zipCode: location.zipCode ?? '',
      city: location.city ?? '',
      lat: location.lat,
      lng: location.lng,
    };
  },
  settlementOnTag: (settlementOnTag: SettlementsOnTagsInclude): BaseSettlementOnTag => {
    return {
      tag: transformers.tag(settlementOnTag.tag),
      settlement: transformers.settlement(settlementOnTag.settlement),
    }
  },
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
  tag: (tag: TagsInclude): BaseTag => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description ?? '',
      settlements: tag.settlements.map((settlementsOnTag) => transformers.settlement(settlementsOnTag.settlement)),
    };
  },
  event: (event: EventsInclude): BaseEvent => {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      eventDate: event.eventDate.toDateString(),
      type: transformers.eventType(event.eventType)
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
      address: location.address ?? '',
      district: location.district ?? '',
      zipCode: location.zipCode ?? '',
      city: location.city ?? '',
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
  clearCache: async (): Promise<boolean> => {
    return await flushCache();
  },
  addTag: async (payload: Prisma.TagsCreateArgs): Promise<Tag> => {
    return transformers.tag(await createTag(payload));
  },
  deleteArchitect: async (payload: Prisma.ArchitectsDeleteArgs): Promise<BaseArchitect> => {
    return baseTransformers.architect(await deleteArchitect(payload));
  },
  deleteTag: async (payload: Prisma.TagsDeleteArgs): Promise<Tag> => {
    return transformers.tag(await deleteTag(payload));
  },
  deleteSettlement: async (payload: Prisma.SettlementsDeleteArgs): Promise<BaseSettlement> => {
    return baseTransformers.settlement(await deleteSettlement(payload));
  },
  getSettlement: async (payload: Prisma.SettlementsFindUniqueArgs): Promise<BaseSettlement> => {
    const settlement = await findSettlement(payload);
    if (!settlement) throw new Error('settlement not found');
    return baseTransformers.settlement(settlement);
  },
  addSettlement: async (payload: Prisma.SettlementsCreateArgs): Promise<BaseSettlement> => {
    return baseTransformers.settlement(await createSettlement(payload));
  },
  updateSettlement: async (payload: Prisma.SettlementsUpdateArgs): Promise<BaseSettlement> => {
    return baseTransformers.settlement(await updateSettlement(payload));
  },
  getSettlements: async (): Promise<BaseSettlement[]> => {
    const settlements = await findSettlements();
    return settlements.map(baseTransformers.settlement);
  },
  addSettlementOnTag: async (payload: Prisma.SettlementsOnTagsCreateArgs): Promise<BaseSettlementOnTag> => {
    return baseTransformers.settlementOnTag(await addSettlementOnTag(payload));
  },
  addLocation: async (payload: Prisma.LocationsCreateArgs): Promise<BaseLocation> => {
    return baseTransformers.location(await createLocation(payload));
  },
  updateLocation: async (payload: Prisma.LocationsUpdateArgs): Promise<BaseLocation> => {
    return baseTransformers.location(await updateLocation(payload));
  },
  addArchitect: async (payload: Prisma.ArchitectsCreateArgs): Promise<BaseArchitect> => {
    return baseTransformers.architect(await createArchitect(payload));
  },
  getArchitects: async (payload?: Prisma.ArchitectsFindManyArgs): Promise<BaseArchitect[]> => {
    const architects = await (payload ? findArchitects(payload) : findArchitects());
    return architects.map(baseTransformers.architect);
  },
  getArchitect: async (payload: Prisma.ArchitectsFindUniqueArgs): Promise<Architect> => {
    const architect = await findArchitect(payload);
    if (!architect) throw new Error('architect not found');
    return baseTransformers.architect(architect);
  },
  updateArchitect: async (payload: Prisma.ArchitectsUpdateArgs): Promise<BaseArchitect> => {
    return baseTransformers.architect(await updateArchitect(payload));
  },
  updateTag: async (payload: Prisma.TagsUpdateArgs): Promise<BaseTag> => {
    return baseTransformers.tag(await updateTag(payload));
  },
  updateEvent: async (payload: Prisma.EventsUpdateArgs): Promise<BaseEvent> => {
    return baseTransformers.event(await updateEvent(payload));
  },
  getEvent: async (payload: Prisma.EventsFindUniqueArgs): Promise<BaseEvent> => {
    const event = await findEvent(payload);
    if (!event) throw new Error('Event not found');
    return baseTransformers.event(event);
  },
  getEvents: async (payload: Prisma.EventsFindManyArgs): Promise<BaseEvent[]> => {
    const events = await findEvents(payload);
    return events.map(baseTransformers.event);
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
  getTags: async (): Promise<Tag[]> => {
    const tags = await findTags();
    return tags.map(baseTransformers.tag);
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