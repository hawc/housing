import { Prisma } from '@prisma/client';

export const locationsSelect = {
  id: true,
  name: true,
  address: true,
  district: true,
  zipCode: true,
  city: true,
  state: true,
  lat: true,
  lng: true,
  geo: true,
} satisfies Prisma.LocationsSelect;

export type LocationsSelect = Prisma.LocationsGetPayload<{
  select: typeof locationsSelect;
}>;
