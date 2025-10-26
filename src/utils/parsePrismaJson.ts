import { Prisma } from '@prisma/client';

export function parsePrismaJson<T>(json: Prisma.JsonValue) {
  if (!json) {
    return undefined;
  }

  return json as T;
}
