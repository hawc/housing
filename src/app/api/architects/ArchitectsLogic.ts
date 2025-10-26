import { architectsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { slugify } from '@/utils/slugify';
import type { Prisma } from '@prisma/client';

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
}
