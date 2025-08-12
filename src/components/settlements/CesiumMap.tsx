
import type { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/common/Box';
import { CesiumWrapper } from '@/components/common/CesiumWrapper';

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
