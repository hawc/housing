import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseDetail } from '@/lib/types';
import { Prisma } from '@prisma/client';
import { DetailDateError, normalizeDetailDate } from '@/lib/detailDate';
import { validateDetailValue } from '@/lib/detailValue';
import { dateInputValue } from '@/lib/calendarDate';
import { validateDetailScope } from '@/lib/detailScope';
import { annotationForDetailDate } from '@/lib/detailDateAnnotation';

const detailsInclude = {
  detailType: true,
} satisfies Prisma.DetailsInclude;

type DetailsInclude = Prisma.DetailsGetPayload<{
  include: typeof detailsInclude;
}>;

type EditableDetailInput = Partial<
  Pick<
    Prisma.DetailsUncheckedCreateInput,
    | 'name'
    | 'description'
    | 'annotation'
    | 'source'
    | 'detailDate'
    | 'detailTypeId'
  >
>;

export class DetailsLogic {
  static async findDetails(where: Prisma.DetailsWhereInput) {
    return await prisma.details.findMany({
      where,
      include: detailsInclude,
    });
  }

  static async addDetail(data: Prisma.DetailsUncheckedCreateInput) {
    const type = await prisma.detailTypes.findUnique({
      where: { id: data.detailTypeId },
    });
    if (!type) throw new DetailDateError('Detailtyp nicht gefunden.');
    const detailDate = normalizeDetailDate(type.name, data.detailDate);
    validateDetailValue(type.name, data.description);
    validateDetailScope(type.name, data.annotation);
    return await prisma.details.create({
      data: {
        name: data.name,
        description: data.description,
        annotation: annotationForDetailDate(data.annotation, data.detailDate),
        source: data.source,
        settlementId: data.settlementId,
        detailTypeId: data.detailTypeId,
        detailDate,
      },
      include: detailsInclude,
    });
  }

  static async updateDetail(
    where: Prisma.DetailsWhereUniqueInput,
    data: EditableDetailInput,
  ) {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.details.findUnique({ where });
      if (!existing) throw new DetailDateError('Detaileintrag nicht gefunden.');
      const detailTypeId = data.detailTypeId ?? existing.detailTypeId;
      const type = await tx.detailTypes.findUnique({
        where: { id: detailTypeId },
      });
      if (!type) throw new DetailDateError('Detailtyp nicht gefunden.');
      const inputDate =
        data.detailDate === undefined ? existing.detailDate : data.detailDate;
      const detailDate = normalizeDetailDate(type.name, inputDate);
      validateDetailValue(
        type.name,
        data.description === undefined
          ? existing.description
          : data.description,
      );
      validateDetailScope(
        type.name,
        data.annotation === undefined ? existing.annotation : data.annotation,
      );
      return tx.details.update({
        where,
        data: {
          name: data.name,
          description: data.description,
          annotation: annotationForDetailDate(
            data.annotation === undefined
              ? existing.annotation
              : data.annotation,
            inputDate,
            existing.detailDate,
          ),
          source: data.source,
          detailTypeId,
          detailDate,
        },
        include: detailsInclude,
      });
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

  static toBaseDetail(detail: DetailsInclude): BaseDetail {
    return {
      id: detail.id,
      name: detail.name,
      description: detail.description ?? '',
      annotation: detail.annotation ?? '',
      source: detail.source ?? '',
      detailDate: dateInputValue(detail.detailDate),
      detailType: transformers.detailType(detail.detailType),
    };
  }
}
