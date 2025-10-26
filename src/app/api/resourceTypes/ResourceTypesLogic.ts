import { ResourceTypesInclude, resourceTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { BaseResourceType } from '@/lib/types';

export class ResourceTypesLogic {
  static async findResourceTypes() {
    return await prisma.resourceTypes.findMany({
      where: {
        published: true,
      },
      include: resourceTypesInclude,
    });
  }

  static toBaseResourceType(
    resourceType: ResourceTypesInclude
  ): BaseResourceType {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  }
}
