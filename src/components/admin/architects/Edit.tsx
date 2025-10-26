'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { Architect, BaseArchitect } from '@/lib/types';

import { ExternalLinksList } from '@/components/admin/architects/ExternalLinks';
import { Box } from '@/components/common/Box';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/form/Button';
import { InputGhost } from '@/components/common/form/Input';
import { TextareaGhost } from '@/components/common/form/Textarea';
import { Headline } from '@/components/Headline';

async function updateArchitect(slug: string, data: Partial<BaseArchitect>) {
  const response = await fetchData<BaseArchitect>(
    `/api/architects/update/${slug}`,
    undefined,
    { method: 'POST', body: JSON.stringify(data) }
  );

  return response;
}

async function addArchitect(data: Partial<BaseArchitect>) {
  const response = await fetchData<BaseArchitect>(
    '/api/architects/add',
    undefined,
    { method: 'POST', body: JSON.stringify(data) }
  );

  return response;
}

interface ArchitectEditProps {
  architectInput?: Architect;
}

export function ArchitectEdit({ architectInput }: ArchitectEditProps) {
  const router = useRouter();
  const [architect, setArchitect] = useState<
    BaseArchitect | Architect | undefined
  >(architectInput);
  const [loading, setLoading] = useState<boolean>(false);

  async function deleteArchitect(slug: string) {
    setLoading(true);
    await fetchData(`/api/architects/delete/${slug}`);
    router.push('/admin/architekten');
    setLoading(false);
  }

  async function submitData(architect?: BaseArchitect | Architect) {
    if (!architect) {
      return;
    }

    setLoading(true);
    const data = {
      name: architect.name,
      description: architect.description,
    };
    if (architect.slug) {
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

  const handleChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setArchitect({
        ...architect,
        name: event.target.value,
      } as Architect);
    },
    [architect]
  );

  const handleChangeDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setArchitect({
        ...architect,
        description: event.target.value,
      } as Architect);
    },
    [architect]
  );

  return (
    <>
      <Box ghost>
        <div className='flex mt-6'>
          <Headline type='h1' className='grow'>
            <InputGhost
              className='text-inherit'
              onChange={handleChangeName}
              value={architect?.name ?? ''}
            />
          </Headline>
        </div>
      </Box>
      <Container>
        <Container>
          <Box>
            <div>
              <TextareaGhost
                onChange={handleChangeDescription}
                value={architect?.description ?? ''}
              />
            </div>
          </Box>
        </Container>
        <Container>
          <Box>
            <>
              <Headline className='inline-block' tag='h2' type='h3'>
                Weblinks
              </Headline>
              {architect?.urls && (
                <ExternalLinksList
                  externalLinksInput={architect.urls}
                  architectId={architect.id}
                />
              )}
            </>
          </Box>
        </Container>
        <Container className='md:grid-cols-3'>
          <Box>
            <Button
              onClick={() => submitData(architect)}
              disabled={!architect?.name}
              loading={loading}
            >
              Speichern
            </Button>
          </Box>
          <Box>
            <Link
              href='/admin/architekten'
              className='inline-block py-1 px-3 text-center border border-text'
            >
              Abbrechen
            </Link>
          </Box>
          <Box>
            <Button
              className='bg-text text-bg border border-text'
              onClick={() => architect && deleteArchitect(architect.slug)}
              disabled={!architect?.id}
              loading={loading}
            >
              Löschen
            </Button>
          </Box>
        </Container>
      </Container>
    </>
  );
}
