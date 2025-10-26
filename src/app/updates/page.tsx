import type { Metadata } from 'next';

import { fetchData } from '@/lib/fetch';
import { BaseArchitect, BaseSettlement } from '@/lib/types';

import { groupUpdatesByDate } from '@/app/updates/utils/groupUpdatesByDate';
import { mergeAndSortUpdates } from '@/app/updates/utils/mergeAndSortUpdates';
import { Box } from '@/components/common/Box';
import {
  Breadcrumb,
  Breadcrumbs,
} from '@/components/common/breadcrumbs/Breadcrumbs';
import { Link } from '@/components/common/Link';
import { Headline } from '@/components/Headline';
import { Layout } from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'Updates',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('de-DE', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function Updates() {
  const architects = await fetchData<BaseArchitect[], BaseArchitect[]>(
    '/api/architects/get/all',
    [],
  );
  const settlements = await fetchData<BaseSettlement[], BaseSettlement[]>(
    '/api/settlements/get/all',
    [],
  );

  const architectUpdates = groupUpdatesByDate(architects, 'architect');
  const settlementUpdates = groupUpdatesByDate(settlements, 'settlement');

  const sortedUpdates = mergeAndSortUpdates(
    settlementUpdates,
    architectUpdates,
  );

  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb href='/'>Startseite</Breadcrumb>
          <Breadcrumb>Updates</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <section>
        <Box ghost>
          <div className='flex mt-6'>
            <Headline type='h1'>Updates</Headline>
          </div>
        </Box>
        <Box ghost>
          <p className='mb-4'>
            Hier findest du in chronologischer Reihenfolge alle jüngsten
            Änderungen im Archiv, von neu hinzugefügten Siedlungen und
            Architekt*innen über aktualisierte Daten bis zu ergänzten Quellen.
            So behältst du bequem im Blick, was sich wann auf unseren
            Unterseiten getan hat.
          </p>
        </Box>
        <Box>
          <div className='flex flex-col gap-6'>
            {sortedUpdates.map(([date, update]) => (
              <div key={date}>
                <Headline type='h2'>{formatDate(date)}</Headline>
                {update.map((update) => (
                  <div
                    key={update.slug}
                    className='flex sm:flex-row flex-col sm:gap-2 leading-relaxed mt-4 sm:mt-0'
                  >
                    <Link
                      href={
                        update.type === 'architect'
                          ? `/architekten/${update.slug}`
                          : `/siedlungen/${update.slug}`
                      }
                    >
                      {update.name}
                    </Link>
                    <span className='sr-only'>,</span>
                    {'location' in update && (
                      <>
                        <span className='font-thin tracking-wide'>
                          {update.location?.city}
                        </span>
                        <span className='sr-only'>, </span>
                      </>
                    )}
                    <span className='text-gray-500 font-thin tracking-wide'>
                      (
                      {update.changeType === 'updated'
                        ? 'zuletzt aktualisiert'
                        : 'neu hinzugefügt'}
                      )
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Box>
      </section>
    </Layout>
  );
}
