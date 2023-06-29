
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';

import { callAPI } from '@/lib/api';

import Layout from '@/components/layout/Layout';

import { Settlement } from '@/pages/admin';


export async function getStaticPaths() {
  const settlements: Settlement[] = await callAPI({ type: 'getSettlements' });
  return {
    paths: settlements.map(settlement => (
      {
        params: { id: settlement.id }
      }
    )),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { id: string } }): Promise<{ props: { settlement: Settlement } }> {
  const settlement: Settlement = await callAPI({ type: 'getSettlement', payload: { id: params.id } });

  return {
    props: {
      settlement,
    },
  };
}

export default function Settlement({ settlement }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Link href='/admin/settlements'>back to overview</Link>
      <div>
        {settlement.title}
      </div>
    </Layout>
  );
}
