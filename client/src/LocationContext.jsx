import React, { createContext, useState, useContext } from 'react';

// Create the context
const LocationContext = createContext();

// Create a provider component
export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({ lat: null, lng: null, city: null }); // Store lat, lng, and city

    // Fetches the Users Lat and Lng using geolocation API
    const fetchUserLocation = async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
      
              try {
                const response = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
                );
                const data = await response.json();
      
                if (data.results.length > 0) {
                  const cityComponent = data.results[0].address_components.find((component) =>
                    component.types.includes('locality')
                  );
                  const cityName = cityComponent?.long_name || 'Unknown City';
                  console.log('City:', cityName);
      
                  // Update location state
                  setLocation({ lat: latitude, lng: longitude, city: cityName });
                } else {
                  console.warn('No address results found.');
                  setLocation({ lat: latitude, lng: longitude, city: 'Unknown City' });
                }
              } catch (error) {
                console.error('Error fetching city name:', error);
                setError('Failed to fetch city name.');
              }
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
      
  return (
    <LocationContext.Provider value={{ location, fetchUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);