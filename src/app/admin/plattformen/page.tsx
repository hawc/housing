import { fetchData } from '@/lib/fetch';

import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { ListPlatforms } from '@/components/admin/platforms/List';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

import type { Platform } from '@/app/admin/page';

async function getPlatforms() {
  const platforms = await fetchData<Platform[], Platform[]>('/api/platforms/get/all', [], {
    cache: 'no-cache'
  });

  return platforms;
}

export default async function Platforms() {
  const platforms = await getPlatforms();

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb>Plattformen</Breadcrumb>
      </Breadcrumbs>
    }>
      <LoginPageFrame>
        <section>
          <ListPlatforms platformsInput={platforms} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}