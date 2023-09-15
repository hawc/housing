import { Metadata } from 'next';

import { ArchitectEdit } from '@/components/admin/architects/Edit';
import LoginPageFrame from '@/components/admin/LoginPageFrame';
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

export async function generateStaticParams() {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/all`);
  const architects: BaseArchitect[] = await response.json();

  const slugs = architects.map(architect => (
    { slug: architect.slug }
  ));

  return slugs;
}

async function getArchitect(slug: string) {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/${slug}`);
  const architect: BaseArchitect | undefined = response ? await response.json() : undefined;

  return architect;
}

export default async function ArchitectPage({ params }) {
  const architect = await getArchitect(params.slug);

  return (
    <Layout>
      <LoginPageFrame>
        <section>
          <ArchitectEdit architectInput={architect} />
        </section>
      </LoginPageFrame>
    </Layout>
  );
}
