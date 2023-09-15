'use client';

import { useEffect, useState } from 'react';

import { EditDetail } from '@/components/admin/settlements/Detail';

import { Detail, DetailType } from '@/app/admin/page';

interface DetailsListProps extends React.HTMLAttributes<HTMLElement> {
  detailsInput: Detail[];
  settlementId: string;
}

export function DetailsList({ detailsInput, settlementId }: DetailsListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableDetailTypes, setAvailableDetailTypes] = useState<DetailType[]>([]);
  const [details, setDetails] = useState<Detail[]>(detailsInput);

  async function getAvailableDetailTypes() {
    setLoading(true);
    const response = await fetch(`${process.env.BASE_URL ?? ''}/api/detailTypes/get/all`);
    const detailTypes = await response.json();
    setAvailableDetailTypes(detailTypes);
    setLoading(false);
  }

  async function getDetails(settlementId: string) {
    setLoading(true);
    const response = await fetch(`${process.env.BASE_URL ?? ''}/api/details/get/${settlementId}/all`);
    const details = await response.json();
    setDetails(details);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableDetailTypes();
  }, []);

  return (
    <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      {details?.map((detail: Detail) => (
        <div key={detail.id}>
          <EditDetail
            onUpdate={() => getDetails(settlementId)}
            className='mb-4'
            detailInput={detail}
            availableDetailTypes={availableDetailTypes}
            settlementId={settlementId} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditDetail
        key={details.length}
        onUpdate={() => getDetails(settlementId)}
        detailInput={undefined} availableDetailTypes={availableDetailTypes} settlementId={settlementId} />
    </div>
  );
}