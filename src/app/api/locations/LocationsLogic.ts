import { saveSettlementPart, locationContent } from '@/lib/contentUpdates';
import { settlementsSelectWithLocations } from '@/app/api/settlements/selects';
import prisma from '@/lib/prisma';
import { transformers } from '@/lib/transformers';
import { BaseLocation } from '@/lib/types';
import { parsePrismaJson } from '@/utils/parsePrismaJson';
import { Prisma } from '@prisma/client';
import { Polygon } from 'geojson';

const locationsInclude = {
  settlement: {
    select: settlementsSelectWithLocations,
  },
} satisfies Prisma.LocationsInclude;

type LocationsInclude = Prisma.LocationsGetPayload<{
  include: typeof locationsInclude;
}>;

export class LocationsLogic {
  static async findLocations() {
    return await prisma.locations.findMany({
      where: {
        published: true,
        settlement: {
          published: true,
        },
      },
      include: locationsInclude,
    });
  }

  static async createLocation(data: Prisma.LocationsCreateInput) {
    return await saveSettlementPart(
      undefined,
      (tx) =>
        tx.locations.create({
          data: {
            lat: data.lat,
            lng: data.lng,
            name: data.name,
            address: data.address,
            district: data.district,
            zipCode: data.zipCode,
            city: data.city,
            state: data.state,
            settlement: data.settlement,
          },
          include: locationsInclude,
        }),
      'location',
      locationContent,
    );
  }

  static async updateLocation(
    where: Prisma.LocationsWhereUniqueInput,
    data: Prisma.LocationsUpdateInput,
  ) {
    return await saveSettlementPart(
      (tx) => tx.locations.findUnique({ where }),
      (tx) =>
        tx.locations.update({
          where,
          data,
          include: locationsInclude,
        }),
      'location',
      locationContent,
    );
  }

  static async deleteLocation(where: Prisma.LocationsWhereUniqueInput) {
    return await saveSettlementPart(
      (tx) => tx.locations.findUnique({ where }),
      (tx) =>
        tx.locations.update({
          where,
          data: {
            published: false,
          },
          include: locationsInclude,
        }),
      'location',
      locationContent,
    );
  }

  static toBaseLocation(location: LocationsInclude): BaseLocation {
    return {
      id: location.id,
      name: location.name ?? '',
      address: location.address ?? '',
      district: location.district ?? '',
      zipCode: location.zipCode ?? '',
      city: location.city ?? '',
      state: location.state ?? '',
      lat: location.lat,
      lng: location.lng,
      geo: parsePrismaJson<Polygon | undefined>(location.geo),
      settlement: transformers.settlement(location.settlement),
    };
  }
}
