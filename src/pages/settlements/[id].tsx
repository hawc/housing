
import { InferGetStaticPropsType } from 'next';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import Layout from '@/components/layout/Layout';
import { Settlement } from '@/components/settlements/View';

import type { Settlement as SettlementType } from '@/pages/admin';


export async function getStaticPaths() {
  const settlements: SettlementType[] = await callAPI({ type: 'getSettlements' });
  return {
    paths: settlements ? settlements.map(settlement => (
      {
        params: { id: settlement.id }
      }
    )) : [],
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { id: string } }): Promise<{ props: { settlement: SettlementType } }> {
  const settlement: SettlementType = await callAPI({ type: 'getSettlement', payload: { id: params.id } });

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
        <Box ghost className='mb-2'>
          <Link href='/settlements' arrow back>zurück zur Übersicht</Link>
        </Box>
        <Settlement settlement={settlement} />
      </section>
    </Layout>
  );
}