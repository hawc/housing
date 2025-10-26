import { resourcesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class ResourcesLogic {
  static async findResources(where: Prisma.ResourcesWhereInput) {
    return await prisma.resources.findMany({
      where,
      include: resourcesInclude,
    });
  }

  static async addResource(data: Prisma.ResourcesUncheckedCreateInput) {
    return await prisma.resources.create({
      data: {
        name: data.name,
        description: data.description,
        url: data.url,
        source: data.source,
        license: data.license,
        copyright: data.copyright,
        resourceTypeId: data.resourceTypeId,
        settlementId: data.settlementId,
      },
      include: resourcesInclude,
    });
  }

  static async updateResource(
    where: Prisma.ResourcesWhereUniqueInput,
    data: Prisma.ResourcesUpdateInput
  ) {
    return await prisma.resources.update({
      where,
      data,
      include: resourcesInclude,
    });
  }

  static async deleteResource(where: Prisma.ResourcesWhereUniqueInput) {
    return await prisma.resources.update({
      where,
      data: {
        published: false,
      },
      include: resourcesInclude,
    });
  }
}
