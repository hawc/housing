import { platformsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';

export class PlatformsLogic {
  static async findPlatforms() {
    return await prisma.platforms.findMany({
      where: {
        published: true,
      },
      include: platformsInclude,
    });
  }

  static async addPlatform(data: Prisma.PlatformsUncheckedCreateInput) {
    return await prisma.platforms.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        url: data.url,
        urlIdentifier: data.urlIdentifier,
      },
      include: platformsInclude,
    });
  }

  static async updatePlatform(
    where: Prisma.PlatformsWhereUniqueInput,
    data: Prisma.PlatformsUpdateInput
  ) {
    return await prisma.platforms.update({
      where,
      data,
      include: platformsInclude,
    });
  }

  static async deletePlatform(where: Prisma.PlatformsWhereUniqueInput) {
    return await prisma.platforms.update({
      where,
      data: {
        published: false,
      },
      include: platformsInclude,
    });
  }
}
