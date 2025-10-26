'use client';

import { useEffect, useMemo, useState } from 'react';

import { EditResource } from '@/components/admin/settlements/resources/Edit';
import { fetchData } from '@/lib/fetch';
import type { Resource, ResourceType } from '@/lib/types';

interface ResourcesListProps {
  resourcesInput: Resource[];
  settlementId: string;
  settlementSlug: string;
}

export function ResourcesList({
  resourcesInput,
  settlementId,
  settlementSlug,
}: ResourcesListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableResourceTypes, setAvailableResourceTypes] = useState<
    ResourceType[]
  >([]);
  const [resources, setResources] = useState<Resource[]>(resourcesInput);

  async function getAvailableResourceTypes() {
    setLoading(true);
    const resourceTypes = await fetchData<ResourceType[], ResourceType[]>(
      '/api/resourceTypes/get/all',
      [],
    );
    setAvailableResourceTypes(resourceTypes);
    setLoading(false);
  }

  async function getResources(settlementId: string) {
    setLoading(true);
    const resources = await fetchData<Resource[], Resource[]>(
      `/api/resources/get/settlement/${settlementId}/all`,
      [],
    );
    setResources(resources);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableResourceTypes();
  }, []);

  const sortedResources = useMemo(() => {
    return resources?.sort((a, b) =>
      a.resourceType.name.localeCompare(b.resourceType.name),
    );
  }, [resources]);

  return (
    <div
      className={`transition-filter ${
        loading ? 'blur-sm pointer-events-none' : ''
      }`}
    >
      {sortedResources?.map((resource: Resource) => (
        <div key={resource.id}>
          <EditResource
            onUpdate={() => getResources(settlementId)}
            settlementSlug={settlementSlug}
            className='mb-4'
            resourceInput={resource}
            availableResourceTypes={availableResourceTypes}
            settlementId={settlementId}
          />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditResource
        key={resources.length}
        onUpdate={() => getResources(settlementId)}
        settlementSlug={settlementSlug}
        resourceInput={undefined}
        availableResourceTypes={availableResourceTypes}
        settlementId={settlementId}
      />
    </div>
  );
}
