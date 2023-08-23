import { Metadata } from 'next';

import { findArchitects } from '@/lib/db';

import { ListArchitects } from '@/components/architects/List';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

export const metadata: Metadata = {
  title: 'Architekten',
}

async function getArchitects() {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);

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
