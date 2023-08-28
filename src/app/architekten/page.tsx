import { Metadata } from 'next';

import { ListArchitects } from '@/components/architects/List';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';

export const metadata: Metadata = {
  title: 'Architekten',
}

async function getArchitects() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/all`);
  const architects: BaseArchitect[] = await response.json();

  return architects;
}

export default async function Architects() {
  const architects = await getArchitects();

  return (
    <Layout>
      <section>
        <ListArchitects architectsInput={architects} />
      </section>
    </Layout>
  );
}
