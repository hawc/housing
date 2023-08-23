'use client';

import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { callAPI } from '@/lib/api';
import { slugify } from '@/lib/utils';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Link as LinkElement } from '@/components/blocks/Link';
import { Headline } from '@/components/Headline';

import type { Architect, BaseArchitect } from '@/app/admin/page';

export type Partial<T> = { [P in keyof T]?: T[P] };

export function ArchitectEdit({ architectInput }: { architectInput: Architect | undefined }) {
  const router = useRouter();
  const [architect, setArchitect] = useState<BaseArchitect | Architect | undefined>(architectInput);
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
      await getArchitect(architect.id);
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
      await getArchitect(response?.id);
      router.push(`/admin/architekten/${slugify(architect.name)}`)
    }
    setLoading(false);
  }

  const getArchitect = async (id: string) => {
    setLoading(true);
    if (architect?.id) {
      setArchitect(await callAPI({ type: 'getArchitect', payload: { where: { id } } }));
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
        <Container className='md:grid-cols-3'>
          <Box>
            <Button onClick={() => submitData(architect)} disabled={loading || !architect?.name}>
              <>
                Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
              </>
            </Button>
          </Box>
          <Box>
            <LinkElement href='/admin/architekten' className='inline-block py-1 px-3 text-center border border-text'>Abbrechen</LinkElement>          </Box>
          <Box>
            <Button
              className='bg-text text-bg border border-text'
              onClick={() => architect && deleteArchitect(architect.id)} disabled={loading || !(architect?.id)}>
              <>
                Löschen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
              </>
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
}