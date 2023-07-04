
import { InferGetStaticPropsType } from 'next';

import { callAPI } from '@/lib/api';

import { SettlementEdit } from '@/components/admin/settlements/Edit';
import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import Layout from '@/components/layout/Layout';

import type { Settlement as SettlementType } from '@/pages/admin';


export async function getStaticPaths() {
  const settlements: SettlementType[] = await callAPI({ type: 'getSettlements' });
  return {
    paths: settlements ? settlements.map(settlement => (
      {
        params: { slug: settlement.slug }
      }
    )) : [],
    fallback: true,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }): Promise<{ props: { settlement: SettlementType } }> {
  const settlement: SettlementType = await callAPI({ type: 'getSettlement', payload: { where: { slug: params.slug } } });

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
        <Container>
          <Box ghost className='mb-2'>
            <Link href='/admin/siedlungen' arrow back>zurück zur Übersicht</Link>
          </Box>
          {settlement && (
            <SettlementEdit settlementInput={settlement} />
          )}
        </Container>
      </section>
    </Layout>
  );
}
