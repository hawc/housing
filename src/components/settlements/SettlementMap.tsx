'use client';

import dynamic from 'next/dynamic';

import type { Location } from '@/lib/types';

import { Coordinates } from '@/components/settlements/Map';
import { Polygon } from 'geojson';

interface SettlementMapProps {
  markers: Location[];
  center: Coordinates;
  geo?: Polygon;
}

export function SettlementMap({ markers, center, geo }: SettlementMapProps) {
  const Map = dynamic(() => import('@/components/settlements/Map'), {
    ssr: false,
  });

  return <Map markers={markers} center={center} geo={geo} />;
}
