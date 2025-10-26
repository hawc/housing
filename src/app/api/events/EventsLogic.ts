import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseEvent } from '@/lib/types';
import { Prisma } from '@prisma/client';

const eventsInclude = {
  eventType: true,
} satisfies Prisma.EventsInclude;

type EventsInclude = Prisma.EventsGetPayload<{
  include: typeof eventsInclude;
}>;

export class EventsLogic {
  static async findEvents(where: Prisma.EventsWhereInput) {
    return await prisma.events.findMany({
      where,
      include: eventsInclude,
    });
  }

  static async addEvent(data: Prisma.EventsUncheckedCreateInput) {
    return await prisma.events.create({
      data: {
        name: data.name,
        description: data.description,
        source: data.source,
        settlementId: data.settlementId,
        eventTypeId: data.eventTypeId,
        eventDate: data.eventDate,
      },
      include: eventsInclude,
    });
  }

  static async updateEvent(
    where: Prisma.EventsWhereUniqueInput,
    data: Prisma.EventsUpdateInput,
  ) {
    return await prisma.events.update({
      where,
      data,
      include: eventsInclude,
    });
  }

  static async deleteEvent(where: Prisma.EventsWhereUniqueInput) {
    return await prisma.events.update({
      where,
      data: {
        published: false,
      },
      include: eventsInclude,
    });
  }

  static toBaseEvent(event: EventsInclude): BaseEvent {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      source: event.source ?? '',
      eventDate: event.eventDate?.toDateString() ?? '',
      eventType: transformers.eventType(event.eventType),
    };
  }
}
