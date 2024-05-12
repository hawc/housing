import dynamic from 'next/dynamic';

import { Box } from '@/components/blocks/Box';

import { BaseLocation, Location } from '@/app/admin/page';

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
