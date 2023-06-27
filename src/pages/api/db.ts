// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import { architects, events, settlements } from '@prisma/client';
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
  architect: (architect: architects): Architect => {
    return {
      id: String(architect.id),
      name: architect.name,
    };
  },
  event: (event: events): Event => {
    return {
      id: String(event.id),
      name: event.name,
      description: event.description ?? '',
      typeId: String(event.event_type),
    };
  },
  settlement: (settlement: settlements): Settlement => {
    return {
      id: String(settlement.id),
      title: settlement.title ?? '',
      description: settlement.description ?? '',
      events: [],
      location: settlement.location ?? '',
      description: settlement.description ?? '',
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
    return deleteArchitect({ id: BigInt(payload.id) });
  },
  deleteSettlement: async (payload: DeleteSettlementsPayload): Promise<Settlement> => {
    return deleteSettlement({ id: BigInt(payload.id) });
  },
  getArchitects: async (payload: GetArchitectsPayload): Promise<Architect[]> => {
    const architects: architects[] = await (payload ? findArchitects({
      id: BigInt(payload.id),
      name: payload.name,
    }) : findArchitects());

    return architects.map(transformers.architect);
  },
  getSettlements: (payload: GetSettlementsPayload): Promise<settlements[]> => {
    const settlements = findSettlements(payload);
    const events = resolvers.getEvents({ id: '0' });
    const resources = resolvers.getResources({ id: '0' });
    const details = resolvers.getDetails({ id: '0' });
    const architects = resolvers.getArchitects({ id: '0', name: '0' });
    const tags = resolvers.getTags({ id: '0' });

    return settlements;

  },
  getEvents: async (payload: GetEventsPayload): Promise<Event[]> => {
    const events = await findEvents({ id: BigInt(payload.id) });
    return events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      type: resolvers.getEventTypes(),
    }));
  },
  getResources: async (payload: GetResourcesPayload): Promise<Resource[]> => {
    return findResources({ id: BigInt(payload.id) });
  },
  getDetails: async (payload: GetDetailsPayload): Promise<Detail[]> => {
    return findDetails({ id: BigInt(payload.id) });
  },
  getTags: async (payload: GetTagsPayload): Promise<Tag[]> => {
    return findTags({ id: BigInt(payload.id) });
  },
  getEventTypes: async (payload: GetEventTypesPayload): Promise<Tag[]> => {
    return findEventTypes({ id: BigInt(payload.id) });
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