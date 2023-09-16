import { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';

import { ListArchitects } from '@/components/architects/List';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';

export const metadata: Metadata = {
  title: 'Architekten',
}

async function getArchitects() {
  const architects = await fetchData<BaseArchitect[], BaseArchitect[]>('/api/architects/get/all', []);

  return architects;
}

export default async function Architects() {
  const architects = await getArchitects();

  return (
    <Layout>
      <section>
        <ListArchitects architects={architects} />
      </section>
    </Layout>
  );
}
