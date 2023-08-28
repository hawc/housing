
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListSettlements } from '@/components/admin/settlements/List';
import Layout from '@/components/layout/Layout';

import { BaseSettlement } from '@/app/admin/page';

async function getSettlements() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/settlements/get/all`);
  const settlements: BaseSettlement[] = await response.json();

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
