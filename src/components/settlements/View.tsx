import { CopyrightIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

import type { Architect, BaseSettlement, Settlement, Tag } from '@/lib/types';
import { sortAlphabetically } from '@/lib/utils';

import { Box, Container } from '@/components/blocks/Box';
import CesiumWrapper from '@/components/blocks/CesiumWrapper';
import { ContactLink } from '@/components/blocks/ContactLink';
import { DetailsList } from '@/components/blocks/DetailsList';
import { Link as LinkElement } from '@/components/blocks/Link';
import { TagList } from '@/components/blocks/Tags';
import { Timeline } from '@/components/blocks/Timeline';
import { Headline } from '@/components/Headline';

const isPhoto = (resource) => resource.resourceType.name === 'Foto';
const isNotPhoto = (resource) => resource.resourceType.name !== 'Foto';

export function Settlement({ settlement }: { settlement: BaseSettlement }) {
  const Map = dynamic(() => import('@/components/admin/settlements/Map'), {
    ssr: false
  });

  const photoResources = settlement?.resources?.filter(isPhoto);
  const otherResources = settlement?.resources?.filter(isNotPhoto);

  return (
    <>
      <Box ghost>
        <div className='md:flex mt-6'>
          <Headline type='h1' className='inline-block'>{settlement.name}</Headline>
          <div className='md:flex md:items-start'>
            {/* {settlement.tags.length > 0 && (
              <TagList className='ml-2' tags={settlement.tags} />
            )} */}
            {settlement.location?.city && (<TagList className='mb-3 md:ml-2' tags={[{ name: settlement.location.city }] as Tag[]} />)}
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
            {settlement.events.length > 0 && (
              <Box>
                <Headline className='inline-block' type='h2'>Historie</Headline>
                <Timeline
                  events={settlement.events} />
              </Box>
            )}
            {settlement.details.length > 0 && (
              <Box>
                <Headline className='inline-block' type='h2'>Details</Headline>
                <DetailsList details={settlement.details} />
              </Box>
            )}
          </Container>
        )}
        {settlement.architects.length > 0 && (
          <Container>
            <Box>
              <Headline className='inline-block' type='h2'>
                {settlement.architects.length > 1 ? 'Architekt*innen' : 'Architekt*in'}
              </Headline>
              <div className={settlement.architects.length > 3 ? 'md:columns-2' : 'md:columns-1'}>
                {sortAlphabetically(settlement.architects).map((architect: Architect) => (
                  <div key={architect.id}>
                    <LinkElement href={`/architekten/${architect.slug}`}>{architect.name}</LinkElement>{architect.role ? ` (${architect.role})` : ''}
                  </div>
                ))}
              </div>
            </Box>
          </Container>
        )}
        {otherResources?.length > 0 && (
          <Container className='grid-cols-1 lg:grid-cols-2'>
            <Box className='py-3'>
              <Headline className='inline-block' type='h2'>
                Weiterführende Links
              </Headline>
              {otherResources.map((resource) => (
                <div key={resource.id}>
                  {resource.url && (
                    <div>
                      <LinkElement href={resource.url} title={resource.url} className='break-all'>
                        {resource.name}
                      </LinkElement>
                    </div>
                  )}
                  {resource.description && (
                    <p className={!resource.source ? 'mb-2' : ''}>
                      {resource.description}
                    </p>
                  )}
                  {resource.source && (
                    <div className='mb-2'>Quelle: {resource.source}</div>
                  )}
                </div>
              ))}
            </Box>
          </Container>
        )}
        {photoResources?.length > 0 && (
          <Container className='md:grid-cols-2'>
            {photoResources.map((resource) => (
              <Box key={resource.id} className='p-0 md:p-0 justify-between'>
                <div>
                  <div className='flex items-center overflow-hidden bg-grey-light'>
                    <img src={resource.url} alt={resource.description} loading='lazy' className='min-w-full' />
                  </div>
                </div>
                <div className='px-3 py-2 md:px-5 md:py-4'>
                  <div>
                    <Headline type='h6'>{resource.name}</Headline>
                    {resource.description}
                  </div>
                  {resource.source && (
                    <div className='pt-2'>
                      Quelle: <LinkElement className='inline-block' href={resource.source} />
                    </div>
                  )}
                  <div className='pt-2'>
                    {resource.license && resource.copyright && (
                      <><CopyrightIcon className='inline-block mb-1' size={17} /> {resource.copyright}, {resource.license}</>
                    ) || resource.license && (
                      <>{resource.license}</>
                    ) || resource.copyright && (
                      <>© {resource.copyright}</>
                    )}
                  </div>
                </div>
              </Box>
            ))}
          </Container>
        )}
        {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
          <Container>
            <Box className='p-0 md:p-0'>
              {/* <Map
                markers={[settlement.location]}
                center={{ lat: settlement.location.lat, lng: settlement.location.lng }} /> */}
              <CesiumWrapper positions={[{ lat: settlement.location.lat, lng: settlement.location.lng }]} />
            </Box>
          </Container>
        )}
        <Container>
          <ContactLink />
        </Container>
      </Container>
    </>
  );
}