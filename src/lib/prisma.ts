// import { Prisma as OriginalPrisma } from '@prisma/client';
// import { Prisma as CachedPrisma } from 'cached-prisma';
// import slugify from 'slugify';

// let prisma: CachedPrisma['client'];

// if (process.env.NODE_ENV === 'production') {
//   prisma = new CachedPrisma().client;
// } else {
//   const globalWithPrisma = global as typeof globalThis & {
//     prisma: CachedPrisma['client'];
//   };
//   if (!globalWithPrisma.prisma) {
//     globalWithPrisma.prisma = new CachedPrisma().client;
//   }
//   prisma = globalWithPrisma.prisma;
// }

// export const getValue = (input: string | number | OriginalPrisma.StringFieldUpdateOperationsInput | OriginalPrisma.FloatFieldUpdateOperationsInput) => {
//   if (input === null || input === undefined) {
//     return input;
//   }
//   return (typeof input === 'object') ? (input.set ?? '') : input;
// }

import { Prisma, PrismaClient } from '@prisma/client';

import { slugify } from '@/lib/utils';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export const getValue = (input: string | number | Prisma.StringFieldUpdateOperationsInput | Prisma.FloatFieldUpdateOperationsInput) => {
  if (input === null || input === undefined) {
    return input;
  }
  return (typeof input === 'object') ? (input.set ?? '') : input;
}

const getCreateOrUpdateQuery = (args, query) => {
  if (args.data.name) {
    return query({
      ...args,
      data: {
        ...args.data,
        slug: slugify(getValue(args.data.name) as string)
      }
    });
  }
  return query({
    ...args,
    data: {
      ...args.data,
    }
  });
};

const getUpsertQuery = (args, query) => {
  if (args.create.name) {
    return query({
      ...args,
      update: {
        ...args.update,
        slug: slugify(getValue(args.update.name) as string)
      },
      create: {
        ...args.create,
        slug: slugify(args.create.name)
      }
    });
  }
  return query({
    ...args,
    update: {
      ...args.update,
    },
    create: {
      ...args.create,
    }
  });
};

const publicPrisma = prisma.$extends({
  query: {
    settlements: {
      create({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
      update({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
      upsert({ args, query }) {
        return getUpsertQuery(args, query);
      },
      updateMany({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
    },
    settlementTypes: {
      create({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
      update({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
      upsert({ args, query }) {
        return getUpsertQuery(args, query);
      },
      updateMany({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
    },
    architects: {
      create({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
      update({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
      upsert({ args, query }) {
        return getUpsertQuery(args, query);
      },
      updateMany({ args, query }) {
        return getCreateOrUpdateQuery(args, query);
      },
    },
  },
});

export default publicPrisma;
