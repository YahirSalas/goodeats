// src/helper/googleUtils.js
export function getStoreDetailsFromPlaceId(placeId, callback) {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
  
    const request = {
      placeId: placeId,
      fields: ['name', 'place_id', 'geometry', 'formatted_address', 'opening_hours'],
    };
  
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        callback(place);
      } else {
        console.error('Google Places failed:', status);
      }
    });
  }
  