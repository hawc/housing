

import { findSettlement, findSettlements } from '@/lib/db';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { Settlement } from '@/components/settlements/View';

import type { BaseSettlement } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

export async function generateStaticParams() {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);

  return settlements ? settlements.map(settlement => (
    { slug: settlement.slug }
  )) : [];
}

async function getSettlement(slug: string) {
  const response = await findSettlement({ where: { slug: slug } });
  const settlement = response ? baseTransformers.settlement(response) : null;

  return settlement;
}

export default async function SettlementPage({ params }) {
  const settlement = await getSettlement(params.slug);

  return (
    <Layout>
      <Seo templateTitle={settlement?.name} />
      <section>
        {settlement && (
          <Settlement settlement={settlement} />
        )}
      </section>
    </Layout>
  );
}
