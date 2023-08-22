import { findArchitects } from '@/lib/db';

import { ListArchitects } from '@/components/architects/List';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { BaseArchitect } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/route';

async function getArchitects() {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);

  return architects;
}

export default async function Architects() {
  const architects = await getArchitects();

  return (
    <Layout>
      <Seo templateTitle='Architekten' />
      <section>
        <ListArchitects architectsInput={architects} />
      </section>
    </Layout>
  );
}
