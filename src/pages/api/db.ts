// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Architects, Events, Settlements } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { createArchitect, createSettlement, deleteArchitect, deleteSettlement, findArchitects, findDetails, findEvents, findResources, findSettlements, findTags } from '@/lib/db';

import { Architect, Detail, Event, Resource, Settlement, Tag } from '@/pages/admin';

interface AddArchitectPayload {
  name: string;
}

interface GetArchitectsPayload {
  id: string;
  name: string;
}

interface DeleteArchitectsPayload {
  id: string;
}

interface AddSettlementPayload {
  description: string;
  title: string;
}

interface GetSettlementsPayload {
  title: string;
}

interface DeleteSettlementsPayload {
  id: string;
}

interface GetEventTypesPayload {
  id: string;
}

interface GetEventsPayload {
  id: string;
}

interface GetResourcesPayload {
  id: string;
}

interface GetDetailsPayload {
  id: string;
}

interface GetTagsPayload {
  id: string;
}

const transformers = {
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
  settlement: (settlement: Settlements): Settlement => {
    return {
      id: settlement.id,
      title: settlement.title ?? '',
      description: settlement.description ?? '',
      events: [],
      location: settlement.location ?? '',
      description: settlement.description ?? '',
    };
  },
}

const resolvers = {
  addArchitect: async (payload: AddArchitectPayload): Promise<Architect> => {
    return transformers.architect(await createArchitect(payload));
  },
  addSettlement: async (payload: AddSettlementPayload): Promise<Settlement> => {
    return createSettlement(payload);
  },
  deleteArchitect: async (payload: DeleteArchitectsPayload): Promise<Architect> => {
    return deleteArchitect({ id: payload.id });
  },
  deleteSettlement: async (payload: DeleteSettlementsPayload): Promise<Settlement> => {
    return deleteSettlement({ id: payload.id });
  },
  getArchitects: async (payload: GetArchitectsPayload): Promise<Architect[]> => {
    const architects: Architects[] = await (payload ? findArchitects({
      id: payload.id,
      name: payload.name,
    }) : findArchitects());

    return architects.map(transformers.architect);
  },
  getSettlements: (payload: GetSettlementsPayload): Promise<Settlements[]> => {
    const settlements = findSettlements(payload);
    const events = resolvers.getEvents({ id: '0' });
    const resources = resolvers.getResources({ id: '0' });
    const details = resolvers.getDetails({ id: '0' });
    const architects = resolvers.getArchitects({ id: '0', name: '0' });
    const tags = resolvers.getTags({ id: '0' });

    return settlements;

  },
  getEvents: async (payload: GetEventsPayload): Promise<Event[]> => {
    const events = await findEvents({ id: payload.id });
    return events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      type: resolvers.getEventTypes(),
    }));
  },
  getResources: async (payload: GetResourcesPayload): Promise<Resource[]> => {
    return findResources({ id: payload.id });
  },
  getDetails: async (payload: GetDetailsPayload): Promise<Detail[]> => {
    return findDetails({ id: payload.id });
  },
  getTags: async (payload: GetTagsPayload): Promise<Tag[]> => {
    return findTags({ id: payload.id });
  },
  getEventTypes: async (payload: GetEventTypesPayload): Promise<Tag[]> => {
    return findEventTypes({ id: payload.id });
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