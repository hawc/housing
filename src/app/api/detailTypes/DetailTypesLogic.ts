import { DetailTypesInclude, detailTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';
import { BaseDetailType } from '@/lib/types';

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
