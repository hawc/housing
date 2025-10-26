import { eventTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

export class EventTypesLogic {
  static async findEventTypes() {
    return await prisma.eventTypes.findMany({
      where: {
        published: true,
      },
      include: eventTypesInclude,
    });
  }
}
