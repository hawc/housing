
import { InferGetStaticPropsType } from 'next';

import { findSettlement, findSettlements } from '@/lib/db';

import { SettlementEdit } from '@/components/admin/settlements/Edit';
import { Box, Container } from '@/components/blocks/Box';
import { Link } from '@/components/blocks/Link';
import Layout from '@/components/layout/Layout';

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

export async function getStaticProps({ params }: { params: { slug: string } }): Promise<{ props: { settlement: BaseSettlement }, revalidate: number }> {
  const settlement: BaseSettlement = baseTransformers.settlement(await findSettlement({ where: { slug: params.slug } }));

  return {
    props: {
      settlement,
    },
    revalidate: 10,
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
