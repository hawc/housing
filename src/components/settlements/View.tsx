'use client';

import { CopyrightIcon } from 'lucide-react';

import type { Architect, BaseSettlement } from '@/lib/types';
import { LOCALE, sortAlphabetically } from '@/lib/utils';

import { Box, Container } from '@/components/blocks/Box';
import { ContactLink } from '@/components/blocks/ContactLink';
import { DetailsList } from '@/components/blocks/DetailsList';
import { LightBox } from '@/components/blocks/LightBox';
import { Link as LinkElement } from '@/components/blocks/Link';
import { Timeline } from '@/components/blocks/Timeline';
import { Headline } from '@/components/Headline';
import { CesiumMap } from '@/components/settlements/CesiumMap';
import { SettlementMap } from '@/components/settlements/SettlementMap';
import { SettlementMeta } from '@/components/settlements/SettlementsMeta';

const isPhoto = (resource) => resource.resourceType.name === 'Foto';
const isNotPhoto = (resource) => resource.resourceType.name !== 'Foto';

function transformUrl(url: string) {
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/image/upload/w_1484/');
  }

  return url;
}

function sortByRole(array: Architect[]) {
  const getRole = (architect) => architect.role ?? '';
  const architects = sortAlphabetically(array);

  return architects.sort((a, b) => getRole(a).localeCompare(getRole(b), LOCALE));
}

interface SettlementProps {
  settlement: BaseSettlement;
}

export function Settlement({ settlement }: SettlementProps) {
  const photoResources = settlement?.resources?.filter(isPhoto);
  const otherResources = settlement?.resources?.filter(isNotPhoto);

  return (
    <>
      {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
        <div className='w-100-vw relative left-1/2 -translate-x-1/2'>
          <div className='p-0 md:p-0 w-full'>
            <CesiumMap locationInput={settlement.location} />
          </div>
        </div>
      )}
      <div className='relative'>
        <Box ghost>
          <div className='md:flex mt-6'>
            <Headline type='h1' className='inline-block'>{settlement.name}</Headline>
          </div>
        </Box>
        <Box ghost className='py-0 md:p-0 mb-4 flex-row justify-between items-end'>
          <SettlementMeta location={settlement.location} />
        </Box>
        <Container>
          {settlement.description && (
            <Container>
              <Box ghost className="mb-4">
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
                  {sortByRole(settlement.architects).map((architect: Architect) => (
                    <div key={architect.id}>
                      <LinkElement href={`/architekten/${architect.slug}`}>{architect.name}</LinkElement>{architect.role ? <span className="font-thin tracking-wide">{` (${architect.role})`}</span> : ''}
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
                      <LightBox src={transformUrl(resource.url)} alt={resource.description} className='min-w-full' />
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
              <Box className='p-0 md:p-0 overflow-hidden'>
                <SettlementMap
                  markers={[settlement.location]}
                  center={{ lat: settlement.location.lat, lng: settlement.location.lng }} 
                  geo={ settlement.location.geo  }/>
              </Box>
            </Container>
          )}
          <Container>
            <ContactLink />
          </Container>
        </Container>
      </div>
    </>
  );
}