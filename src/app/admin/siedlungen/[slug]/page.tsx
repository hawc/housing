
import { findSettlement, findSettlements } from '@/lib/db';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { SettlementEdit } from '@/components/admin/settlements/Edit';
import Layout from '@/components/layout/Layout';

import type { BaseSettlement } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

export async function generateStaticParams() {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);

  return settlements ? settlements.map(settlement => (
    { slug: settlement.slug }
  )) : [];
}

async function getSettlement(slug) {
  const response = await findSettlement({ where: { slug: slug } });
  const settlement = response ? baseTransformers.settlement(response) : null;

  return settlement;
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
