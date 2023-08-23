import { findSettlements } from '@/lib/db';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListSettlements } from '@/components/admin/settlements/List';
import Layout from '@/components/layout/Layout';

import { BaseSettlement } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/transformers';

async function getSettlements() {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);

  return settlements;
}

export default async function Settlements() {
  const settlements = await getSettlements();
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
