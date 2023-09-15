'use client';

import { useEffect, useState } from 'react';

import { EditResource } from '@/components/admin/settlements/Resource';

import { Resource, ResourceType } from '@/app/admin/page';

interface ResourcesListProps extends React.HTMLAttributes<HTMLElement> {
  resourcesInput: Resource[];
  settlementId: string;
  settlementSlug: string;
}

export function ResourcesList({ resourcesInput, settlementId, settlementSlug }: ResourcesListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableResourceTypes, setAvailableResourceTypes] = useState<ResourceType[]>([]);
  const [resources, setResources] = useState<Resource[]>(resourcesInput);

  async function getAvailableResourceTypes() {
    setLoading(true);
    // const response = await fetch(`${process.env.BASE_URL ?? ''}/api/resourceTypes/get/all`);
    // const resourceTypes = await response.json();
    const resourceTypes = [];
    setAvailableResourceTypes(resourceTypes);
    setLoading(false);
  }

  async function getResources(settlementId: string) {
    setLoading(true);
    const response = await fetch(`${process.env.BASE_URL ?? ''}/api/resources/get/${settlementId}/all`);
    const resources = await response.json();
    setResources(resources);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableResourceTypes();
  }, []);

  return (
    <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      {resources?.map((resource: Resource) => (
        <div
          key={resource.id}>
          <EditResource
            onUpdate={() => getResources(settlementId)}
            settlementSlug={settlementSlug}
            className='mb-4'
            resourceInput={resource}
            availableResourceTypes={availableResourceTypes}
            settlementId={settlementId} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditResource
        key={resources.length}
        onUpdate={() => getResources(settlementId)}
        settlementSlug={settlementSlug}
        resourceInput={undefined} availableResourceTypes={availableResourceTypes} settlementId={settlementId} />
    </div>
  );
}