
import type { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import { CesiumWrapper } from '@/components/blocks/CesiumWrapper';

interface CesiumMapProps {
  locationInput: BaseLocation | Location;
}

export function CesiumMap({ locationInput }: CesiumMapProps) {
  return (
    <Box ghost>
      <CesiumWrapper position={{ lat: locationInput.lat, lng: locationInput.lng }} />
    </Box>
  );
}
