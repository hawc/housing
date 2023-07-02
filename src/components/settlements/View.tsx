
import { Map } from '@/components/admin/settlements/Map';
import { Box, Container } from '@/components/blocks/Box';
import { TagList } from '@/components/blocks/Tags';
import { Headline } from '@/components/Headline';
import Timeline from '@/components/Timeline';

import type { Architect, Detail, Settlement, Tag } from '@/pages/admin';

export function Settlement({ settlement }: { settlement: Settlement }) {
  return (
    <>
      <Container>
        <>
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
          {settlement.events.length > 0 && (
            <Box>
              <Headline className='inline-block mb-3' tag='h2' type='h3'>Events</Headline>
              <Timeline events={settlement.events} />
            </Box>
          )}
          {settlement.location && (
            <Map lat={settlement.location.lat} lng={settlement.location.lng} />
          )}
          {settlement.details.length > 0 && (
            <Box>
              <Headline className='inline-block' tag='h2' type='h3'>Details</Headline>
              <div>
                {settlement.details.map((detail: Detail) => (
                  <div key={detail.id}>
                    <h3>
                      {detail.name}
                    </h3>
                    <div>
                      {detail.detailType.name}: {detail.description}
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          )}
        </>
      </Container>
    </>
  );
}