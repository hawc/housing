
import type { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/blocks/Box';
import CesiumWrapper from '@/components/blocks/CesiumWrapper';

export function SettlementMap({ locationInput }: { locationInput: BaseLocation | Location }) {
  return (
    <Box ghost>
      <CesiumWrapper position={{ lat: locationInput.lat, lng: locationInput.lng }} />
    </Box>
  );
}
