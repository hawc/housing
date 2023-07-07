import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';

import { BaseSettlement, Settlement } from '@/pages/admin';

export function ListSettlements({ settlementsInput }: { settlementsInput: BaseSettlement[] }) {
  const [settlements, setSettlements] = useState<Settlement[]>(settlementsInput);
  const [loading, setLoading] = useState(false);

  const getSettlements = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const settlements = await callAPI({ type: 'getSettlements' });
    setSettlements(settlements);
    setLoading(false);
  };

  const deleteSettlement = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteSettlement', payload: { where: { id } } });
    getSettlements();
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
        <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : 'blur-none'}`}>
          {loading && settlements ? (
            <List>
              {settlements.map(({ name, slug }) => (
                <ListItem plain key={slug} className='flex'>
                  <span><Link arrow href='#'>{name}</Link></span>
                  <Button
                    className="ml-2 right-1 top-1 rounded"
                    onClick={() => { return }}>Löschen</Button>
                </ListItem>
              ))}
            </List>
          ) : settlements ? (
            <List>
              {settlements.map(({ id, name, slug }) => (
                <ListItem plain key={slug} className='flex'>
                  <span><Link arrow href={`/admin/siedlungen/${slug}`}>{name}</Link></span>
                  <Button
                    className="ml-2 right-1 top-1 rounded"
                    onClick={() => deleteSettlement(id)}>Löschen</Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <>Keine Datensätze gefunden.</>
          )}
        </div>
      </Box>
      <Box>
        <Link arrow href="/admin/siedlungen/neu">Neue Siedlung</Link>
      </Box>
    </>
  );
}
