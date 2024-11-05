'use client';

import type { BaseLocation, Location } from '@/lib/types';

import Map from '@/components/admin/settlements/Map';
import { Box } from '@/components/blocks/Box';

interface SettlementsMapProps {
  locationsInput: BaseLocation[] | Location[];
  searchTerm?: string;
}

export function SettlementsMap({ locationsInput, searchTerm }: SettlementsMapProps) {
  return (
    <Box ghost>
      <Map markers={locationsInput} center={{ lat: 51.165707, lng: 10.452764 }} zoom={4} searchTerm={searchTerm} />
    </Box>
  );
}
