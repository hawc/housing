import { transaction } from '@/lib/research/transaction';
import { touchSettlement, touchArchitect } from '@/lib/contentUpdates';
import { saveOwner, saveArchitectAssignment } from '@/lib/contentUpdates';
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
        updatedSections: ['general'],
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
      },
      include: architectsInclude,
    });
  }

  static async updateArchitect(
    where: Prisma.ArchitectsWhereUniqueInput,
    data: Prisma.ArchitectsUpdateInput,
  ) {
    return await saveOwner('architects', where, (tx) =>
      tx.architects.update({
        where,
        data,
        include: architectsInclude,
      }),
    );
  }

  static async deleteArchitect(where: Prisma.ArchitectsWhereUniqueInput) {
    return await saveOwner('architects', where, (tx) =>
      tx.architects.update({
        where,
        data: {
          published: false,
        },
        include: architectsInclude,
      }),
    );
  }

  static async updateSettlementsOnArchitect(
    where: Prisma.SettlementsOnArchitectsWhereUniqueInput,
    data: Prisma.SettlementsOnArchitectsUpdateInput,
  ) {
    return await saveArchitectAssignment(where, (tx) =>
      tx.settlementsOnArchitects.update({
        where,
        data,
      }),
    );
  }

  static async removeSettlement(architectId: string, settlementId: string) {
    return transaction(prisma, async (tx) => {
      const result = await tx.settlementsOnArchitects.delete({
        where: { settlementId_architectId: { architectId, settlementId } },
      });
      await touchSettlement(tx, settlementId, ['architects']);
      await touchArchitect(tx, architectId, ['settlements']);
      return result;
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
        transformers.settlement(settlementsOnArchitect.settlement),
      ),
      createdAt: architect.createdAt,
      updatedAt: architect.updatedAt,
    };
  }
}
