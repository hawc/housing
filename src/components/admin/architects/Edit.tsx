import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import router from 'next/router';
import { useState } from 'react';

import { callAPI } from '@/lib/api';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Link as LinkElement } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

import type { Architect, BaseArchitect } from '@/pages/admin';

export type Partial<T> = { [P in keyof T]?: T[P] };

export function ArchitectEdit({ architectInput }: { architectInput: Architect }) {
  const [architect, setArchitect] = useState<BaseArchitect | Architect>(architectInput);
  const [loading, setLoading] = useState<boolean>(false);

  const updateArchitect = (input: Partial<BaseArchitect>) => {
    setArchitect({
      ...architect,
      ...input,
    } as Architect)
  }

  const deleteArchitect = async (id: string) => {
    setLoading(true);
    await callAPI({ type: 'deleteArchitect', payload: { where: { id } } });
    router.push('/admin/architekten');
    setLoading(false);
  };

  const submitData = async (architect) => {
    setLoading(true);
    if (architect?.id) {
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
      await getArchitect();
    } else {
      const response = await callAPI({
        type: 'addArchitect',
        payload: {
          data: {
            name: architect.name,
            description: architect.description,
          },
        }
      });
      if (response) {
        setArchitect(response);
      }
    }
    setLoading(false);
  }

  const getArchitect = async () => {
    setLoading(true);
    if (architect.id) {
      setArchitect(await callAPI({ type: 'getArchitect', payload: { where: { id: architect.id } } }));
    }
    setLoading(false);
  }

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='grow'>
            <InputGhost
              className='text-inherit'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateArchitect({ name: event.target.value })}
              value={architect?.name ?? ''} />
          </Headline>
          <div>
            <Link className='block ml-3 p-2 rounded-full bg-highlight' href='/admin/architekten'>
              <ArrowLeftIcon className="align-text-bottom" size={15} />
            </Link>
          </div>
        </div>
      </Box>
      <Container>
        <Container>
          <Box>
            <div>
              <TextareaGhost
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => updateArchitect({ description: event.target.value })}
                value={architect?.description ?? ''} />
            </div>
          </Box>
        </Container>
        <Container cols='grid-cols-2'>
          <Button onClick={() => submitData(architect)} disabled={loading || !architect?.name}>
            <>
              Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
            </>
          </Button>
          <Button onClick={() => deleteArchitect(architect.id)} disabled={loading || !(architect?.id)}>
            <>
              Löschen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
            </>
          </Button>
          <LinkElement href='/admin/architekten' className='inline-block py-1 px-3 text-center'>Abbrechen</LinkElement>
        </Container>
      </Container>
    </>
  );
}