import prisma from '@/lib/prisma';
import { Platform } from '@/lib/types';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';

export const platformsInclude = {
  externalLinks: true,
} satisfies Prisma.PlatformsInclude;

export type PlatformsInclude = Prisma.PlatformsGetPayload<{
  include: typeof platformsInclude;
}>;

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

  static toPlatform(platform: PlatformsInclude): Platform {
    return {
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      description: platform.description ?? '',
      url: platform.url ?? '',
      urlIdentifier: platform.urlIdentifier ?? '',
    };
  }
}
