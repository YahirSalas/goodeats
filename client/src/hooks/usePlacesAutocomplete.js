import { useEffect, useRef } from 'react'

export default function usePlacesAutocomplete(onPlaceSelect) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment'], // restaurant, cafe, etc.
      fields: ['place_id', 'name', 'geometry', 'formatted_address']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place && onPlaceSelect) {
        onPlaceSelect(place)
      }
    })
  }, [onPlaceSelect])

  return inputRef
}
