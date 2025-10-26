import { resourcesInclude, tagsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class TagsLogic {
  static async findTags() {
    return await prisma.tags.findMany({
      where: {
        published: true,
      },
      include: tagsInclude,
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

  static async updateTag(
    where: Prisma.TagsWhereUniqueInput,
    data: Prisma.TagsUpdateInput
  ) {
    return await prisma.tags.update({
      where,
      data,
      include: tagsInclude,
    });
  }

  static async deleteTag(where: Prisma.TagsWhereUniqueInput) {
    return await prisma.tags.update({
      where,
      data: {
        published: false,
      },
      include: tagsInclude,
    });
  }
}