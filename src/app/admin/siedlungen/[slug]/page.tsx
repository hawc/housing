
import { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { SettlementEdit } from '@/components/admin/settlements/Edit';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

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
  const settlement = await fetchData<BaseSettlement>(`/api/settlements/get/${slug}`, undefined, {
    cache: 'no-cache'
  });

  return settlement;
}

export default async function SettlementPage({ params }) {
  const settlement = await getSettlement(params.slug);

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
