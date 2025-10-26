import { eventTypesSelect } from '@/app/api/eventTypes/selects';
import { Prisma } from '@prisma/client';

export const eventsSelect = {
  id: true,
  name: true,
  description: true,
  source: true,
  eventDate: true,
  eventType: {
    select: eventTypesSelect,
  },
} satisfies Prisma.EventsSelect;

export type EventsSelect = Prisma.EventsGetPayload<{
  select: typeof eventsSelect;
}>;
