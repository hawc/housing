import { detailsInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class DetailsLogic {
  static async findDetails(where: Prisma.DetailsWhereInput) {
    return await prisma.details.findMany({
      where,
      include: detailsInclude,
    });
  }

  static async addDetail(data: Prisma.DetailsUncheckedCreateInput) {
    return await prisma.details.create({
      data: {
        name: data.name,
        description: data.description,
        annotation: data.annotation,
        source: data.source,
        settlementId: data.settlementId,
        detailTypeId: data.detailTypeId,
        detailDate: data.detailDate,
      },
      include: detailsInclude,
    });
  }

  static async updateDetail(
    where: Prisma.DetailsWhereUniqueInput,
    data: Prisma.DetailsUpdateInput
  ) {
    return await prisma.details.update({
      where,
      data,
      include: detailsInclude,
    });
  }

  static async deleteDetail(where: Prisma.DetailsWhereUniqueInput) {
    return await prisma.details.update({
      where,
      data: {
        published: false,
      },
      include: detailsInclude,
    });
  }
}