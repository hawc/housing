import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchData } from '@/lib/fetch';

import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';
import { Settlement } from '@/components/settlements/View';

import type { BaseSettlement } from '@/app/admin/page';

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
    </Layout>
  );
}
