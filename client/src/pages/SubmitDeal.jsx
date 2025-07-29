import { useState } from 'react';
import usePlacesAutocomplete from '../hooks/usePlacesAutocomplete';
import { getStoreDetailsFromPlaceId } from '../helper/googleUtils';

import DealAvailability from '../components/DealAvailability';
import PriceInput from '../components/PriceInput';
import FoodTypeSelect from '../components/FoodTypeSelect';

import { supabase } from '../supabaseClient';

const user = await supabase.auth.getUser();
const userId = user?.data?.user?.id; 

export default function SubmitDeal() {
  const [storeData, setStoreData] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPercent, setIsPercent] = useState(false);
  const [amount, setAmount] = useState('');
  const [foodType, setFoodType] = useState('');
  const [availability, setAvailability] = useState(null);


  const handlePlaceSelect = (place) => {
    if (place && place.place_id) {
      getStoreDetailsFromPlaceId(place.place_id, setStoreData);
    }
  };

  const inputRef = usePlacesAutocomplete(handlePlaceSelect);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Check if restaurant exists
      const restaurantRes = await fetch("http://localhost:5000/api/restaurants/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: storeData.place_id })
      });

      const restaurantData = await restaurantRes.json();
      let restaurant_id;

      if (restaurantData.exists) {
        restaurant_id = restaurantData.restaurant.id;
      } else {
        // Step 2: Create new restaurant
        const newRes = await fetch("http://localhost:5000/api/restaurants/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: storeData.name,
            address: storeData.formatted_address,
            place_id: storeData.place_id,
            coordinates: {
              lat: storeData.geometry.location.lat(),
              lng: storeData.geometry.location.lng()
            }
          })
        });

        const newRestaurant = await newRes.json();
        restaurant_id = newRestaurant.id;
      }

      // Step 3: Submit deal
      const payload = {
        restaurant_id,
        title,
        description,
        price: !isPercent ? amount : null,
        discount: isPercent ? amount : null,
        food_types: foodType,
        availability,
        created_by: userId
      };

      const dealRes = await fetch("http://localhost:5000/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await dealRes.json();
      console.log("Deal submitted:", result);
      alert("Deal submitted successfully!");

      // Reset form
      setTitle('');
      setDescription('');
      setAmount('');
      setFoodType('');
      setAvailability(null);
      setStoreData(null);
    } catch (err) {
      console.error("Error submitting deal", err);
      alert("Error submitting deal.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Submit a New Deal</h2>

      {!storeData ? (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Search for a restaurant</label>
          <input
            ref={inputRef}
            className="w-full border p-2"
            placeholder="e.g. Tacos El Gordo"
          />
          <p className="text-sm text-gray-500 mt-1">Select from dropdown to continue</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border bg-gray-50 rounded">
            <p><strong>Store:</strong> {storeData.name}</p>
            <p><strong>Address:</strong> {storeData.formatted_address}</p>
          </div>

          <div>
            <label className="block font-semibold">Deal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 mt-1"
              rows="3"
              required
            />
          </div>

          <PriceInput
            isPercent={isPercent}
            setIsPercent={setIsPercent}
            amount={amount}
            setAmount={setAmount}
          />

          <FoodTypeSelect
            value={foodType}
            onChange={setFoodType}
          />

          <DealAvailability
            storeHours={storeData.opening_hours}
            availability={availability}
            setAvailability={setAvailability}
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded"
          >
            Submit Deal
          </button>
        </form>
      )}
    </div>
  );
}
