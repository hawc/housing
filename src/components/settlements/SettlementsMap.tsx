import dynamic from 'next/dynamic';

import { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/blocks/Box';

export function SettlementsMap({ locationsInput, searchTerm }: { locationsInput: BaseLocation[] | Location[], searchTerm?: string }) {
  const Map = dynamic(() => import('@/components/admin/settlements/Map'), {
    ssr: false
  });

  return (
    <Box ghost>
      <Map markers={locationsInput} center={{ lat: 51.165707, lng: 10.452764 }} zoom={4} searchTerm={searchTerm} />
    </Box>
  );
}
