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
    <div>
      {details?.map((detail: Detail) => (
        <EditDetail
          onUpdate={getDetails}
          className='mb-4' key={detail.id} detailInput={detail} availableDetailTypes={availableDetailTypes} settlementId={settlementId} />
      ))}
      <EditDetail
        key={details.length}
        onUpdate={getDetails}
        detailInput={undefined} availableDetailTypes={availableDetailTypes} settlementId={settlementId} />
    </div>
  );
}