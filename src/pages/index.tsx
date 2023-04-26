// import { GetStaticProps } from 'next/types';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

// import prisma from '../lib/prisma';
import Vercel from '~/svg/Vercel.svg';

// export const getStaticProps: GetStaticProps = async () => {
//   const feed = await prisma.settlements.findMany();
//   return {
//     props: { feed },
//     // revalidate: 10,
//   };
// };

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
            <Vercel className='text-5xl' />
            <h1 className='mt-4'>
              Next.js + Tailwind CSS + TypeScript Starter
            </h1>
            <p className='mt-2 text-sm text-gray-800'>
              A starter for Next.js, Tailwind CSS, and TypeScript with Absolute
              Import, Seo, Link component, pre-configured with Husky{' '}
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
