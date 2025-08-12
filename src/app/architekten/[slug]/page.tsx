import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchData } from '@/lib/fetch';
import type { BaseArchitect } from '@/lib/types';

import { Architect } from '@/components/architects/View';
import { Box } from '@/components/common/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/common/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';
import { formatDate } from '@/utils/formatDate';

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params;
  const architect = await getArchitect(params.slug);

  if (!architect) {
    notFound();
  }

  return {
    title: `${architect.name} | Architekt*innen`,
    description: `Architekt*in deutscher Großwohnsiedlungen: ${architect.name} | Archiv deutscher Großwohnsiedlungen nach 1945.`,
    openGraph: {
      type: 'website',
      description: `Architekt*in deutscher Großwohnsiedlungen: ${architect.name} | Archiv deutscher Großwohnsiedlungen nach 1945.`,
    }
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

export default async function ArchitectPage(props) {
  const params = await props.params;
  const architect = await getArchitect(params.slug);

  if (!architect) {
    notFound();
  }

  return (
    <Layout breadcrumbs={
      <Breadcrumbs>
        <Breadcrumb href="/">Startseite</Breadcrumb>
        <Breadcrumb href="/architekten">Architekt*innen</Breadcrumb>
        <Breadcrumb>{architect.name}</Breadcrumb>
      </Breadcrumbs>
    }>
      <section>
        <Architect architect={architect} />
      </section>
      <section>
        <Box ghost>
          <div className='text-center mt-2 mb-6'>
            <span className='block sm:inline'>Eintrag erstellt: {formatDate(architect.createdAt)}</span>
            <span className='hidden sm:inline'> • </span>
            <span className='block sm:inline'>aktualisiert: {formatDate(architect.updatedAt || architect.createdAt)}</span>
          </div>
        </Box>
      </section>
    </Layout>
  );
}
