import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchData } from '@/lib/fetch';
import type { BaseSettlement } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';
import { Settlement } from '@/components/settlements/View';

export async function generateMetadata(
  { params },
): Promise<Metadata> {
  const settlement = await getSettlement(params.slug);

  return {
    title: settlement?.name,
  };
}

export async function generateStaticParams() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', []);

  const slugs = settlements.map(settlement => (
    { slug: settlement.slug }
  ));

  return slugs;
}

async function getSettlement(slug: string) {
  const settlement = await fetchData<BaseSettlement>(`/api/settlements/get/${slug}`);

  return settlement;
}

export default async function SettlementPage({ params }) {
  const settlement = await getSettlement(params.slug);

  if (!settlement) {
    notFound();
  }

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb href="/siedlungen">Siedlungen</Breadcrumb>
        <Breadcrumb>{settlement.name}</Breadcrumb>
      </Breadcrumbs>
    }>
      <section>
        <Settlement settlement={settlement} />
      </section>
      <section>
        <Box ghost>
          <div className='text-center mt-2 mb-6'>
            <span className='block sm:inline'>Eintrag erstellt: {settlement.createdAt}</span>
            <span className='hidden sm:inline'> • </span>
            <span className='block sm:inline'>aktualisiert: {settlement.updatedAt || settlement.createdAt}</span>
          </div>
        </Box>
      </section>
    </Layout>
  );
}
