import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Layout from '@/components/layout/Layout';
import { Settlement } from '@/components/settlements/View';

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
  const settlement: BaseSettlement | undefined = response ? await response.json() : undefined;

  return settlement;
}

export default async function SettlementPage({ params }) {
  const settlement = await getSettlement(params.slug);

  if (!settlement) {
    notFound();
  }

  return (
    <Layout>
      <section>
        <Settlement settlement={settlement} />
      </section>
    </Layout>
  );
}
