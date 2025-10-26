import { externalLinksInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class ExternalLinksLogic {
  static async findExternalLinks(where: Prisma.ExternalLinksWhereInput) {
    return await prisma.externalLinks.findMany({
      where,
      include: externalLinksInclude,
    });
  }

  static async addExternalLink(data: Prisma.ExternalLinksUncheckedCreateInput) {
    return await prisma.externalLinks.create({
      data: {
        name: data.name,
        description: data.description,
        url: data.url,
        architectId: data.architectId,
        platformId: data.platformId,
      },
      include: externalLinksInclude,
    });
  }

  static async updateExternalLink(
    where: Prisma.ExternalLinksWhereUniqueInput,
    data: Prisma.ExternalLinksUpdateInput
  ) {
    return await prisma.externalLinks.update({
      where,
      data,
      include: externalLinksInclude,
    });
  }

  static async deleteExternalLink(where: Prisma.ExternalLinksWhereUniqueInput) {
    return await prisma.externalLinks.update({
      where,
      data: {
        published: false,
      },
      include: externalLinksInclude,
    });
  }
}
