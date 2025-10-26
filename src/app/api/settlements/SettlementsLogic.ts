import {
  settlementsInclude,
  settlementsOnArchitectsInclude,
  settlementsOnTagsInclude,
} from '@/lib/db';
import prisma from '@/lib/prisma';
import { slugify } from '@/utils/slugify';
import type { Prisma } from '@prisma/client';

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
      include: settlementsOnArchitectsInclude,
    });
  }

  static async addSettlementsOnTag(
    data: Prisma.SettlementsOnTagsUncheckedCreateInput
  ) {
    return await prisma.settlementsOnTags.create({
      data: data,
      include: settlementsOnTagsInclude,
    });
  }
}
