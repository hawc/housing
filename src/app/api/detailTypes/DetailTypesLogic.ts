import prisma from '@/lib/prisma';
import { BaseDetailType } from '@/lib/types';
import { Prisma } from '@prisma/client';

const detailTypesInclude = {
  details: true,
} satisfies Prisma.DetailTypesInclude;

type DetailTypesInclude = Prisma.DetailTypesGetPayload<{
  include: typeof detailTypesInclude;
}>;

export class DetailTypesLogic {
  static async findDetailTypes() {
    return await prisma.detailTypes.findMany({
      where: {
        published: true,
      },
      include: detailTypesInclude,
    });
  }

  static toBaseDetailType(detailType: DetailTypesInclude): BaseDetailType {
    return {
      id: detailType.id,
      name: detailType.name,
      description: detailType.description ?? '',
    };
  }
}
