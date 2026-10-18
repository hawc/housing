import type { Metadata } from 'next';

import { getUpdates } from './utils/getUpdates';
import { Box } from '@/components/common/Box';
import {
  Breadcrumb,
  Breadcrumbs,
} from '@/components/common/breadcrumbs/Breadcrumbs';
import { Link } from '@/components/common/Link';
import { Headline } from '@/components/Headline';
import { Layout } from '@/components/layout/Layout';

// Resolve current publication state for every request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Updates',
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('de-DE', {
    timeZone: 'Europe/Berlin',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function Updates() {
  const sortedUpdates = await getUpdates();

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
            {sortedUpdates.length === 0 && <p>Keine Updates vorhanden.</p>}
            {sortedUpdates.map(([date, update]) => (
              <div key={date}>
                <Headline type='h2'>{formatDate(date)}</Headline>
                {update.map((update) => (
                  <div
                    key={`${update.type}:${update.id}`}
                    className='flex sm:flex-row sm:flex-wrap flex-col sm:gap-2 leading-relaxed mt-4 sm:mt-0'
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
                        ? 'aktualisiert'
                        : 'neu hinzugefügt'}
                      {update.sections.length > 0 &&
                        ` · ${update.sections.join(', ')}`}
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
