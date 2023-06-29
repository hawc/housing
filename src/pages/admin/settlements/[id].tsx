
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';

import { callAPI } from '@/lib/api';

import { Settlement } from '@/components/admin/settlements/view';
import Layout from '@/components/layout/Layout';

import type { Settlement as SettlementType } from '@/pages/admin';


export async function getStaticPaths() {
  const settlements: SettlementType[] = await callAPI({ type: 'getSettlements' });
  return {
    paths: settlements.map(settlement => (
      {
        params: { id: settlement.id }
      }
    )),
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
      <Link className='inline-block py-4' href='/admin/settlements'>back to overview</Link>
      <Settlement settlement={settlement} />
    </Layout>
  );
}
