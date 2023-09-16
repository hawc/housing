import { fetchData } from '@/lib/fetch';

import { ListArchitects } from '@/components/admin/architects/List';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import Layout from '@/components/layout/Layout';

import { BaseArchitect } from '@/app/admin/page';

async function getArchitects() {
  const architects = await fetchData<BaseArchitect[], BaseArchitect[]>('/api/architects/get/all', []);

  return architects;
}

export default async function Architects() {
  const architects = await getArchitects();

  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ListArchitects architectsInput={architects} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
