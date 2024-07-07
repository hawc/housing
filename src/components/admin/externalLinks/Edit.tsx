import { Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { ExternalLink } from '@/lib/types';

import { Button } from '@/components/blocks/form/Button';
import { InputGhost } from '@/components/blocks/form/Input';
import { TextareaGhost } from '@/components/blocks/form/Textarea';
import { Headline } from '@/components/Headline';

interface EditExternalLinkProps {
  externalLink: ExternalLink;
  getExternalLinks: () => Promise<void>;
}

export function EditExternalLink({ externalLink, getExternalLinks }: EditExternalLinkProps) {
  const [currentExternalLink, setCurrentExternalLink] = useState<ExternalLink>(externalLink);
  const [loading, setLoading] = useState<boolean>(false);

  function updateExternalLink(updatedExternalLink: Partial<ExternalLink>) {
    setCurrentExternalLink({
      ...currentExternalLink,
      ...updatedExternalLink
    });
  }

  async function deleteExternalLink(id: string) {
    setLoading(true);
    await fetchData(`/api/externalLinks/delete/${id}`);
    await getExternalLinks();
    setLoading(false);
  }

  return (
    <>
      <div className='flex'>
        <Headline type='h6' tag='h2' className='grow'>
          <InputGhost placeholder='Name' value={externalLink.name} onChange={(event) => updateExternalLink({ name: event.target.value })} className='mb-1' />
        </Headline>
        <Button disabled={loading} onClick={() => deleteExternalLink(externalLink.id)} className='ml-3 p-2 rounded-full'>
          {loading ? <Loader2Icon size={15} className='animate-spin' /> : <XIcon size={15} />}
        </Button>
      </div>
      <InputGhost placeholder='URL' value={externalLink.url} onChange={(event) => updateExternalLink({ url: event.target.value })} className='mb-1' />
      <TextareaGhost placeholder='Beschreibung' value={externalLink.description} onChange={(event) => updateExternalLink({ description: event.target.value })} />
    </>
  );
}