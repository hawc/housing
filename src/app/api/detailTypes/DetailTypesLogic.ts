import { detailTypesInclude } from '@/lib/db';
import prisma from '@/lib/prisma';

export class DetailTypesLogic {
  static async findDetailTypes() {
    return await prisma.detailTypes.findMany({
      where: {
        published: true,
      },
      include: detailTypesInclude,
    });
  }
}