import React from 'react'
import {APIProvider, Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import { supabase } from '../helper/supabaseClient';


function MapComponent() {
  
  const [lat, lng] = [40.717623812588265, -73.99448636081593]

  const PoiMarkers = (props ) => {
    return (
      <>
        {props.pois.map( (poi) => (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}>
          <Pin background={'#FF0000'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    );
  };

  const locations = [
    { key: 'Wah Fun No1', location: { lat: 40.717623812588265, lng: -73.99448636081593 } },
  ];

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={13}
        defaultCenter={ { lat: lat, lng: lng } }
        mapId="98088ef21ac2107fb7724af0"
        onCameraChanged={(ev) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        style={{ height: '100vh', width: '100%' }} >
        <PoiMarkers pois={locations} />
      </Map>
    </APIProvider>
  )
}

export default MapComponent
