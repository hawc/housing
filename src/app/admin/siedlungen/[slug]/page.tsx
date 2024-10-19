
import type { Metadata, ResolvingMetadata } from 'next';

import { fetchData } from '@/lib/fetch';
import type { BaseSettlement } from '@/lib/types';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { SettlementEdit } from '@/components/admin/settlements/Edit';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', []);

  const slugs = settlements.map(settlement => (
    { slug: settlement.slug }
  ));

  return slugs;
}

async function getSettlement(slug: string) {
  const settlement = await fetchData<BaseSettlement>(`/api/settlements/get/${slug}`, undefined, {
    cache: 'no-cache'
  });

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
        <Breadcrumb href="/admin/siedlungen">Siedlungen</Breadcrumb>
        <Breadcrumb>{settlement?.name ?? 'Neu'}</Breadcrumb>
      </Breadcrumbs>
    }>
      <LoginPageFrame>
        <section>
          <SettlementEdit settlementInput={settlement} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
