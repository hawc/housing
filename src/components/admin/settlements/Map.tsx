'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

import './map.css';

import { isSettlementFound } from '@/components/blocks/SearchList';

import { BaseLocation, Location } from '@/app/admin/page';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  markers: (BaseLocation | Location)[];
  center: Coordinates;
  zoom?: number;
  searchTerm?: string;
}

function Tooltip({ title = '' }: { title: string }) {
  return (
    <div
      className='tooltip absolute hidden text-center leading-tight text-white text-sm tracking-wide font-primary whitespace-nowrap'
      dangerouslySetInnerHTML={{ __html: title.replaceAll(', ', '<br />') }}></div>
  );
}

export default function Map({ markers, center, zoom = 12, searchTerm = '' }: MapProps) {
  const router = useRouter();
  const [hasClickedMarker, setHasClickedMarker] = useState(false);

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
            onClick={() => router.push(`/siedlungen/${marker.settlement.slug}`)}
          >
            <div
              className={`relative h-4 w-4 flex items-center cursor-pointer marker ${!isSettlementFound(marker.settlement.name, marker.city, searchTerm) && 'marker-disabled'}`}>
              <Tooltip title={marker.settlement.name} />
            </div>
          </Marker>
        ) : (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            latitude={marker.lat}
            longitude={marker.lng}
            onClick={() => {
              if (hasClickedMarker) {
                setHasClickedMarker(false);

                return;
              }
              setHasClickedMarker(true);
              navigator.clipboard.writeText(marker.name);

              setTimeout(() => {
                setHasClickedMarker(false);
              }, 2000);
            }}
          >
            <div className='relative h-4 w-4 flex items-center cursor-pointer marker'>
              {marker.name && <Tooltip title={hasClickedMarker ? 'Adresse kopiert' : marker.name} />}
            </div>
          </Marker>
        ))}
      </ReactMapGL>
    </>
  );
}