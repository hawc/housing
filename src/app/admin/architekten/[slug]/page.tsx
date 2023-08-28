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

async function getArchitect(slug: string) {
  const response = await fetch(`${process.env.BASE_URL ?? ''}/api/architects/get/${slug}`);
  const architect: BaseArchitect = await response.json();

  return architect || undefined;
}

export default async function ArchitectPage({ params }) {
  const architect = await getArchitect(params.slug);

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
