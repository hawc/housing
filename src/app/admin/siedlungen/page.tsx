
import { fetchData } from '@/lib/fetch';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListSettlements } from '@/components/admin/settlements/List';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

import { BaseSettlement } from '@/lib/types';

async function getSettlements() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', [], {
    cache: 'no-cache'
  });

  return settlements;
}

export default async function Settlements() {
  const settlements = await getSettlements();

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb>Siedlungen</Breadcrumb>
      </Breadcrumbs>
    }>
      <LoginPageFrame>
        <section>
          <ListSettlements settlementsInput={settlements} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
