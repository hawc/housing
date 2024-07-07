'use client';

import { useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { ExternalLink } from '@/lib/types';

import { EditExternalLink } from '@/components/admin/architects/ExternalLink';

interface ExternalLinksListProps extends React.HTMLAttributes<HTMLElement> {
  externalLinksInput: ExternalLink[];
  architectId: string;
}

export function ExternalLinksList({ externalLinksInput, architectId }: ExternalLinksListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(externalLinksInput);

  async function getExternalLinks(architectId: string) {
    setLoading(true);
    const externalLinks = await fetchData<ExternalLink[], ExternalLink[]>(`/api/externalLinks/get/settlement/${architectId}/all`, [], {
      cache: 'no-cache'
    });
    setExternalLinks(externalLinks);
    setLoading(false);
  }

  return (
    <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      {externalLinks?.map((externalLink: ExternalLink) => (
        <div key={externalLink.id}>
          <EditExternalLink
            onUpdate={() => getExternalLinks(architectId)}
            className='mb-4'
            externalLinkInput={externalLink}
            architectId={architectId} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditExternalLink
        key={externalLinks.length}
        onUpdate={() => getExternalLinks(architectId)}
        externalLinkInput={undefined} architectId={architectId} />
    </div>
  );
}