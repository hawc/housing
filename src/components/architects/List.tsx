import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';

import { BaseArchitect } from '@/pages/admin';

export function ListArchitects({ architectsInput }: { architectsInput: BaseArchitect[] }) {
  const [architects, setArchitects] = useState(architectsInput);
  const [loading, setLoading] = useState(false);

  const getArchitects = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const architects = await callAPI({ type: 'getArchitects' });
    setArchitects(architects);
    setLoading(false);
  };

  return (
    <>
      <Box>
        <div className='flex'>
          <Headline type='h1' className='mb-0 inline-block'>Architekten: Übersicht</Headline>
          <Button className='ml-3 p-2 rounded-full' onClick={() => getArchitects()}>
            <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
          </Button>
        </div>
      </Box>
      <Box>
        <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : 'blur-none'}`}>
          {loading && architects ? (
            <List>
              {architects.map(({ name, slug }) => (
                <ListItem plain key={slug}>
                  <Link href='#'>{name}</Link>
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
            <>Keine Datensätze gefunden.</>
          )}
        </div>
      </Box>
    </>
  );
}
