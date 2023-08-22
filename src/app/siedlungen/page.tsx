
import { findLocations, findSettlements } from '@/lib/db';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { ListSettlements } from '@/components/settlements/List';

import { BaseLocation, BaseSettlement } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

async function getSettlements() {
  const settlements: BaseSettlement[] = (await findSettlements()).map(baseTransformers.settlement);

  return settlements;
}

async function getLocations() {
  const locations: BaseLocation[] = (await findLocations()).map(baseTransformers.location);

  return locations;
}

export default async function Settlements() {
  const settlements = await getSettlements();
  const locations = await getLocations();
  return (
    <Layout>
      <Seo templateTitle='Siedlungen' />
      <section>
        <ListSettlements settlementsInput={settlements} locationsInput={locations} />
      </section>
    </Layout>
  );
}
