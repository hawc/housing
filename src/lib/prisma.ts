import { Prisma as CachedPrisma } from 'cached-prisma';

let prisma: CachedPrisma['client'];

if (process.env.NODE_ENV === 'production') {
  prisma = new CachedPrisma().client;
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: CachedPrisma['client'];
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new CachedPrisma().client;
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
