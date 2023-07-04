

import { Map } from '@/components/admin/settlements/Map';
import { Box, Container } from '@/components/blocks/Box';
import { DetailsList } from '@/components/blocks/DetailsList';
import { TagList } from '@/components/blocks/Tags';
import { Timeline } from '@/components/blocks/Timeline';
import { Headline } from '@/components/Headline';

import type { Architect, Settlement, Tag } from '@/pages/admin';

export function Settlement({ settlement }: { settlement: Settlement }) {
  return (
    <>
      <Container>
        <Container>
          <Box>
            <>
              <div className='align-middle'>
                <Headline type="h1" className='inline-block'>{settlement.title}</Headline>
                {settlement.tags.length > 0 && (
                  <TagList className='ml-2 inline-block align-top' tagNames={settlement.tags.map((tag: Tag) => tag.name)} />
                )}
              </div>
              {settlement.description && (
                <p>{settlement.description}</p>
              )}
            </>
          </Box>
        </Container>
        <Container cols="grid-cols-1 md:grid-cols-2">
          <>
            {settlement.events.length > 0 && (
              <Box>
                <Headline className='inline-block' tag='h2' type='h3'>Historie</Headline>
                <Timeline events={settlement.events} />
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
        <Container>
          <>
            {settlement.architects.length > 0 && (
              <Box>
                <>
                  <Headline className='inline-block' tag='h2' type='h3'>
                    {settlement.architects.length > 1 ? 'Architekten' : 'Architekt'}
                  </Headline>
                  {settlement.architects.map((architect: Architect) => (
                    <div key={architect.id}>
                      {architect.name}
                    </div>
                  ))}
                </>
              </Box>
            )}
          </>
        </Container>
        <div className='columns-2 gap-5'>
          <>
            {settlement.resources.length > 0 && (
              <>
                {settlement.resources.filter(resource => resource.type.name === 'Foto').map((resource, index) => (
                  <Box key={resource.id} className={index < settlement.resources.filter(resource => resource.type.name === 'Foto').length - 2 ? 'mb-5 p-0 block' : 'p-0 block'}>
                    <img className='block' src={resource.url} alt={resource.description} loading='lazy' />
                    <div className='px-5 py-4'>
                      {resource.description}
                    </div>
                  </Box>
                ))}
              </>
            )}
          </>
        </div>
        <>
          {settlement.location && settlement.location.lat > 0 && settlement.location.lng > 0 && (
            <Container>
              <Map lat={settlement.location.lat} lng={settlement.location.lng} />
            </Container>
          )}
        </>
      </Container>
    </>
  );
}