import { useEffect, useState } from 'react';

import { callAPI } from '@/lib/api';

import { EditDetail } from '@/components/admin/settlements/Detail';

import { Detail, DetailType } from '@/pages/admin';

interface DetailsListProps extends React.HTMLAttributes<HTMLElement> {
  detailsInput: Detail[];
  settlementId: string;
}

export function DetailsList({ detailsInput, settlementId }: DetailsListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [availableDetailTypes, setAvailableDetailTypes] = useState<DetailType[]>([]);
  const [details, setDetails] = useState<Detail[]>(detailsInput);

  const getAvailableDetailTypes = async () => {
    setLoading(true);
    const detailTypes = (await callAPI({ type: 'getDetailTypes' }));
    setAvailableDetailTypes(detailTypes);
    setLoading(false);
  }

  const getDetails = async () => {
    setLoading(true);
    const details = (await callAPI({ type: 'getDetails', payload: { where: { settlementId } } }));
    setDetails(details);
    setLoading(false);
  }

  useEffect(() => {
    getAvailableDetailTypes();
  }, []);

  return (
    <div className={`transition-filter ${loading ? 'blur-sm pointer-events-none' : ''}`}>
      {details?.map((detail: Detail) => (
        <div
          key={detail.id}>
          <EditDetail
            onUpdate={getDetails}
            className='mb-4'
            detailInput={detail}
            availableDetailTypes={availableDetailTypes}
            settlementId={settlementId} />
          <hr className='mb-4 mt-6 border' />
        </div>
      ))}
      <EditDetail
        key={details.length}
        onUpdate={getDetails}
        detailInput={undefined} availableDetailTypes={availableDetailTypes} settlementId={settlementId} />
    </div>
  );
}