import { Prisma as OriginalPrisma } from '@prisma/client';
import { Prisma as CachedPrisma } from 'cached-prisma';
import slugify from 'slugify';

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

const getValue = (input: string | OriginalPrisma.StringFieldUpdateOperationsInput = '') => {
  return typeof input === 'string' ? input : (input.set ?? '');
}

const publicPrisma = prisma.$extends({
  query: {
    settlements: {
      create({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(args.data.name, { lower: true, locale: 'de' })
          }
        });
      },
      update({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(getValue(args.data.name), { lower: true, locale: 'de' })
          }
        });
      },
      upsert({ args, query }) {
        return query({
          ...args,
          update: {
            ...args.update,
            slug: slugify(getValue(args.update.name), { lower: true, locale: 'de' })
          },
          create: {
            ...args.create,
            slug: slugify(args.create.name, { lower: true, locale: 'de' })
          }
        });
      },
      updateMany({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(getValue(args.data.name), { lower: true, locale: 'de' })
          }
        });
      },
    },
    settlementTypes: {
      create({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(args.data.name, { lower: true, locale: 'de' })
          }
        });
      },
      update({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(getValue(args.data.name), { lower: true, locale: 'de' })
          }
        });
      },
      upsert({ args, query }) {
        return query({
          ...args,
          update: {
            ...args.update,
            slug: slugify(getValue(args.update.name), { lower: true, locale: 'de' })
          },
          create: {
            ...args.create,
            slug: slugify(args.create.name, { lower: true, locale: 'de' })
          }
        });
      },
      updateMany({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(getValue(args.data.name), { lower: true, locale: 'de' })
          }
        });
      },
    },
    architects: {
      create({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(args.data.name, { lower: true, locale: 'de' })
          }
        });
      },
      update({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(getValue(args.data.name), { lower: true, locale: 'de' })
          }
        });
      },
      upsert({ args, query }) {
        return query({
          ...args,
          update: {
            ...args.update,
            slug: slugify(getValue(args.update.name), { lower: true, locale: 'de' })
          },
          create: {
            ...args.create,
            slug: slugify(args.create.name, { lower: true, locale: 'de' })
          }
        });
      },
      updateMany({ args, query }) {
        return query({
          ...args,
          data: {
            ...args.data,
            slug: slugify(getValue(args.data.name), { lower: true, locale: 'de' })
          }
        });
      },
    },
  },
});

export default publicPrisma;
