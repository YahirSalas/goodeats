import React from 'react'
import {APIProvider, Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';


function MapComponent() {

  const [pois, setPois] = useState([]); 
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const { data, error } = await supabase.from('restaurants').select();
    if (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
    } else {
      const transformedData = data.map((item) => ({
        key: item.name, 
        location: item.coordinates, 
      }));
      setPois(transformedData); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [lat, lng] = [39.564700334562666, -99.74791291424387]

  const PoiMarkers = (props) => {
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
  ];

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={5}
        defaultCenter={ { lat, lng } }
        mapId="98088ef21ac2107fb7724af0"
        onCameraChanged={(ev) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        style={{ height: '100vh', width: '100%' }} >
        <PoiMarkers pois={pois} />
      </Map>
    </APIProvider>
  )
}

export default MapComponent
