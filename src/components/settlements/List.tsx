import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';

import { BaseSettlement } from '@/pages/admin';

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [settlements, setSettlements] = useState(settlementsInput);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  return (
    <>
      <Box>
        <div className='flex'>
          <Headline type='h1' className='mb-0 inline-block'>Siedlungen: Übersicht</Headline>
          <Button className='ml-3 p-2 rounded-full' onClick={() => getSettlements()}>
            <RotateCwIcon className={`align-text-bottom ${loading && 'animate-spin'}`} size={15} />
          </Button>
        </div>
      </Box>
      <Box>
        <div className={`transition-filter ${loading ? 'blur-sm' : 'blur-none'}`}>
          {loading && settlements ? (
            <List>
              {settlements.map(({ name, slug }) => (
                <ListItem plain key={slug}>
                  <Link href='#' className='pointer-events-none'>{name}</Link>
                </ListItem>
              ))}
            </List>
          ) : settlements ? (
            <List>
              {settlements.map(({ name, slug }) => (
                <ListItem plain key={slug}>
                  <Link href={`/siedlungen/${slug}`}>{name}</Link>
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
