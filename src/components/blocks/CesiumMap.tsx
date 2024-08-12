import { ArcGisMapServerImageryProvider, Cartesian3 } from 'cesium';
import { Entity, ImageryLayer, Viewer } from 'resium';

export default function Map() {
  return (
    <Viewer full>
      <ImageryLayer
        imageryProvider={new ArcGisMapServerImageryProvider({
          // url: '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        })} />
      <Entity
        description="test"
        name="tokyo"
        point={{ pixelSize: 10 }}
        position={Cartesian3.fromDegrees(139.767052, 35.681167, 100)}
      />
    </Viewer>
  );
}