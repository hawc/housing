import { findSettlements } from '@/lib/db';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListSettlements } from '@/components/admin/settlements/List';
import Layout from '@/components/layout/Layout';

import { BaseSettlement } from '@/pages/admin';
import { baseTransformers } from '@/pages/api/db';

export async function getStaticProps(): Promise<{ props: { settlements: BaseSettlement[] }, revalidate: number }> {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);

  return {
    props: {
      settlements,
    },
    revalidate: 10,
  };
}

export default function Settlements({ settlements }: { settlements: BaseSettlement[] }) {
  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ListSettlements settlementsInput={settlements} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
