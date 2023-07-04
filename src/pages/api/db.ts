// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Architects, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { createArchitect, createSettlement, createTag, deleteArchitect, deleteSettlement, deleteTag, findArchitects, findDetails, findEvents, findEventTypes, findResources, findResourceTypes, findSettlement, findSettlements, findTags, flushCache, SettlementsFull, updateSettlement } from '@/lib/db';

import { Architect, Detail, DetailType, Event, EventType, Location, Resource, ResourceType, Settlement, SettlementType, Tag } from '@/pages/admin';

const transformers = {
  settlement: (settlement: SettlementsFull): Settlement => {
    console.log(JSON.stringify({
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      details: settlement.details.map(transformers.detail),
      types: settlement.settlementTypes.map(settlementTypesRelation => transformers.settlementType(settlementTypesRelation.settlementType)),
      architects: settlement.architects.map(archictectRelation => transformers.architect(archictectRelation.architect)),
      resources: settlement.resources.map(transformers.resource),
      tags: settlement.tags.map(tagRelation => transformers.tag(tagRelation.tag)),
      events: settlement.events.map(transformers.event),
      location: transformers.location(settlement.location),
    }))
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      details: settlement.details.map(transformers.detail),
      types: settlement.settlementTypes.map(settlementTypesRelation => transformers.settlementType(settlementTypesRelation.settlementType)),
      architects: settlement.architects.map(archictectRelation => transformers.architect(archictectRelation.architect)),
      resources: settlement.resources.map(transformers.resource),
      tags: settlement.tags.map(tagRelation => transformers.tag(tagRelation.tag)),
      events: settlement.events.map(transformers.event),
      location: transformers.location(settlement.location),
    };
  },
  architect: (architect: SettlementsFull['architects'][0]['architect']): Architect => {
    return {
      id: architect.id,
      name: architect.name,
    };
  },
  event: (event: SettlementsFull['events'][0]): Event => {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      eventDate: event.eventDate,
      type: transformers.eventType(event.eventType)
    };
  },
  eventType: (eventType: SettlementsFull['events'][0]['eventType']): EventType => {
    return {
      id: eventType.id,
      name: eventType.name,
      description: eventType.description ?? '',
    };
  },
  tag: (tag: SettlementsFull['tags'][0]['tag']): Tag => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description ?? '',
    };
  },
  settlementType: (settlementType: SettlementsFull['settlementTypes'][0]['settlementType']): SettlementType => {
    return {
      id: settlementType.id,
      name: settlementType.name,
      description: settlementType.description ?? '',
      resources: settlementType.resources.map(transformers.resource),
      details: settlementType.details.map(transformers.detail),
    };
  },
  location: (location: SettlementsFull['location']): Location | null => {
    if (!location) return null;
    return {
      id: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    };
  },
  resource: (resource: SettlementsFull['resources'][0]): Resource => {
    return {
      id: resource.id,
      name: resource.name,
      url: resource.url,
      type: transformers.resourceType(resource.resourceType),
      description: resource.description ?? '',
    };
  },
  resourceType: (resourceType: SettlementsFull['resources'][0]['resourceType']): ResourceType => {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  },
  detail: (detail: SettlementsFull['details'][0]): Detail => {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.description ?? '',
      detailType: transformers.detailType(detail.detailType),
    };
  },
  detailType: (detailType: SettlementsFull['details'][0]['detailType']): DetailType => {
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
  addArchitect: async (payload: Prisma.ArchitectsCreateInput): Promise<Architect> => {
    return transformers.architect(await createArchitect(payload));
  },
  addSettlement: async (payload: Prisma.SettlementsCreateInput): Promise<Settlement> => {
    return transformers.settlement(await createSettlement(payload));
  },
  updateSettlement: async (payload: Prisma.SettlementsUpdateArgs): Promise<Settlement> => {
    return transformers.settlement(await updateSettlement(payload));
  },
  addTag: async (payload: Prisma.TagsCreateInput): Promise<Tag> => {
    return transformers.tag(await createTag(payload));
  },
  deleteArchitect: async (payload: Prisma.ArchitectsWhereUniqueInput): Promise<Architect> => {
    return transformers.architect(await deleteArchitect({ id: payload.id }));
  },
  deleteTag: async (payload: Prisma.TagsWhereUniqueInput): Promise<Tag> => {
    return transformers.tag(await deleteTag({ id: payload.id }));
  },
  deleteSettlement: async (payload: Prisma.SettlementsWhereUniqueInput): Promise<Settlement> => {
    return transformers.settlement(await deleteSettlement({ id: payload.id }));
  },
  getArchitects: async (payload?: Prisma.ArchitectsWhereInput): Promise<Architect[]> => {
    const architects: Architects[] = await (payload ? findArchitects({
      id: payload.id,
      name: payload.name,
    }) : findArchitects());

    return architects.map(transformers.architect);
  },
  getSettlements: async (payload?: Prisma.SettlementsFindManyArgs): Promise<Settlement[]> => {
    const settlements = await (payload ? findSettlements(payload) : findSettlements());
    return settlements.map(transformers.settlement);
  },
  getSettlement: async (payload: Prisma.SettlementsFindUniqueArgs): Promise<Settlement> => {
    const settlement = await findSettlement(payload);
    if (!settlement) throw new Error('settlement not found');
    return transformers.settlement(settlement);
  },
  getEvents: async (payload: Prisma.EventsWhereInput): Promise<Event[]> => {
    const events = await findEvents({ id: payload.id });
    return events.map(transformers.event);
  },
  getEventTypes: async (payload?: Prisma.EventTypesWhereInput): Promise<EventType[]> => {
    const eventTypes = await (payload ? findEventTypes({ id: payload.id }) : findEventTypes());
    return eventTypes.map(transformers.eventType);
  },
  getResources: async (payload?: Prisma.ResourcesWhereInput): Promise<Resource[]> => {
    const resources = await (payload ? findResources({ id: payload.id }) : findResources());
    return resources.map(transformers.resource);
  },
  getResourceTypes: async (payload?: Prisma.ResourceTypesWhereInput): Promise<ResourceType[]> => {
    const resourceTypes = await (payload ? findResourceTypes({ id: payload.id }) : findResourceTypes());
    return resourceTypes.map(transformers.resourceType);
  },
  getDetails: async (payload: Prisma.DetailsWhereInput): Promise<Detail[]> => {
    const details = await findDetails({ id: payload.id });
    return details.map(transformers.detail);
  },
  getTags: async (payload?: Prisma.TagsWhereInput): Promise<Tag[]> => {
    const tags = await (payload ? findTags({ id: payload.id }) : findTags());
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