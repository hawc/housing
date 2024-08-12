
import type { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import CesiumWrapper from '@/components/blocks/CesiumWrapper';

export function SettlementsMap({ locationsInput, searchTerm }: { locationsInput: BaseLocation[] | Location[], searchTerm?: string }) {
  return (
    <Box ghost>
      <CesiumWrapper positions={locationsInput.map((location) => ({ lat: location.lat, lng: location.lng }))} />
      {/* <Map markers={locationsInput} center={{ lat: 51.165707, lng: 10.452764 }} zoom={4} searchTerm={searchTerm} /> */}
    </Box>
  );
}
