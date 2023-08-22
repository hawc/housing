'use client';

import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { EditResource } from '@/components/admin/settlements/Resource';

import { Resource, ResourceType } from '@/app/admin/page';

interface ResourcesListProps extends React.HTMLAttributes<HTMLElement> {
  resourcesInput: Resource[];
  settlementId: string;
}

export function ResourcesList({ resourcesInput, settlementId }: ResourcesListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableResourceTypes, setAvailableResourceTypes] = useState<ResourceType[]>([]);
  const [resources, setResources] = useState<Resource[]>(resourcesInput);

  const getAvailableResourceTypes = async () => {
    setLoading(true);
    const resourceTypes = (await callAPI({ type: 'getResourceTypes' }));
    setAvailableResourceTypes(resourceTypes);
    setLoading(false);
  }

  const getResources = async () => {
    setLoading(true);
    const resources = (await callAPI({ type: 'getResources', payload: { where: { settlementId } } }));
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
            onUpdate={getResources}
            className='mb-4'
            resourceInput={resource}
            availableResourceTypes={availableResourceTypes}
            settlementId={settlementId} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditResource
        key={resources.length}
        onUpdate={getResources}
        resourceInput={undefined} availableResourceTypes={availableResourceTypes} settlementId={settlementId} />
    </div>
  );
}