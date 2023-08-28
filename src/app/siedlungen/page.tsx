import { Metadata } from 'next';

import Layout from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

import { BaseLocation, BaseSettlement } from '@/app/admin/page';

export const metadata: Metadata = {
  title: 'Siedlungen',
}

async function getSettlements() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/settlements/get/all`);
  const settlements: BaseSettlement[] = await response.json();

  return settlements;
}

async function getLocations() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/locations/get/all`);
  const locations: BaseLocation[] = await response.json();

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
