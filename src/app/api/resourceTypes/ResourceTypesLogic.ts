import { resourceTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

export class ResourceTypesLogic {
  static async findResourceTypes() {
    return await prisma.resourceTypes.findMany({
      where: {
        published: true,
      },
      include: resourceTypesInclude,
    });
  }
}