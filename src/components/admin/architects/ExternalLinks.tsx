'use client';

import { useCallback, useState } from 'react';

import { fetchData } from '@/lib/fetch';
import type { ExternalLink } from '@/lib/types';

import { EditExternalLink } from '@/components/admin/architects/ExternalLink';

interface ExternalLinksListProps {
  externalLinksInput: ExternalLink[];
  architectId: string;
}

export function ExternalLinksList({ externalLinksInput, architectId }: ExternalLinksListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(externalLinksInput);

  async function getExternalLinks(architectId: string) {
    setLoading(true);
    const externalLinks = await fetchData<ExternalLink[], ExternalLink[]>(`/api/externalLinks/get/architect/${architectId}/all`, []);
    setExternalLinks(externalLinks);
    setLoading(false);
  }

  const handleUpdate = useCallback(() => {
    getExternalLinks(architectId);
  }, [architectId]);

  return (
    <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      {externalLinks?.map((externalLink: ExternalLink) => (
        <div key={externalLink.id}>
          <EditExternalLink
            onUpdate={handleUpdate}
            className='mb-4'
            externalLinkInput={externalLink}
            architectId={architectId} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditExternalLink
        key={externalLinks.length}
        onUpdate={handleUpdate}
        externalLinkInput={undefined}
        architectId={architectId} />
    </div>
  );
}