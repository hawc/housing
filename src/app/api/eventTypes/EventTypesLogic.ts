import { EventTypesInclude, eventTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { BaseEventType } from '@/lib/types';

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
