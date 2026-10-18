import { saveSettlementPart, eventContent } from '@/lib/contentUpdates';
import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseEvent } from '@/lib/types';
import { Prisma } from '@prisma/client';
import { dateInputValue } from '@/lib/calendarDate';

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
    return await saveSettlementPart(
      undefined,
      (tx) =>
        tx.events.create({
          data: {
            name: data.name,
            description: data.description,
            source: data.source,
            settlementId: data.settlementId,
            eventTypeId: data.eventTypeId,
            eventDate: data.eventDate,
          },
          include: eventsInclude,
        }),
      'history',
      eventContent,
    );
  }

  static async updateEvent(
    where: Prisma.EventsWhereUniqueInput,
    data: Prisma.EventsUpdateInput,
  ) {
    return await saveSettlementPart(
      (tx) => tx.events.findUnique({ where }),
      (tx) =>
        tx.events.update({
          where,
          data,
          include: eventsInclude,
        }),
      'history',
      eventContent,
    );
  }

  static async deleteEvent(where: Prisma.EventsWhereUniqueInput) {
    return await saveSettlementPart(
      (tx) => tx.events.findUnique({ where }),
      (tx) =>
        tx.events.update({
          where,
          data: {
            published: false,
          },
          include: eventsInclude,
        }),
      'history',
      eventContent,
    );
  }

  static toBaseEvent(event: EventsInclude): BaseEvent {
    return {
      id: event.id,
      name: event.name,
      description: event.description ?? '',
      source: event.source ?? '',
      eventDate: dateInputValue(event.eventDate),
      eventType: transformers.eventType(event.eventType),
    };
  }
}
