import React from 'react'
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function MapComponent() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={13}
        defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
        onCameraChanged={(ev) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        style={{ height: '100vh', width: '100%' }} 
        />
    </APIProvider>
  )
}

export default MapComponent
