import React from 'react'
import {APIProvider, Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function MapComponent() {
  const [pois, setPois] = useState([]); 
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.5647, lng: -99.7479 })
  const [zoom, setZoom] = useState(5)
  const [isProgrammaticUpdate, setIsProgrammaticUpdate] = useState(false); 
  const location = useLocation();
  const dealLocation = location.state?.dealLocation; 

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

  const setMapView = (center, zoom) => {
    setIsProgrammaticUpdate(true);
    setMapCenter(center);
    setZoom(zoom);
  };

  // Fetches the Users Lat and Lng using geolocation API
  const fetchUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapView({ lat: latitude, lng: longitude }, 12); // Update the map center to the User's Location
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
      setIsProgrammaticUpdate(true);
      setMapView(dealLocation, 15); // Update the map center to the deal's location
    }
    fetchData();
  }, [dealLocation]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          zoom={zoom}
          center={mapCenter}
          mapId="98088ef21ac2107fb7724af0"
          onCameraChanged={(ev) =>{
            if (!isProgrammaticUpdate) {
              setMapCenter(ev.detail.center);
              setZoom(ev.detail.zoom);
            }
            setIsProgrammaticUpdate(false);
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }}
          style={{ height: '100vh', width: '100%' }} >
          <PoiMarkers pois={pois} />
        </Map>
      </APIProvider>
      {/* Me Button */}
      <button
      onClick={fetchUserLocation}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#FFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      >
        Me
      </button>

      {/* Default Center Button */}
      <button
        onClick={() => setMapView({ lat: 39.5647, lng: -99.7479 }, 4)} 
        style={{
          position: 'absolute',
          top: '50px', // Position below the "Me" button
          right: '10px',
          zIndex: 1000,
          padding: '10px 15px',
          backgroundColor: '#28A745',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Center
      </button>
    </div>
  )
}

export default MapComponent
