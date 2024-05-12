'use client';

import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';

import { Box, Container } from '@/components/blocks/Box';
import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

import type { Architect, BaseArchitect } from '@/app/admin/page';

export type Partial<T> = { [P in keyof T]?: T[P] };

async function updateArchitect(slug: string, data: Partial<BaseArchitect>) {
  const response = await fetchData<BaseArchitect>(`/api/architects/update/${slug}`, undefined, { method: 'POST', body: JSON.stringify(data) });

  return response;
}

async function addArchitect(data: Partial<BaseArchitect>) {
  const response = await fetchData<BaseArchitect>('/api/architects/add', undefined, { method: 'POST', body: JSON.stringify(data) });

  return response;
}

export function ArchitectEdit({ architectInput }: { architectInput: Architect | undefined }) {
  const router = useRouter();
  const [architect, setArchitect] = useState<BaseArchitect | Architect | undefined>(architectInput);
  const [loading, setLoading] = useState<boolean>(false);

  function updateArchitectData(input: Partial<BaseArchitect>) {
    setArchitect({
      ...architect,
      ...input,
    } as Architect);
  }

  async function deleteArchitect(slug: string) {
    setLoading(true);
    await fetchData(`/api/architects/delete/${slug}`);
    router.push('/admin/architekten');
    setLoading(false);
  }

  async function submitData(architect) {
    setLoading(true);
    const data = {
      name: architect.name,
      description: architect.description,
    };
    if (architect?.slug) {
      const responseArchitect = await updateArchitect(architect.slug, data);
      await setArchitect(responseArchitect);
    } else {
      const responseArchitect = await addArchitect(data);
      if (responseArchitect?.slug) {
        router.push(`/admin/architekten/${responseArchitect.slug}`);
      }
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateArchitectData({ name: event.target.value })}
              value={architect?.name ?? ''} />
          </Headline>
        </div>
      </Box>
      <Container>
        <Container>
          <Box>
            <div>
              <TextareaGhost
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => updateArchitectData({ description: event.target.value })}
                value={architect?.description ?? ''} />
            </div>
          </Box>
        </Container>
        <Container className='md:grid-cols-3'>
          <Box>
            <Button onClick={() => submitData(architect)} disabled={loading || !architect?.name}>
              Speichern {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
            </Button>
          </Box>
          <Box>
            <Link href='/admin/architekten' className='inline-block py-1 px-3 text-center border border-text'>Abbrechen</Link>
          </Box>
          <Box>
            <Button
              className='bg-text text-bg border border-text'
              onClick={() => architect && deleteArchitect(architect.slug)} disabled={loading || !(architect?.id)}>
              Löschen {loading && <Loader2Icon className='inline-block animate-spin align-sub leading-none' />}
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
}