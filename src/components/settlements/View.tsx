import { ArrowLeftIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { sortAlphabetically } from '@/lib/utils';

import { Box, Container } from '@/components/blocks/Box';
import { DetailsList } from '@/components/blocks/DetailsList';
import { Link as LinkElement } from '@/components/blocks/Link';
import { TagList } from '@/components/blocks/Tags';
import { Timeline } from '@/components/blocks/Timeline';
import { Headline } from '@/components/Headline';

import type { Architect, BaseSettlement, Settlement } from '@/app/admin/page';

export function Settlement({ settlement }: { settlement: BaseSettlement }) {
  const Map = dynamic(() => import('@/components/admin/settlements/Map'), {
    ssr: false
  });

  const photoResources = settlement?.resources?.filter(resource => resource.resourceType.name === 'Foto');
  const otherResources = settlement?.resources?.filter(resource => resource.resourceType.name !== 'Foto');

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='inline-block'>{settlement.name}</Headline>
          <div className='flex items-start'>
            {settlement.tags.length > 0 && (
              <TagList className='ml-2' tags={settlement.tags} />
            )}
            <Link className='block ml-2 p-2 rounded-full bg-highlight' href='/siedlungen'>
              <ArrowLeftIcon className='align-text-bottom' size={15} />
            </Link>
          </div>
        </div>
      </Box>
      <Container>
        {settlement.description && (
          <Container>
            <Box>
              <div dangerouslySetInnerHTML={{ __html: settlement.description }}></div>
            </Box>
          </Container>
        )}
        {(settlement.events.length > 0 || settlement.details.length > 0) && (
          <Container className='grid-cols-1 md:grid-cols-2'>
            <>
              {settlement.events.length > 0 && (
                <Box>
                  <Headline className='inline-block' tag='h2' type='h3'>Historie</Headline>
                  <Timeline
                    events={settlement.events} />
                </Box>
              )}
              {settlement.details.length > 0 && (
                <Box>
                  <Headline className='inline-block' tag='h2' type='h3'>Details</Headline>
                  <DetailsList details={settlement.details} />
                </Box>
              )}
            </>
          </Container>
        )}
        {settlement.architects.length > 0 && (
          <Container>
            <Box>
              <>
                <Headline className='inline-block' tag='h2' type='h3'>
                  {settlement.architects.length > 1 ? 'Architekten' : 'Architekt'}
                </Headline>
                {sortAlphabetically(settlement.architects).map((architect: Architect) => (
                  <div key={architect.id}>
                    {architect.description.length > 0 ? (
                      <LinkElement href={`/architekten/${architect.slug}`} arrow>{architect.name}</LinkElement>
                    ) : (
                      <>{architect.name}</>
                    )}
                  </div>
                ))}
              </>
            </Box>
          </Container>
        )}
        {otherResources?.length > 0 && (
          <Container>
            <>
              {otherResources.map((resource) => (
                <Box key={resource.id} className='py-3'>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    {resource.name}
                  </Headline>
                  <div>
                    {resource.description}
                  </div>
                  {resource.url && (
                    <LinkElement href={resource.url}>
                      {resource.url}
                    </LinkElement>
                  )}
                  {resource.source && (
                    <>Quelle: {resource.source}</>
                  )}
                </Box>
              ))}
            </>
          </Container>
        )}
        {photoResources?.length > 0 && (
          <Container className='md:grid-cols-2'>
            <>
              {photoResources.map((resource) => (
                <Box key={resource.id} className='py-3 md:p-0 h-60 lg:h-96 justify-between'>
                  <div className='grow flex mb-1 md:mb-0 items-center overflow-hidden bg-grey-light'>
                    <img src={resource.url} alt={resource.description} loading='lazy' className='min-w-full' />
                  </div>
                  <div className='md:px-5 pt-2 md:pt-4 md:pb-4'>
                    {resource.name}{(resource.name && resource.description ? ', ' : '')}{resource.description}
                  </div>
                  {resource.source && (
                    <div className='md:px-5 pt-2 md:pt-0 md:pb-4'>
                      Quelle: {resource.source}
                    </div>
                  )}
                  {resource.copyright && (
                    <div className='md:px-5 pt-2 md:pt-0 md:pb-4'>
                      © {resource.copyright}
                    </div>
                  )}
                  {resource.license && (
                    <div className='md:px-5 pt-2 md:pt-0 md:pb-4'>
                      Lizenz: {resource.license}
                    </div>
                  )}
                </Box>
              ))}
            </>
          </Container>
        )}
        <>
          {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
            <Container>
              <Box className='p-0 md:p-0'>
                <Map
                  markers={[settlement.location]}
                  center={{ lat: settlement.location.lat, lng: settlement.location.lng }} />
              </Box>
            </Container>
          )}
        </>
      </Container>
    </>
  );
}