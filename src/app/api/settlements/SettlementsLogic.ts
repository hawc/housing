import { architectsSelect } from '@/app/api/architects/selects';
import { detailsSelect } from '@/app/api/details/selects';
import { eventsSelect } from '@/app/api/events/selects';
import { locationsSelect } from '@/app/api/locations/selects';
import { resourcesSelect } from '@/app/api/resources/selects';
import { settlementsSelect, settlementTypesSelect } from '@/app/api/settlements/selects';
import { tagsSelect } from '@/app/api/tags/selects';
import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseSettlement } from '@/lib/types';
import { slugify } from '@/utils/slugify';
import { Prisma } from '@prisma/client';

const settlementsInclude = {
  architects: {
    select: {
      architect: {
        select: architectsSelect,
      },
      role: true,
    },
  },
  details: {
    select: detailsSelect,
    where: {
      published: true,
    },
  },
  resources: {
    select: resourcesSelect,
    where: {
      published: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: tagsSelect,
      },
    },
  },
  settlementTypes: {
    select: {
      settlementType: {
        select: settlementTypesSelect,
      },
    },
  },
  events: {
    select: eventsSelect,
    where: {
      published: true,
    },
  },
  location: {
    select: locationsSelect,
  },
} satisfies Prisma.SettlementsInclude;

type SettlementsInclude = Prisma.SettlementsGetPayload<{
  include: typeof settlementsInclude;
}>;

export class SettlementsLogic {
  static async findSettlement(where: Prisma.SettlementsWhereUniqueInput) {
    return await prisma.settlements.findUnique({
      where,
      include: settlementsInclude,
    });
  }

  static async findSettlements() {
    return await prisma.settlements.findMany({
      where: {
        published: true,
      },
      include: settlementsInclude,
    });
  }

  static async updateSettlement(
    where: Prisma.SettlementsWhereUniqueInput,
    data: Prisma.SettlementsUpdateInput
  ) {
    return await prisma.settlements.update({
      where,
      data,
      include: settlementsInclude,
    });
  }

  static async createSettlement(data: Prisma.SettlementsCreateInput) {
    return await prisma.settlements.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
      },
      include: settlementsInclude,
    });
  }

  static async deleteSettlement(where: Prisma.SettlementsWhereUniqueInput) {
    return await prisma.settlements.update({
      where,
      data: {
        published: false,
      },
      include: settlementsInclude,
    });
  }

  static async addSettlementsOnArchitect(
    data: Prisma.SettlementsOnArchitectsUncheckedCreateInput
  ) {
    return await prisma.settlementsOnArchitects.create({
      data: data,
      include: {
        architect: {
          select: architectsSelect,
        },
        settlement: {
          select: settlementsSelect,
        },
      },
    });
  }

  static async addSettlementsOnTag(
    data: Prisma.SettlementsOnTagsUncheckedCreateInput
  ) {
    return await prisma.settlementsOnTags.create({
      data: data,
      include: {
        tag: {
          select: tagsSelect,
        },
        settlement: {
          select: settlementsSelect,
        },
      },
    });
  }

  static toBaseSettlement(settlement: SettlementsInclude): BaseSettlement {
    return {
      id: settlement.id,
      name: settlement.name,
      slug: settlement.slug,
      description: settlement.description ?? '',
      details: settlement.details.map(transformers.detail),
      types: settlement.settlementTypes.map((settlementsOnSettlementType) =>
        transformers.settlementType(settlementsOnSettlementType.settlementType)
      ),
      architects: settlement.architects.map((settlementsOnArchitect) =>
        transformers.architect(
          settlementsOnArchitect.architect,
          settlementsOnArchitect.role
        )
      ),
      resources: settlement.resources.map(transformers.resource),
      tags: settlement.tags.map((tagRelation) =>
        transformers.tag(tagRelation.tag)
      ),
      events: settlement.events.map(transformers.event),
      location: settlement.location
        ? transformers.location(settlement.location)
        : null,
      createdAt: settlement.createdAt,
      updatedAt: settlement.updatedAt,
    };
  }
}
