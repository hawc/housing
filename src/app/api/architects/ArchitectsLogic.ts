import { externalLinksSelect } from '@/app/api/externalLinks/selects';
import { settlementsSelectWithLocations } from '@/app/api/settlements/selects';
import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseArchitect } from '@/lib/types';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';

const architectsInclude = {
  urls: {
    select: externalLinksSelect,
    where: {
      published: true,
    },
  },
  settlements: {
    select: {
      settlement: {
        select: settlementsSelectWithLocations,
      },
      role: true,
    },
  },
} satisfies Prisma.ArchitectsInclude;

type ArchitectsInclude = Prisma.ArchitectsGetPayload<{
  include: typeof architectsInclude;
}>;

export class ArchitectsLogic {
  static async findArchitect(where: Prisma.ArchitectsWhereUniqueInput) {
    return await prisma.architects.findUnique({
      where: { slug: where.slug },
      include: architectsInclude,
    });
  }

  static async findArchitects() {
    return await prisma.architects.findMany({
      where: {
        published: true,
      },
      include: architectsInclude,
    });
  }

  static async createArchitect(data: Prisma.ArchitectsCreateInput) {
    return await prisma.architects.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
      },
      include: architectsInclude,
    });
  }

  static async updateArchitect(
    where: Prisma.ArchitectsWhereUniqueInput,
    data: Prisma.ArchitectsUpdateInput
  ) {
    return await prisma.architects.update({
      where,
      data,
      include: architectsInclude,
    });
  }

  static async deleteArchitect(where: Prisma.ArchitectsWhereUniqueInput) {
    return await prisma.architects.update({
      where,
      data: {
        published: false,
      },
      include: architectsInclude,
    });
  }

  static async updateSettlementsOnArchitect(
    where: Prisma.SettlementsOnArchitectsWhereUniqueInput,
    data: Prisma.SettlementsOnArchitectsUpdateInput
  ) {
    return await prisma.settlementsOnArchitects.update({
      where,
      data,
    });
  }

  static toBaseArchitect(architect: ArchitectsInclude): BaseArchitect {
    return {
      id: architect.id,
      name: architect.name,
      slug: architect.slug,
      description: architect.description ?? '',
      urls: architect.urls.map(transformers.externalLink),
      settlements: architect.settlements.map((settlementsOnArchitect) =>
        transformers.settlement(settlementsOnArchitect.settlement)
      ),
      createdAt: architect.createdAt,
      updatedAt: architect.updatedAt,
    };
  }
}
