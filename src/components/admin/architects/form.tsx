import { Button, Input, List, ListItem } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import Skeleton, { skeletonClass, skeletonStyle } from '@/components/Skeleton';

import type { Architect } from '@/pages/admin';

function AddArchitect({ getArchitects }: { getArchitects: () => Promise<void> | void }) {
  const [architect, setArchitect] = useState<Architect | null>(null);

  const addArchitect = async (architectName: string) => {
    if (!architectName) {
      return console.error('No name provided');
    }
    await callAPI({ type: 'addArchitect', payload: { data: { name: architectName } } });
    await getArchitects();
  };

  return (
    <>
      <Input
        label='New Architect Name'
        className="pr-20"
        containerProps={{
          className: 'min-w-0',
        }}
        value={architect?.name ?? ''}
        onChange={({ target }) => setArchitect({ id: '', name: target.value })} />
      <Button
        size="sm"
        className="ml-2 right-1 top-1 rounded"
        onClick={() => architect && addArchitect(architect.name)}>Add</Button>
    </>
  );
}

export function ListArchitects() {
  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(false);

  const getArchitects = async () => {
    setLoading(true);
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

  useEffect(() => {
    getArchitects();
  }, [])

  return (
    <>
      <h1>Show architects</h1>
      <Button onClick={() => getArchitects()}>Button</Button>
      <div className="relative flex w-full max-w-[24rem]">
        {(loading && architects) ? (
          <List>
            {architects.map(({ name, id }) => (
              <ListItem key={id} className={skeletonClass} style={skeletonStyle}>
                <Skeleton nested>{id}: {name}
                  <Button
                    disabled
                    size='sm'
                    className="ml-2 right-1 top-1 rounded"
                  >Delete</Button></Skeleton>
              </ListItem>
            ))}
            <Skeleton nested>
              <ListItem className={skeletonClass} style={skeletonStyle}>
                <AddArchitect getArchitects={() => { return }} />
              </ListItem>
            </Skeleton>
          </List>
        ) : architects ? (
          <List>
            {architects.map(({ name, id }) => (
              <ListItem key={id}>{id}: {name}
                <Button
                  size='sm'
                  className="ml-2 right-1 top-1 rounded"
                  onClick={() => deleteArchitect(id)}>Delete</Button></ListItem>
            ))}
            <ListItem>
              <AddArchitect getArchitects={() => getArchitects()} />
            </ListItem>
          </List>
        ) : (
          <>Couldn't load architects.</>
        )}
      </div >
    </>
  );
}
