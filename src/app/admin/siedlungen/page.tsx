
import { fetchData } from '@/lib/fetch';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListSettlements } from '@/components/admin/settlements/List';
import Layout from '@/components/layout/Layout';

import { BaseSettlement } from '@/app/admin/page';

async function getSettlements() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', []);

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
