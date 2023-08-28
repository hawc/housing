
import { Metadata } from 'next';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { SettlementEdit } from '@/components/admin/settlements/Edit';
import Layout from '@/components/layout/Layout';

import type { BaseSettlement } from '@/app/admin/page';

export async function generateMetadata(
  { params },
): Promise<Metadata> {
  const settlement = await getSettlement(params.slug)

  return {
    title: settlement?.name,
  }
}

export async function generateStaticParams() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/settlements/get/all`);
  const settlements: BaseSettlement[] = await response.json();

  const slugs = settlements.map(settlement => (
    { slug: settlement.slug }
  ));

  return slugs;
}

async function getSettlement(slug: string) {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/settlements/get/${slug}`);
  const settlement: BaseSettlement = await response.json();

  return settlement || '';
}

export default async function SettlementPage({ params }) {
  const settlement = await getSettlement(params.slug);

  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <SettlementEdit settlementInput={settlement || undefined} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
