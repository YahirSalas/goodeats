// src/components/FoodTypeSelect.jsx
export default function FoodTypeSelect({ value, onChange }) {
    const options = ['Mexican', 'Pizza', 'Vegan', 'Dessert', 'Asian', 'Burgers', 'Drinks', 'Other'];
  
    return (
      <div>
        <label className="block font-semibold mb-1">Food Type</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="" disabled>Select a food type</option>
          {options.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
    );
  }
  