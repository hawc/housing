import { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';

import { ArchitectEdit } from '@/components/admin/architects/Edit';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

import type { BaseArchitect } from '@/app/admin/page';

export async function generateMetadata(
  { params },
): Promise<Metadata> {
  const architect = await getArchitect(params.slug);

  return {
    title: architect?.name,
  };
}

export async function generateStaticParams() {
  const architects = await fetchData<BaseArchitect[], BaseArchitect[]>('/api/architects/get/all', []);

  const slugs = architects.map(architect => (
    { slug: architect.slug }
  ));

  return slugs;
}

async function getArchitect(slug: string) {
  const architect = await fetchData<BaseArchitect>(`/api/architects/get/${slug}`);

  return architect;
}

export default async function ArchitectPage({ params }) {
  const architect = await getArchitect(params.slug);

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb href="/admin/architekten">Architekten</Breadcrumb>
        <Breadcrumb>{architect?.name ?? 'Neu'}</Breadcrumb>
      </Breadcrumbs>
    }>
      <LoginPageFrame>
        <section>
          <ArchitectEdit architectInput={architect} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
