// src/components/FilterDropdown.jsx
import { useState } from 'react';

export default function FilterDropdown({ onApply }) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState([]);
  const [discount, setDiscount] = useState('');
  const [foodTypes, setFoodTypes] = useState([]);
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('');

  const foodOptions = ['Burgers', 'Tacos', 'Asian', 'Vegan', 'Dessert', 'Coffee'];

  const toggleCheckbox = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter(item => item !== value)
        : [...list, value]
    );
  };

  const handleApply = () => {
    onApply({ price, discount, foodTypes, availability, sort });
    setOpen(false);
  };

  const clearAll = () => {
    setPrice([]);
    setDiscount('');
    setFoodTypes([]);
    setAvailability('');
    setSort('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-100 border rounded px-4 py-2"
      >
        {open ? 'Close Filters' : 'Filter Deals ⏷'}
      </button>

      {open && (
        <div className="absolute z-10 bg-white border mt-2 rounded p-4 shadow w-[300px] space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Price</h3>
            {['$', '$$', '$$$'].map(label => (
              <label key={label} className="block text-sm">
                <input
                  type="checkbox"
                  checked={price.includes(label)}
                  onChange={() => toggleCheckbox(label, price, setPrice)}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Discount</h3>
            <select
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              className="w-full border p-1 rounded text-sm"
            >
              <option value="">Any</option>
              <option value="10">10%+</option>
              <option value="25">25%+</option>
              <option value="50">50%+</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Food Type</h3>
            {foodOptions.map(type => (
              <label key={type} className="block text-sm">
                <input
                  type="checkbox"
                  checked={foodTypes.includes(type)}
                  onChange={() => toggleCheckbox(type, foodTypes, setFoodTypes)}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Availability</h3>
            {['recurring', 'limited', ''].map(opt => (
              <label key={opt} className="block text-sm">
                <input
                  type="radio"
                  name="availability"
                  value={opt}
                  checked={availability === opt}
                  onChange={e => setAvailability(e.target.value)}
                  className="mr-2"
                />
                {opt === '' ? 'Any' : opt[0].toUpperCase() + opt.slice(1)}
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Sort</h3>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full border p-1 rounded text-sm"
            >
              <option value="">Default</option>
              <option value="best">Best Deal</option>
              <option value="near">Closest</option>
              <option value="ending">Ending Soon</option>
              <option value="new">Newest</option>
            </select>
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={clearAll} className="text-sm text-gray-500 underline">Clear</button>
            <button onClick={handleApply} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}