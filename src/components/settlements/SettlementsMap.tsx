import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Box } from '@/components/blocks/Box';

import { BaseLocation } from '@/pages/admin';


export function SettlementsMap({ locationsInput, searchTerm }: { locationsInput: BaseLocation[], searchTerm?: string }) {
  const [locations] = useState(locationsInput);
  const Map = dynamic(() => import('@/components/admin/settlements/Map'), {
    ssr: false
  });

  return (
    <>
      <Box ghost>
        <Map markers={locations} center={{ lat: 51.165707, lng: 10.452764 }} zoom={4} searchTerm={searchTerm} />
      </Box>
    </>
  );
}
