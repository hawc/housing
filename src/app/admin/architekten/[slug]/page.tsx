import { Metadata } from 'next';

import { findArchitect, findArchitects } from '@/lib/db';

import { ArchitectEdit } from '@/components/admin/architects/Edit';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
import Layout from '@/components/layout/Layout';

import type { BaseArchitect } from '@/app/admin/page';
import { baseTransformers } from '@/app/api/db/transformers';

export async function generateMetadata(
  { params },
): Promise<Metadata> {
  const architect = await getArchitect(params.slug)

  return {
    title: architect?.name,
  }
}

export async function generateStaticParams() {
  const architects: BaseArchitect[] = (await findArchitects()).map(baseTransformers.architect);
  return architects ? architects.map(architect => (
    { slug: architect.slug }
  )) : [];
}

async function getArchitect(slug: string) {
  const response = await findArchitect({ where: { slug: slug } });
  const architect = response ? baseTransformers.architect(response) : null;

  return architect;
}

export default async function ArchitectPage({ params }) {
  const architect = await getArchitect(params.slug)
  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ArchitectEdit architectInput={architect || undefined} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}