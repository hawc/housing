// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Architects, Details, Events, EventTypes, Prisma, Resources, ResourceTypes, Settlements, Tags } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { createArchitect, createSettlement, createTag, deleteArchitect, deleteSettlement, deleteTag, findArchitects, findDetails, findEvents, findEventTypes, findResources, findResourceTypes, findSettlements, findTags } from '@/lib/db';

import { Architect, Detail, Event, EventType, Resource, ResourceType, Settlement, Tag } from '@/pages/admin';

const transformers = {
  settlement: (settlement: Settlements): Settlement => {
    return {
      id: settlement.id,
      title: settlement.title ?? '',
      description: settlement.description ?? '',
      details: settlement.details ?? '',
      type: settlement.type ?? '',
      architects: settlement.architects ?? '',
      resources: settlement.resources ?? '',
      tags: settlement.tags ?? '',
      events: settlement.events ?? '',
      location: settlement.location,
    };
  },
  architect: (architect: Architects): Architect => {
    return {
      id: architect.id,
      name: architect.name,
    };
  },
  event: (event: Events): Event => {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      typeId: event.eventTypeId,
    };
  },
  eventType: (eventType: EventTypes): EventType => {
    return {
      id: eventType.id,
      name: eventType.name,
    };
  },
  tag: (tag: Tags): Tag => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description ?? '',
    };
  },
  resource: (resource: Resources): Resource => {
    return {
      id: resource.id,
      name: resource.name,
      url: resource.url,
      type: resource.type,
      description: resource.description ?? '',
    };
  },
  resourceType: (resourceType: ResourceTypes): ResourceType => {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  },
  detail: (detail: Details): Detail => {
    return {
      id: detail.id,
      name: detail.name,
      type: detail.type,
      description: detail.description ?? '',
    };
  },
}

const resolvers = {
  addArchitect: async (payload: Prisma.ArchitectsCreateInput): Promise<Architect> => {
    return transformers.architect(await createArchitect(payload));
  },
  addSettlement: async (payload: Prisma.SettlementsCreateInput): Promise<Settlement> => {
    return transformers.settlement(await createSettlement(payload));
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
  getSettlements: (payload: Prisma.SettlementsWhereInput): Promise<Settlements[]> => {
    const settlements = findSettlements(payload);
    const events = resolvers.getEvents({ id: '0' });
    const resources = resolvers.getResources({ id: '0' });
    const details = resolvers.getDetails({ id: '0' });
    const architects = resolvers.getArchitects({ id: '0', name: '0' });
    const tags = resolvers.getTags({ id: '0' });

    return settlements;

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