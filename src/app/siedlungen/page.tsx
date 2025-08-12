import type { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';
import type { BaseLocation, BaseSettlement } from '@/lib/types';

import { Container } from '@/components/common/Box';
import {
  Breadcrumb,
  Breadcrumbs,
} from '@/components/common/breadcrumbs/Breadcrumbs';
import { ContactLink } from '@/components/common/ContactLink';
import { Layout } from '@/components/layout/Layout';
import { ListSettlements } from '@/components/settlements/List';

export const metadata: Metadata = {
  title: 'Siedlungen',
};

async function getSettlements() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>(
    '/api/settlements/get/all',
    []
  );

  return settlements;
}

async function getLocations() {
  const locations = await fetchData<BaseLocation[], BaseLocation[]>(
    '/api/locations/get/all',
    []
  );

  return locations;
}

export default async function Settlements() {
  const settlements = await getSettlements();
  const locations = await getLocations();

  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb href='/'>Startseite</Breadcrumb>
          <Breadcrumb>Siedlungen</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <section>
        <ListSettlements settlements={settlements} locations={locations} />
      </section>
      <Container>
        <ContactLink />
      </Container>
    </Layout>
  );
}
