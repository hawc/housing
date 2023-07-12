import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Link } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

import type { BaseArchitect } from '@/pages/admin';

export type Partial<T> = { [P in keyof T]?: T[P] };

export function ArchitectEdit({ architectInput }: { architectInput: BaseArchitect }) {
  const [architect, setArchitect] = useState<BaseArchitect>(architectInput);
  const [loading, setLoading] = useState<boolean>(false);

  const updateArchitect = (input: Partial<BaseArchitect>) => {
    setArchitect({
      ...architect,
      ...input,
    } as BaseArchitect)
  }

  const submitData = async (architect) => {
    setLoading(true);
    await callAPI({
      type: 'updateArchitect',
      payload: {
        data: {
          name: architect.name,
          description: architect.description,
        },
        where: { id: architect.id }
      }
    });
    setArchitect(await callAPI({ type: 'getArchitect', payload: { where: { id: architect.id } } }));
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex' >
          <Headline type='h1' className='grow'>
            <InputGhost
              className='text-inherit'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateArchitect({ name: event.target.value })}
              value={architect.name} />
          </Headline>
          <div>
            <Link href='/admin/architekten'>zurück zur Übersicht</Link>
          </div>
        </div>
      </Box>
      <Container>
        <Container>
          <Box>
            <div>
              <TextareaGhost
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => updateArchitect({ description: event.target.value })}
                value={architect.description} />
            </div>
          </Box>
        </Container>
        <Container cols='grid-cols-2'>
          <Button onClick={() => submitData(architect)} disabled={loading}><>Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}</></Button>
          <Link href="/admin/architekten" className='inline-block py-1 px-3 bg-content text-center'>Abbrechen</Link>
        </Container>
      </Container>
    </>
  );
}