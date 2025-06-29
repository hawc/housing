'use client';

import dynamic from 'next/dynamic';

import type { Location } from '@/lib/types';

import { Coordinates } from '@/components/settlements/Map';

interface SettlementMapProps {
  markers: Location[];
  center: Coordinates;
}

export function SettlementMap({ markers, center }: SettlementMapProps) {
  const Map = dynamic(() => import('@/components/settlements/Map'), {
    ssr: false
  });

  return (
    <Map
      markers={markers}
      center={center} />
  );
}
