
import { TagList } from '@/components/blocks/Tags';
import { Headline } from '@/components/Headline';
import Timeline from '@/components/Timeline';

import type { Architect, Detail, Settlement, Tag } from '@/pages/admin';

export function Settlement({ settlement }: { settlement: Settlement }) {
  return (
    <>
      <div>
        <div>
          <div className='align-middle'>
            <Headline type="h1" className='mb-3 inline-block'>{settlement.title}</Headline>
            {settlement.tags.length > 0 && (
              <TagList className='ml-2 inline-block align-top' tagNames={settlement.tags.map((tag: Tag) => tag.name)} />
            )}
          </div>
          <p>{settlement.description}</p>
        </div>
        {settlement.architects.length > 0 && (
          <div>
            <Headline className='inline-block' tag='h2' type='h6'><>Architekt{settlement.architects.length > 1 && (<>en</>)}:&nbsp;</></Headline>
            {settlement.architects.map((architect: Architect, index: number) => (
              <span className='inline-block' key={architect.id}>
                {architect.name}{index < settlement.architects.length - 1 && (<>,&nbsp;</>)}
              </span>
            ))}
          </div>
        )}
        {settlement.events.length > 0 && (
          <div className='mt-4'>
            <h2 className='mb-3'>Events</h2>
            <Timeline events={settlement.events} />
          </div>
        )}
        <div>
          <h2>Details</h2>
          <div>
            {settlement.details?.map((detail: Detail) => (
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
        </div>
      </div>
    </>
  );
}