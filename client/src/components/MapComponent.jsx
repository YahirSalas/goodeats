import React from 'react'
import {APIProvider, Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function MapComponent() {
  const [pois, setPois] = useState([]); 
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.5647, lng: -99.7479 })
  const location = useLocation();
  const dealLocation = location.state?.dealLocation; 

  console.log('Deal Location:', dealLocation);

  // Fetches Data from Supabase
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

  // Fetches the Users Lat and Lng using geolocation API
  const fetchUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude }); 
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError('Geolocation is not supported by this browser.');
    }
  };

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

  useEffect(() => {
    if (dealLocation) {
      console.log('Updating map center to deal location:', dealLocation); // Debugging
      setMapCenter(dealLocation); // Update the map center to the deal's location
    }
    fetchData();
  }, [dealLocation]);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={20}
        center={mapCenter}
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
