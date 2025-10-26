import prisma from '@/lib/prisma';
import { BaseResourceType } from '@/lib/types';
import { Prisma } from '@prisma/client';

const resourceTypesInclude = {
  resources: true,
} satisfies Prisma.ResourceTypesInclude;

type ResourceTypesInclude = Prisma.ResourceTypesGetPayload<{
  include: typeof resourceTypesInclude;
}>;

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
    resourceType: ResourceTypesInclude,
  ): BaseResourceType {
    return {
      id: resourceType.id,
      name: resourceType.name,
      description: resourceType.description ?? '',
    };
  }
}
