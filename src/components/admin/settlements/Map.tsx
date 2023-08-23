'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

import { isSettlementFound } from '@/components/blocks/SearchList';

import { BaseLocation, Location } from '@/app/admin/page';

export default function Map({ markers, center, zoom = 12, searchTerm = '' }: { markers: (BaseLocation | Location)[], center: { lat: number, lng: number }, zoom?: number, searchTerm?: string }) {
  const router = useRouter();
  return (
    <>
      <ReactMapGL
        style={{ height: '400px' }}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: zoom
        }}
        mapStyle="mapbox://styles/hawc/clk5ql67s00ie01pdadkx2kbb"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      >
        {markers.map(marker => 'settlement' in marker ? (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            latitude={marker.lat}
            longitude={marker.lng}
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/siedlungen/${marker.settlement.slug}`)}
          >
            <div title={marker.settlement.name} style={isSettlementFound(marker.settlement.name, marker.city, searchTerm) ?
              { background: 'var(--highlight)', width: '16px', height: '16px', border: '1px solid var(--black)', opacity: '1' } :
              { background: 'var(--black)', width: '16px', height: '16px', border: '1px solid var(--highlight)', opacity: '1' }}></div>
          </Marker>
        ) : (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            latitude={marker.lat}
            longitude={marker.lng}
          >
            <div style={{ background: 'var(--highlight)', width: '16px', height: '16px', border: '1px solid var(--black)' }}></div>
          </Marker>
        ))}
      </ReactMapGL>
    </>
  );
}