import { fetchData } from '@/lib/fetch';
import type { BaseArchitect } from '@/lib/types';

import { ListArchitects } from '@/components/admin/architects/List';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { Breadcrumb, Breadcrumbs } from '@/components/common/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

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
      <LoginPageFrame>
        <section>
          <ListArchitects architectsInput={architects} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
