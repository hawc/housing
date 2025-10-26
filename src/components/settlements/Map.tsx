'use client';

import mask from '@turf/mask';
import { FeatureCollection, Polygon } from 'geojson';
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Map as MapboxMap, MapRef, Marker } from 'react-map-gl/mapbox';
import './map.css';

import type { BaseLocation, Location } from '@/lib/types';

import { MapTooltip } from '@/components/settlements/MapTooltip';
import { isSettlementFound } from '@/utils/isSettlementFound';
import { ClipLayerSpecification } from 'mapbox-gl';
import { Layer, Source } from 'react-map-gl/mapbox';

const eraser: ClipLayerSpecification = {
  id: 'eraser',
  type: 'clip',
  source: 'eraser',
  layout: {
    'clip-layer-types': ['model'],
  },
};

export interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  markers: (BaseLocation | Location)[];
  center: Coordinates;
  geo?: Polygon;
  zoom?: number;
  searchTerm?: string;
}

export function Map({
  markers,
  center,
  geo,
  zoom = 15,
  searchTerm = '',
}: MapProps) {
  const router = useRouter();
  const [hasClickedMarker, setHasClickedMarker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef(null);

  const handleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
    const t = setTimeout(() => {
      (mapRef.current as null | MapRef)?.resize();
    }, 40);

    return () => {
      clearTimeout(t);
    };
  }, [isExpanded]);

  const maskedGeoCollection: FeatureCollection | undefined = useMemo(() => {
    if (!geo) {
      return;
    }

    const masked = mask(geo);

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: masked.geometry,
          properties: {},
        },
      ],
    };
  }, [geo]);

  const handleClick = useCallback(
    (marker) => {
      if (hasClickedMarker) {
        setHasClickedMarker(false);

        return;
      }
      setHasClickedMarker(true);
      navigator.clipboard.writeText(marker.name);

      const t = setTimeout(() => {
        setHasClickedMarker(false);
      }, 2000);

      return () => {
        clearTimeout(t);
      };
    },
    [hasClickedMarker],
  );

  return (
    <div className='mapbox-map'>
      <MapboxMap
        ref={mapRef}
        style={{ height: isExpanded ? '800px' : '400px' }}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: zoom,
        }}
        mapStyle='mapbox://styles/hawc/clk5ql67s00ie01pdadkx2kbb'
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        cooperativeGestures
        maxZoom={18}
        minZoom={4.3}
      >
        {maskedGeoCollection && (
          <Source id='my-data' type='geojson' data={maskedGeoCollection}>
            <Layer {...eraser} />
          </Source>
        )}
        {markers.map((marker) =>
          'settlement' in marker ? (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              latitude={marker.lat}
              longitude={marker.lng}
              onClick={() =>
                router.push(`/siedlungen/${marker.settlement.slug}`)
              }
            >
              <div
                className={`relative h-4 w-4 flex items-center cursor-pointer marker ${
                  !isSettlementFound(
                    marker.settlement.name,
                    marker.city,
                    searchTerm,
                  ) && 'marker-disabled'
                }`}
              >
                <MapTooltip title={marker.settlement.name} />
              </div>
            </Marker>
          ) : (
            <Marker
              key={`${marker.lat}-${marker.lng}`}
              latitude={marker.lat}
              longitude={marker.lng}
              onClick={() => handleClick(marker)}
            >
              <div className='relative h-4 w-4 flex items-center cursor-pointer marker'>
                {marker.name && (
                  <MapTooltip
                    title={hasClickedMarker ? 'Adresse kopiert' : marker.name}
                  />
                )}
              </div>
            </Marker>
          ),
        )}
      </MapboxMap>
      <button className='mapbox-button' type='button' onClick={handleExpand}>
        {isExpanded ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
      </button>
    </div>
  );
}
