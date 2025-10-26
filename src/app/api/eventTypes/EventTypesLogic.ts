import prisma from '@/lib/prisma';
import { BaseEventType } from '@/lib/types';
import { Prisma } from '@prisma/client';

const eventTypesInclude = {
  events: true,
} satisfies Prisma.EventTypesInclude;

type EventTypesInclude = Prisma.EventTypesGetPayload<{
  include: typeof eventTypesInclude;
}>;

export class EventTypesLogic {
  static async findEventTypes() {
    return await prisma.eventTypes.findMany({
      where: {
        published: true,
      },
      include: eventTypesInclude,
    });
  }

  static toBaseEventType(eventType: EventTypesInclude): BaseEventType {
    return {
      id: eventType.id,
      name: eventType.name,
      description: eventType.description ?? '',
    };
  }
}
