import { RotateCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

export function ListArchitects() {
  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(false);

  const getArchitects = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const architects = await callAPI({ type: 'getArchitects' });
    setArchitects(architects);
    setLoading(false);
  };

  useEffect(() => {
    getArchitects();
  }, [])

  return (
    <>
      <div>
        <Headline type='h1' className='inline-block'>Architekten: Übersicht</Headline>
        <Button color='white' className='align-top mt-1 ml-3' onClick={() => getArchitects()}><RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={16} /></Button>
      </div>
      <div className="relative flex w-full max-w-[24rem]">
        {loading && architects ? (
          <List>
            {architects.map(({ name, slug }) => (
              <ListItem key={slug} plain className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>
                  <Link href={`/architekten/${slug}`}>{name}</Link>
                </Skeleton>
              </ListItem>
            ))}
          </List>
        ) : architects ? (
          <List>
            {architects.map(({ name, slug }) => (
              <ListItem plain key={slug}>
                <Link href={`/architekten/${slug}`}>{name}</Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <>Couldn't load architects.</>
        )}
      </div >
    </>
  );
}
