'use client';

import type { BaseLocation, Location } from '@/lib/types';

import { Box } from '@/components/common/Box';
import Map from '@/components/settlements/Map';

interface SettlementsMapProps {
  locationsInput: BaseLocation[] | Location[];
  searchTerm?: string;
}

export function SettlementsMap({
  locationsInput,
  searchTerm,
}: SettlementsMapProps) {
  return (
    <Box ghost>
      <Map
        markers={locationsInput}
        center={{ lat: 51.165707, lng: 10.452764 }}
        zoom={4}
        searchTerm={searchTerm}
      />
    </Box>
  );
}
