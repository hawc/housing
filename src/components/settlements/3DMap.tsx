
import type { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import { CesiumWrapper } from '@/components/blocks/CesiumWrapper';

interface SettlementMapProps {
  locationInput: BaseLocation | Location;
}

export function SettlementMap({ locationInput }: SettlementMapProps) {
  return (
    <Box ghost>
      <CesiumWrapper position={{ lat: locationInput.lat, lng: locationInput.lng }} />
    </Box>
  );
}
