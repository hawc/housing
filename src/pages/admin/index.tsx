import { Button, Input, List, ListItem } from '@material-tailwind/react';
import { useState } from 'react';

import Layout from '@/components/layout/Layout';

interface Payload {
  type: string;
  payload?: AddArchitectPayload | DeleteArchitectPayload;
}

interface Architect {
  id: string;
  name: string;
}

interface AddArchitectPayload {
  name: string;
}
interface DeleteArchitectPayload {
  id: string;
}

const callAPI = async (payload: Payload) => {
  try {
    const res = await fetch(`/api/db`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export default function Admin() {
  const [architect, setArchitect] = useState<Architect | null>(null);
  const [architects, setArchitects] = useState([]);

  const addArchitect = (architectName: string) => {
    if (!architectName) {
      return console.error('No name provided');
    }
    return callAPI({ type: 'addArchitect', payload: { name: architectName } })
  };
  const deleteArchitect = (id: string) => callAPI({ type: 'deleteArchitect', payload: { id } });
  const getArchitects = async () => {
    const architects = await callAPI({ type: 'getArchitects' });
    setArchitects(architects);
  };
  return (
    <Layout>
      <h1>Add new architect</h1>

      <div className="relative flex w-full max-w-[24rem]">
        <Input
          label='New Architect Name'
          className="pr-20"
          containerProps={{
            className: "min-w-0",
          }}
          value={architect?.name ?? ''}
          onChange={({ target }) => setArchitect({ id: '', name: target.value })} />
        <Button
          className="ml-2 right-1 top-1 rounded"
          onClick={() => architect && addArchitect(architect.name)}>Add</Button>
      </div>
      <h1>Show architects</h1>
      <Button onClick={() => getArchitects()}>Button</Button>
      <div className="relative flex w-full max-w-[24rem]">
        <List>
          {architects.map(({ name, id }) => (
            <ListItem key={id}>{id}: {name}
              <Button
                size='sm'
                className="ml-2 right-1 top-1 rounded"
                onClick={() => deleteArchitect(id)}>Delete</Button></ListItem>
          ))}
        </List>
      </div>
    </Layout>
  );
}
