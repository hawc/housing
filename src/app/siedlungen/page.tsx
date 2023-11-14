import { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';

import Layout from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

import { BaseLocation, BaseSettlement } from '@/app/admin/page';

export const metadata: Metadata = {
  title: 'Siedlungen',
};

async function getSettlements() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>('/api/settlements/get/all', []);

  return settlements;
}

async function getLocations() {
  const locations = await fetchData<BaseLocation[], BaseLocation[]>('/api/locations/get/all', []);

  return locations;
}

export default async function Settlements() {
  const settlements = await getSettlements();
  const locations = await getLocations();
  return (
    <Layout>
      <section>
        <ListSettlements settlements={settlements} locations={locations} />
      </section>
    </Layout>
  );
}
