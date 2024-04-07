import { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';

import { ListArchitects } from '@/components/architects/List';
import { Container } from '@/components/blocks/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import { ContactLink } from '@/components/blocks/ContactLink';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';

export const metadata: Metadata = {
  title: 'Architekt*innen',
};

async function getArchitects() {
  const architects = await fetchData<BaseArchitect[], BaseArchitect[]>('/api/architects/get/all', []);

  return architects;
}

export default async function Architects() {
  const architects = await getArchitects();

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb>Architekt*innen</Breadcrumb>
      </Breadcrumbs>
    }>
      <section>
        <ListArchitects architects={architects} />
      </section>
      <Container>
        <ContactLink />
      </Container>
    </Layout>
  );
}
