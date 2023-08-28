import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Architect } from '@/components/architects/View';
import Layout from '@/components/layout/Layout';

import type { BaseArchitect } from '@/app/admin/page';

export async function generateMetadata(
  { params },
): Promise<Metadata> {
  const architect = await getArchitect(params.slug)

  return {
    title: architect?.name,
  }
}

async function getArchitect(slug: string) {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/${slug}`);
  const architect: BaseArchitect = await response.json();

  return architect;
}

export default async function ArchitectPage({ params }) {
  const architect = await getArchitect(params.slug);

  if (!architect) {
    notFound();
  }

  return (
    <Layout>
      <section>
        <Architect architect={architect} />
      </section>
    </Layout>
  );
}
