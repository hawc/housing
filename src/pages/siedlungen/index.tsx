
import { findSettlements } from '@/lib/db';

import { Container } from '@/components/blocks/Box';
import Layout from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

import { BaseSettlement } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticProps(): Promise<{ props: { settlements: BaseSettlement[] } }> {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);

  return {
    props: {
      settlements,
    },
  };
}

export default function Settlements({ settlements }: { settlements: BaseSettlement[] }) {
  return (
    <Layout>
      <section>
        <Container>
          <ListSettlements settlementsInput={settlements} />
        </Container>
      </section>
    </Layout>
  );
}
