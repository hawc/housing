import React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';

// import 'mapbox-gl/src/css/mapbox-gl.css';

export default function Map({ lat, lng }: { lat: number, lng: number }) {
  return (
    <>
      <ReactMapGL
        style={{ height: '400px' }}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 12
        }}
        mapStyle="mapbox://styles/hawc/clk5ql67s00ie01pdadkx2kbb"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      >
        <Marker
          latitude={lat}
          longitude={lng}

        >
          <div style={{ background: 'var(--highlight)', width: '20px', height: '20px' }}></div>
        </Marker>
      </ReactMapGL>
    </>
  );
}