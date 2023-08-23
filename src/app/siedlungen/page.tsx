
import { Metadata } from 'next';

import { findLocations, findSettlements } from '@/lib/db';

import Layout from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

import { BaseLocation, BaseSettlement } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

export const metadata: Metadata = {
  title: 'Siedlungen',
}

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
      <section>
        <ListSettlements settlementsInput={settlements} locationsInput={locations} />
      </section>
    </Layout>
  );
}
