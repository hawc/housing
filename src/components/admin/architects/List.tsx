import { Input } from '@material-tailwind/react';
import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';

import { Architect, BaseArchitect } from '@/pages/admin';

function AddArchitect({ getArchitects }: { getArchitects: () => Promise<void> | void }) {
  const [architect, setArchitect] = useState<string | null>(null);

  const addArchitect = async (architectName: string) => {
    if (!architectName) {
      return console.error('No name provided');
    }
    await callAPI({
      type: 'addArchitect',
      payload: {
        data: {
          name: architectName
        }
      }
    });
    await getArchitects();
  };

  return (
    <>
      <div>
        <Input
          label='New Architect Name'
          className="pr-20"
          containerProps={{
            className: 'min-w-0',
          }}
          value={architect ?? ''}
          onChange={({ target }) => setArchitect(target.value)} />
        <Button
          className="ml-2 right-1 top-1 rounded"
          onClick={() => architect && addArchitect(architect)}>Add</Button>
      </div></>
  );
}

export function ListArchitects({ architectsInput }: { architectsInput: BaseArchitect[] }) {
  const [architects, setArchitects] = useState<Architect[]>(architectsInput);
  const [loading, setLoading] = useState(false);

  const getArchitects = async () => {
    setLoading(true);
    await callAPI({ type: 'clearCache' });
    const architects = await callAPI({ type: 'getArchitects' });
    setArchitects(architects);
    setLoading(false);
  };

  const deleteArchitect = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteArchitect', payload: { where: { id } } });
    getArchitects();
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
                <ListItem plain key={slug} className='flex'>
                  <span><Link arrow href='#'>{name}</Link></span>
                  <Button
                    className="ml-2 right-1 top-1 rounded"
                    onClick={() => { return }}>Löschen</Button>
                </ListItem>
              ))}
              <ListItem plain>
                <AddArchitect getArchitects={() => getArchitects()} />
              </ListItem>
            </List>
          ) : architects ? (
            <List>
              {architects.map(({ id, name, slug }) => (
                <ListItem plain key={slug} className='flex'>
                  <span><Link arrow href={`/admin/architekten/${slug}`}>{name}</Link></span>
                  <Button
                    className="ml-2 right-1 top-1 rounded"
                    onClick={() => deleteArchitect(id)}>Löschen</Button>
                </ListItem>
              ))}
              <ListItem plain>
                <AddArchitect getArchitects={() => getArchitects()} />
              </ListItem>
            </List>
          ) : (
            <>Keine Datensätze gefunden.</>
          )}
        </div>
      </Box>
    </>
  );
}
