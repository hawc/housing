
import { InferGetStaticPropsType } from 'next';

import { findSettlement, findSettlements } from '@/lib/db';

import Layout from '@/components/layout/Layout';
import { Settlement } from '@/components/settlements/View';

import type { BaseSettlement } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticPaths() {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);
  return {
    paths: settlements ? settlements.map(settlement => (
      {
        params: { slug: settlement.slug }
      }
    )) : [],
    fallback: true,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }): Promise<{ props: { settlement: BaseSettlement } }> {
  const settlement: BaseSettlement = baseTransformers.settlement(await findSettlement({ where: { slug: params.slug } }));

  return {
    props: {
      settlement,
    },
  };
}

export default function SettlementPage({ settlement }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <section>
        {settlement && (
          <Settlement settlement={settlement} />
        )}
      </section>
    </Layout>
  );
}
