import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchData } from '@/lib/fetch';
import type { BaseArchitect } from '@/lib/types';

import { Architect } from '@/components/architects/View';
import { Box } from '@/components/blocks/Box';
import { Breadcrumb, Breadcrumbs } from '@/components/blocks/breadcrumbs/Breadcrumbs';
import Layout from '@/components/layout/Layout';

export async function generateMetadata(
  { params },
): Promise<Metadata> {
  const architect = await getArchitect(params.slug);

  if (!architect) {
    notFound();
  }

  const tags = ['Architekt', 'Plattenbau', 'Großwohnsiedlungen'];

  if (!tags.includes(architect.name)) {
    tags.push(architect.name);
  }

  return {
    title: `${architect.name} | Architekt*innen`,
    description: `Architekt*in deutscher Großwohnsiedlungen: ${architect.name} | Archiv deutscher Großwohnsiedlungen nach 1945.`,
    openGraph: {
      type: 'article',
      description: `Architekt*in deutscher Großwohnsiedlungen: ${architect.name} | Archiv deutscher Großwohnsiedlungen nach 1945.`,
      publishedTime: architect.createdAt,
      modifiedTime: architect.updatedAt,
      tags,
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

export default async function ArchitectPage({ params }) {
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
            <span className='block sm:inline'>Eintrag erstellt: {architect.createdAt}</span>
            <span className='hidden sm:inline'> • </span>
            <span className='block sm:inline'>aktualisiert: {architect.updatedAt || architect.createdAt}</span>
          </div>
        </Box>
      </section>
    </Layout>
  );
}
