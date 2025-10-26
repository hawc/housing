import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchData } from '@/lib/fetch';
import { SettingsProvider } from '@/lib/settingsContext';
import type { BaseSettlement } from '@/lib/types';

import { Box } from '@/components/common/Box';
import {
  Breadcrumb,
  Breadcrumbs,
} from '@/components/common/breadcrumbs/Breadcrumbs';
import { Layout } from '@/components/layout/Layout';
import { Settlement } from '@/components/settlements/View';
import { formatDate } from '@/utils/formatDate';

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params;
  const settlement = await getSettlement(params.slug);

  if (!settlement) {
    notFound();
  }

  const images = settlement.resources.filter(
    (resource) => resource.resourceType.name === 'Foto',
  );

  return {
    title: settlement.name,
    description: `Die Großwohnsiedlung ${settlement.name} in ${
      settlement.location?.city ?? 'Deutschland'
    } | Archiv deutscher Großwohnsiedlungen nach 1945.`,
    openGraph: {
      type: 'website',
      description: `Die Großwohnsiedlung ${settlement.name} in ${
        settlement.location?.city ?? 'Deutschland'
      } | Archiv deutscher Großwohnsiedlungen nach 1945.`,
      images: images.map((image) => ({ url: image.url })),
    },
  };
}

export async function generateStaticParams() {
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>(
    '/api/settlements/get/all',
    [],
  );

  const slugs = settlements.map((settlement) => ({ slug: settlement.slug }));

  return slugs;
}

async function getSettlement(slug: string) {
  const settlement = await fetchData<BaseSettlement>(
    `/api/settlements/get/${slug}`,
  );

  return settlement;
}

export default async function SettlementPage(props) {
  const params = await props.params;
  const settlement = await getSettlement(params.slug);

  if (!settlement) {
    notFound();
  }

  return (
    <SettingsProvider>
      <Layout
        breadcrumbs={
          <Breadcrumbs>
            <Breadcrumb href='/'>Startseite</Breadcrumb>
            <Breadcrumb href='/siedlungen'>Siedlungen</Breadcrumb>
            <Breadcrumb>{settlement.name}</Breadcrumb>
          </Breadcrumbs>
        }
      >
        <section>
          <Settlement settlement={settlement} />
        </section>
        <section>
          <Box ghost>
            <div className='text-center mt-2 mb-6'>
              <span className='block sm:inline'>
                Eintrag erstellt: {formatDate(settlement.createdAt)}
              </span>
              <span className='hidden sm:inline'> • </span>
              <span className='block sm:inline'>
                aktualisiert:{' '}
                {formatDate(settlement.updatedAt || settlement.createdAt)}
              </span>
            </div>
          </Box>
        </section>
      </Layout>
    </SettingsProvider>
  );
}
