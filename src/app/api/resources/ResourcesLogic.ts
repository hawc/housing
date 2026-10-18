import {
  saveSettlementPart,
  resourceContent,
  resourceSection,
} from '@/lib/contentUpdates';
import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseResource } from '@/lib/types';
import { Prisma } from '@prisma/client';

const resourcesInclude = {
  resourceType: true,
} satisfies Prisma.ResourcesInclude;

type ResourcesInclude = Prisma.ResourcesGetPayload<{
  include: typeof resourcesInclude;
}>;

export class ResourcesLogic {
  static async findResources(where: Prisma.ResourcesWhereInput) {
    return await prisma.resources.findMany({
      where,
      include: resourcesInclude,
    });
  }

  static async addResource(data: Prisma.ResourcesUncheckedCreateInput) {
    return await saveSettlementPart(
      undefined,
      (tx) =>
        tx.resources.create({
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
        }),
      resourceSection,
      resourceContent,
    );
  }

  static async updateResource(
    where: Prisma.ResourcesWhereUniqueInput,
    data: Prisma.ResourcesUpdateInput,
  ) {
    return await saveSettlementPart(
      (tx) => tx.resources.findUnique({ where, include: resourcesInclude }),
      (tx) =>
        tx.resources.update({
          where,
          data,
          include: resourcesInclude,
        }),
      resourceSection,
      resourceContent,
    );
  }

  static async deleteResource(where: Prisma.ResourcesWhereUniqueInput) {
    return await saveSettlementPart(
      (tx) => tx.resources.findUnique({ where, include: resourcesInclude }),
      (tx) =>
        tx.resources.update({
          where,
          data: {
            published: false,
          },
          include: resourcesInclude,
        }),
      resourceSection,
      resourceContent,
    );
  }

  static toBaseResource(resource: ResourcesInclude): BaseResource {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description ?? '',
      source: resource.source ?? '',
      url: resource.url,
      license: resource.license ?? '',
      copyright: resource.copyright ?? '',
      resourceType: transformers.resourceType(resource.resourceType),
    };
  }
}
